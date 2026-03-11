import { useState, useCallback } from 'react';
import { fetchMoxfieldDeck, transformMoxfieldCards } from '@/api/moxfield';
import { useDeckStore } from '@/store/deckStore';

export function useRefreshMoxfield() {
  const [refreshing, setRefreshing] = useState(false);
  const refreshFromMoxfield = useDeckStore((state) => state.refreshFromMoxfield);
  const deck = useDeckStore((state) => state.deck);

  const refresh = useCallback(async () => {
    if (!deck || refreshing) return;
    setRefreshing(true);
    try {
      const moxfieldDeck = await fetchMoxfieldDeck(deck.deckId);
      const mainboard = transformMoxfieldCards(moxfieldDeck.mainboard);
      const sideboard = transformMoxfieldCards(moxfieldDeck.sideboard);
      refreshFromMoxfield(mainboard, sideboard, moxfieldDeck.format);
    } catch (err) {
      console.error('Failed to refresh from Moxfield:', err);
    } finally {
      setRefreshing(false);
    }
  }, [deck, refreshing, refreshFromMoxfield]);

  return { refresh, refreshing };
}
