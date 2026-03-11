import { useState } from 'react';
import { useDeck } from '@/hooks/useDeck';
import { useDeckStore } from '@/store/deckStore';
import { useRefreshMoxfield } from '@/hooks/useRefreshMoxfield';
import { getAuthorName } from '@/db/localstorage';

export function useDeckPage(deckId?: string) {
  const { isLoading, error, refetch } = useDeck(deckId);
  const deck = useDeckStore((state) => state.deck);
  const addMatchup = useDeckStore((state) => state.addMatchup);
  const removeMatchup = useDeckStore((state) => state.removeMatchup);
  const renameMatchup = useDeckStore((state) => state.renameMatchup);
  const snapshotHistory = useDeckStore((state) => state.snapshotHistory);
  const revertToHistory = useDeckStore((state) => state.revertToHistory);
  const { refresh: refreshMoxfield, refreshing } = useRefreshMoxfield();

  const [showAddMatchup, setShowAddMatchup] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [authorName, setAuthorName] = useState(() => getAuthorName());

  function handleAddMatchup(name: string) {
    if (!authorName) return;
    snapshotHistory(authorName, `Added matchup: ${name}`);
    addMatchup(name);
  }

  function handleDeleteMatchup(matchupId: string) {
    const targetMatchup = deck?.matchups.find((matchup) => matchup.id === matchupId);
    if (!authorName || !targetMatchup) return;
    snapshotHistory(authorName, `Deleted matchup: ${targetMatchup.name}`);
    removeMatchup(matchupId);
  }

  function handleRenameMatchup(matchupId: string, name: string) {
    const targetMatchup = deck?.matchups.find((matchup) => matchup.id === matchupId);
    if (!authorName || !targetMatchup) return;
    snapshotHistory(authorName, `Renamed matchup: ${targetMatchup.name} -> ${name}`);
    renameMatchup(matchupId, name);
  }

  function handleRevert(entryId: string) {
    if (!authorName) return;
    revertToHistory(entryId, authorName);
  }

  return {
    isLoading,
    error,
    refetch,
    deck,
    authorName,
    setAuthorName,
    showAddMatchup,
    setShowAddMatchup,
    showHistory,
    setShowHistory,
    refreshMoxfield,
    refreshing,
    handleAddMatchup,
    handleDeleteMatchup,
    handleRenameMatchup,
    handleRevert,
  };
}
