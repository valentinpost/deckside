import { useQuery } from '@tanstack/react-query';
import { fetchMoxfieldDeck, transformMoxfieldCards } from '@/api/moxfield';
import { fetchDeckFromCloud } from '@/api/cloudflare';
import { getCachedDeck, cacheDeck } from '@/db/indexeddb';
import { addRecentDeck } from '@/db/localstorage';
import { useDeckStore } from '@/store/deckStore';
import type { StoredDeck } from '@/types/deck';

async function loadDeck(deckId: string): Promise<StoredDeck> {
  // 1. Try IndexedDB cache first
  const cached = await getCachedDeck(deckId);

  // 2. Try Cloudflare KV
  let remote: StoredDeck | null = null;
  try {
    remote = await fetchDeckFromCloud(deckId);
  } catch {
    // Offline or worker not deployed yet — use cache
  }

  // Use whichever is newer
  if (remote && (!cached || remote.version > cached.version)) {
    await cacheDeck(remote);
    addRecentDeck({ deckId: remote.deckId, deckName: remote.deckName, lastOpened: Date.now() });
    return remote;
  }
  if (cached) {
    addRecentDeck({ deckId: cached.deckId, deckName: cached.deckName, lastOpened: Date.now() });
    return cached;
  }

  // 3. Neither exists — import fresh from Moxfield
  const moxfield = await fetchMoxfieldDeck(deckId);
  const deck: StoredDeck = {
    deckId,
    deckName: moxfield.name,
    moxfieldUrl: `https://www.moxfield.com/decks/${deckId}`,
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
