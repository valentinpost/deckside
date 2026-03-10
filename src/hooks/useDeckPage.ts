import { useState } from 'react';
import { useDeck } from '@/hooks/useDeck';
import { useDeckStore } from '@/store/deckStore';
import { useRefreshMoxfield } from '@/hooks/useRefreshMoxfield';
import { getAuthorName } from '@/db/localstorage';

export function useDeckPage(deckId?: string) {
  const { isLoading, error, refetch } = useDeck(deckId);
  const deck = useDeckStore((s) => s.deck);
  const addMatchup = useDeckStore((s) => s.addMatchup);
  const removeMatchup = useDeckStore((s) => s.removeMatchup);
  const renameMatchup = useDeckStore((s) => s.renameMatchup);
  const snapshotHistory = useDeckStore((s) => s.snapshotHistory);
  const revertToHistory = useDeckStore((s) => s.revertToHistory);
  const { refresh: refreshMoxfield, refreshing } = useRefreshMoxfield();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [authorName, setAuthorName] = useState(() => getAuthorName());

  function handleAddMatchup(name: string) {
    if (!authorName) return;
    snapshotHistory(authorName, `Added matchup: ${name}`);
    addMatchup(name);
  }

  function handleDeleteMatchup(matchupId: string) {
    const matchup = deck?.matchups.find((m) => m.id === matchupId);
    if (!authorName || !matchup) return;
    snapshotHistory(authorName, `Deleted matchup: ${matchup.name}`);
    removeMatchup(matchupId);
  }

  function handleRenameMatchup(matchupId: string, name: string) {
    const matchup = deck?.matchups.find((m) => m.id === matchupId);
    if (!authorName || !matchup) return;
    snapshotHistory(authorName, `Renamed matchup: ${matchup.name} -> ${name}`);
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
    showAddDialog,
    setShowAddDialog,
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
