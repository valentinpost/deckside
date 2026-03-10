import { useState, useCallback } from 'react';
import { fetchMoxfieldDeck, transformMoxfieldCards } from '@/api/moxfield';
import { useDeckStore } from '@/store/deckStore';

export function useRefreshMoxfield() {
  const [refreshing, setRefreshing] = useState(false);
  const refreshFromMoxfield = useDeckStore((s) => s.refreshFromMoxfield);
  const deck = useDeckStore((s) => s.deck);

  const refresh = useCallback(async () => {
    if (!deck || refreshing) return;
    setRefreshing(true);
    try {
      const moxfield = await fetchMoxfieldDeck(deck.deckId);
      const mainboard = transformMoxfieldCards(moxfield.mainboard);
      const sideboard = transformMoxfieldCards(moxfield.sideboard);
      refreshFromMoxfield(mainboard, sideboard);
    } catch (err) {
      console.error('Failed to refresh from Moxfield:', err);
    } finally {
      setRefreshing(false);
    }
  }, [deck, refreshing, refreshFromMoxfield]);

  return { refresh, refreshing };
}
