import { useState, useCallback } from 'react';
import { fetchMoxfieldDeck, transformMoxfieldCards } from '@/api/moxfield';
import { useDeckStore } from '@/store/deckStore';
import { diffCardLists, findStaleRefs, isDiffEmpty } from '@/utils/deckDiff';
import type { DeckDiffResult } from '@/utils/deckDiff';

export interface RefreshDiff {
  mainboard: DeckDiffResult;
  sideboard: DeckDiffResult;
  affectedMatchups: string[];
}

export function useRefreshMoxfield() {
  const [refreshing, setRefreshing] = useState(false);
  const [lastDiff, setLastDiff] = useState<RefreshDiff | null>(null);
  const refreshFromMoxfield = useDeckStore((state) => state.refreshFromMoxfield);
  const deck = useDeckStore((state) => state.deck);

  const refresh = useCallback(async () => {
    if (!deck || refreshing) return;
    setRefreshing(true);
    try {
      const moxfieldDeck = await fetchMoxfieldDeck(deck.deckId);
      const newMainboard = transformMoxfieldCards(moxfieldDeck.mainboard);
      const newSideboard = transformMoxfieldCards(moxfieldDeck.sideboard);

      // Compute diff before applying
      const mainDiff = diffCardLists(deck.mainboard, newMainboard);
      const sideDiff = diffCardLists(deck.sideboard, newSideboard);

      refreshFromMoxfield(newMainboard, newSideboard, moxfieldDeck.format);

      // Find matchups affected by removed/changed cards
      const staleByMatchup = findStaleRefs(deck.matchups, newMainboard, newSideboard);
      const affectedMatchups = deck.matchups
        .filter((m) => staleByMatchup.has(m.id))
        .map((m) => m.name);

      const hasChanges = !isDiffEmpty(mainDiff) || !isDiffEmpty(sideDiff);
      setLastDiff(hasChanges ? { mainboard: mainDiff, sideboard: sideDiff, affectedMatchups } : null);
    } catch (err) {
      console.error('Failed to refresh from Moxfield:', err);
    } finally {
      setRefreshing(false);
    }
  }, [deck, refreshing, refreshFromMoxfield]);

  const dismissDiff = useCallback(() => setLastDiff(null), []);

  return { refresh, refreshing, lastDiff, dismissDiff };
}
