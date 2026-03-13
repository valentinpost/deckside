import { useState } from 'react';
import { useDeck } from '@/hooks/useDeck';
import { useDeckStore } from '@/store/deckStore';
import { useRefreshMoxfield } from '@/hooks/useRefreshMoxfield';
import { getAuthorName } from '@/db/localstorage';
import { toSlug } from '@/utils/slug';
import type { StoredDeck, DeckColor, MatchResult } from '@/types/deck';

export function useDeckPage(deckId?: string) {
  const { isLoading, error, refetch } = useDeck(deckId);
  const deck = useDeckStore((state) => state.deck);
  const addMatchup = useDeckStore((state) => state.addMatchup);
  const addMatchResult = useDeckStore((state) => state.addMatchResult);
  const snapshotHistory = useDeckStore((state) => state.snapshotHistory);
  const revertToHistory = useDeckStore((state) => state.revertToHistory);
  const setDeck = useDeckStore((state) => state.setDeck);
  const setDeckColor = useDeckStore((state) => state.setDeckColor);
  const setFaceCard = useDeckStore((state) => state.setFaceCard);
  const { refresh: refreshMoxfield, refreshing, lastDiff, dismissDiff } = useRefreshMoxfield();

  const [showHistory, setShowHistory] = useState(false);
  const [authorName, setAuthorName] = useState(() => getAuthorName());

  /** Creates a matchup with a default name and returns its slug for navigation. */
  function handleAddMatchup(): string | undefined {
    if (!authorName || !deck) return undefined;
    const baseName = 'New Matchup';
    const existingSlugs = new Set(deck.matchups.map((m) => m.slug));
    let name = baseName;
    let counter = 2;
    while (existingSlugs.has(toSlug(name))) {
      name = `${baseName} ${counter}`;
      counter++;
    }
    snapshotHistory(authorName, `Added matchup: ${name}`);
    addMatchup(name);
    return toSlug(name);
  }

  function handleRevert(entryId: string) {
    if (!authorName) return;
    revertToHistory(entryId, authorName);
  }

  function handleImport(imported: StoredDeck) {
    setDeck(imported);
  }

  function handleColorChange(color: DeckColor) {
    setDeckColor(color);
  }

  function handleFaceCardSelect(scryfallId: string | undefined) {
    setFaceCard(scryfallId);
  }

  function handleAddResult(matchupId: string, result: Omit<MatchResult, 'id' | 'timestamp'>) {
    addMatchResult(matchupId, result);
  }

  return {
    isLoading,
    error,
    refetch,
    deck,
    authorName,
    setAuthorName,
    showHistory,
    setShowHistory,
    refreshMoxfield,
    refreshing,
    lastDiff,
    dismissDiff,
    handleAddMatchup,
    handleAddResult,
    handleRevert,
    handleImport,
    handleColorChange,
    handleFaceCardSelect,
  };
}
