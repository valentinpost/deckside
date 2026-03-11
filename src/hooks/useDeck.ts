import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMoxfieldDeck, transformMoxfieldCards, scryfallImageUrl } from '@/api/moxfield';
import { fetchDeckFromCloud } from '@/api/cloudflare';
import { getCachedDeck, cacheDeck } from '@/db/indexeddb';
import { addRecentDeck } from '@/db/localstorage';
import { buildMoxfieldUrl } from '@/utils/moxfieldUrl';
import { useDeckStore } from '@/store/deckStore';
import { notifyRecentDecksChanged } from '@/hooks/useRecentDecks';
import type { StoredDeck, Card } from '@/types/deck';

/** Rebuild missing image URLs from scryfallId (migrates old cached data).
 *  Returns true if any cards were migrated. */
function migrateImageUrls(cards: Card[]): boolean {
  let migrated = false;
  for (const card of cards) {
    if (!card.imageUrl && card.scryfallId) {
      card.imageUrl = scryfallImageUrl(card.scryfallId);
      migrated = true;
    }
  }
  return migrated;
}

/** Apply image URL migration to both mainboard and sideboard.
 *  Returns true if any cards were migrated. */
function applyImageMigration(deck: StoredDeck): boolean {
  const mainboardMigrated = migrateImageUrls(deck.mainboard);
  const sideboardMigrated = migrateImageUrls(deck.sideboard);
  if (mainboardMigrated || sideboardMigrated) {
    console.log('[loadDeck] Migrated missing image URLs');
  }
  return mainboardMigrated || sideboardMigrated;
}

/** Add deck to recent decks list and notify subscribers */
function registerRecentDeck(deck: StoredDeck) {
  addRecentDeck({
    deckId: deck.deckId,
    deckName: deck.deckName,
    format: deck.format,
    lastOpened: Date.now(),
    deckColor: deck.deckColor,
    faceCardId: deck.faceCardId,
  });
  notifyRecentDecksChanged();
}

async function loadDeck(deckId: string): Promise<StoredDeck> {
  // If the Zustand store already has this deck, return it directly.
  // The store is the authoritative source once a deck is loaded —
  // it contains local edits that aren't in IndexedDB/KV yet.
  const existingDeck = useDeckStore.getState().deck;
  if (existingDeck && existingDeck.deckId === deckId) {
    return existingDeck;
  }

  console.log(`[loadDeck] Starting load for ${deckId}`);

  // 1. Try IndexedDB cache first
  let cachedDeck: StoredDeck | undefined;
  try {
    cachedDeck = await getCachedDeck(deckId);
    console.log(`[loadDeck] IndexedDB cache: ${cachedDeck ? `found v${cachedDeck.version}` : 'miss'}`);
  } catch (err) {
    console.error('[loadDeck] IndexedDB read failed:', err);
  }

  // 2. Try Cloudflare KV
  let remoteDeck: StoredDeck | null = null;
  try {
    remoteDeck = await fetchDeckFromCloud(deckId);
    console.log(`[loadDeck] Cloud fetch: ${remoteDeck ? `found v${remoteDeck.version}` : '404'}`);
  } catch (err) {
    console.error('[loadDeck] Cloud fetch failed:', err);
  }

  // Use whichever is newer
  if (remoteDeck && (!cachedDeck || remoteDeck.version > cachedDeck.version)) {
    console.log('[loadDeck] Using remote data');
    applyImageMigration(remoteDeck);
    await cacheDeck(remoteDeck);
    registerRecentDeck(remoteDeck);
    return remoteDeck;
  }
  if (cachedDeck) {
    console.log('[loadDeck] Using cached data');
    if (applyImageMigration(cachedDeck)) {
      await cacheDeck(cachedDeck);
    }
    registerRecentDeck(cachedDeck);
    return cachedDeck;
  }

  // 3. Neither exists — import fresh from Moxfield
  console.log('[loadDeck] No cache or remote — fetching from Moxfield');
  const moxfieldDeck = await fetchMoxfieldDeck(deckId);
  console.log(`[loadDeck] Moxfield returned: ${moxfieldDeck.name} (${Object.keys(moxfieldDeck.mainboard).length} main, ${Object.keys(moxfieldDeck.sideboard).length} side)`);

  const freshDeck: StoredDeck = {
    deckId,
    deckName: moxfieldDeck.name,
    format: moxfieldDeck.format,
    moxfieldUrl: buildMoxfieldUrl(deckId),
    lastFetchedFromMoxfield: Date.now(),
    mainboard: transformMoxfieldCards(moxfieldDeck.mainboard),
    sideboard: transformMoxfieldCards(moxfieldDeck.sideboard),
    matchups: [],
    history: [],
    version: 1,
  };

  await cacheDeck(freshDeck);
  registerRecentDeck(freshDeck);
  return freshDeck;
}

export function useDeck(deckId: string | undefined) {
  const setDeck = useDeckStore((state) => state.setDeck);
  const storeDeckId = useDeckStore((state) => state.deck?.deckId);

  const query = useQuery({
    queryKey: ['deck', deckId],
    queryFn: () => loadDeck(deckId!),
    enabled: !!deckId,
    staleTime: Infinity,
  });

  // Seed the Zustand store when we have data for a different deck
  // than what's currently in the store.
  useEffect(() => {
    if (query.data && query.data.deckId !== storeDeckId) {
      setDeck(query.data);
    }
  }, [query.data, storeDeckId, setDeck]);

  return query;
}
