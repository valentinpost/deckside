import { useQuery } from '@tanstack/react-query';
import { fetchMoxfieldDeck, transformMoxfieldCards, scryfallImageUrl } from '@/api/moxfield';
import { fetchDeckFromCloud } from '@/api/cloudflare';
import { getCachedDeck, cacheDeck } from '@/db/indexeddb';
import { addRecentDeck } from '@/db/localstorage';
import { buildMoxfieldUrl } from '@/utils/moxfieldUrl';
import { useDeckStore } from '@/store/deckStore';
import type { StoredDeck, Card } from '@/types/deck';

/** Rebuild missing image URLs from scryfallId (migrates old cached data) */
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

async function loadDeck(deckId: string): Promise<StoredDeck> {
  console.log(`[loadDeck] Starting load for ${deckId}`);

  // 1. Try IndexedDB cache first
  let cached: StoredDeck | undefined;
  try {
    cached = await getCachedDeck(deckId);
    console.log(`[loadDeck] IndexedDB cache: ${cached ? `found v${cached.version}` : 'miss'}`);
  } catch (err) {
    console.error('[loadDeck] IndexedDB read failed:', err);
  }

  // 2. Try Cloudflare KV
  let remote: StoredDeck | null = null;
  try {
    remote = await fetchDeckFromCloud(deckId);
    console.log(`[loadDeck] Cloud fetch: ${remote ? `found v${remote.version}` : '404'}`);
  } catch (err) {
    console.error('[loadDeck] Cloud fetch failed:', err);
  }

  // Use whichever is newer
  if (remote && (!cached || remote.version > cached.version)) {
    console.log('[loadDeck] Using remote data');
    const m1 = migrateImageUrls(remote.mainboard);
    const m2 = migrateImageUrls(remote.sideboard);
    if (m1 || m2) console.log('[loadDeck] Migrated missing image URLs');
    await cacheDeck(remote);
    addRecentDeck({ deckId: remote.deckId, deckName: remote.deckName, lastOpened: Date.now() });
    return remote;
  }
  if (cached) {
    console.log('[loadDeck] Using cached data');
    const c1 = migrateImageUrls(cached.mainboard);
    const c2 = migrateImageUrls(cached.sideboard);
    if (c1 || c2) {
      console.log('[loadDeck] Migrated missing image URLs');
      await cacheDeck(cached);
    }
    addRecentDeck({ deckId: cached.deckId, deckName: cached.deckName, lastOpened: Date.now() });
    return cached;
  }

  // 3. Neither exists — import fresh from Moxfield
  console.log('[loadDeck] No cache or remote — fetching from Moxfield');
  const moxfield = await fetchMoxfieldDeck(deckId);
  console.log(`[loadDeck] Moxfield returned: ${moxfield.name} (${Object.keys(moxfield.mainboard).length} main, ${Object.keys(moxfield.sideboard).length} side)`);

  const deck: StoredDeck = {
    deckId,
    deckName: moxfield.name,
    moxfieldUrl: buildMoxfieldUrl(deckId),
    lastFetchedFromMoxfield: Date.now(),
    mainboard: transformMoxfieldCards(moxfield.mainboard),
    sideboard: transformMoxfieldCards(moxfield.sideboard),
    matchups: [],
    history: [],
    version: 1,
  };

  await cacheDeck(deck);
  addRecentDeck({ deckId, deckName: deck.deckName, lastOpened: Date.now() });
  return deck;
}

export function useDeck(deckId: string | undefined) {
  const setDeck = useDeckStore((s) => s.setDeck);

  return useQuery({
    queryKey: ['deck', deckId],
    queryFn: async () => {
      const deck = await loadDeck(deckId!);
      setDeck(deck);
      return deck;
    },
    enabled: !!deckId,
  });
}
