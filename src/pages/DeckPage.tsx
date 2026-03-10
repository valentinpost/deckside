import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDeck } from '@/hooks/useDeck';
import { useDeckStore } from '@/store/deckStore';
import { useRefreshMoxfield } from '@/hooks/useRefreshMoxfield';
import { sumQuantities } from '@/utils/validation';
import { getAuthorName } from '@/db/localstorage';
import { DeckHeader } from '@/components/deck/DeckHeader';
import { MatchupList } from '@/components/deck/MatchupList';
import { AddMatchupDialog } from '@/components/deck/AddMatchupDialog';
import { CardGrid } from '@/components/matchup/CardGrid';
import { HistoryPanel } from '@/components/history/HistoryPanel';
import { ImportExportButtons } from '@/components/import/ImportExportButtons';
import { AuthorNameInput } from '@/components/shared/AuthorNameInput';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorBanner } from '@/components/shared/ErrorBanner';

export function DeckPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const { isLoading, error, refetch } = useDeck(deckId);
  const deck = useDeckStore((s) => s.deck);
  const addMatchup = useDeckStore((s) => s.addMatchup);
  const removeMatchup = useDeckStore((s) => s.removeMatchup);
  const renameMatchup = useDeckStore((s) => s.renameMatchup);
  const snapshotHistory = useDeckStore((s) => s.snapshotHistory);
  const revertToHistory = useDeckStore((s) => s.revertToHistory);
  const { refresh: refreshMoxfield, refreshing } = useRefreshMoxfield();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [authorName, setAuthorName] = useState(() => getAuthorName());

  if (isLoading) return <LoadingSpinner message="Loading deck..." />;
  if (error) return <ErrorBanner message={error.message} onRetry={() => refetch()} />;
  if (!deck) return <ErrorBanner message="Deck not found" />;

  function handleAddMatchup(name: string) {
    if (!authorName) return;
    snapshotHistory(authorName, `Added matchup: ${name}`);
    addMatchup(name);
  }

  function handleDeleteMatchup(matchupId: string) {
    const matchup = deck!.matchups.find((m) => m.id === matchupId);
    if (!authorName || !matchup) return;
    snapshotHistory(authorName, `Deleted matchup: ${matchup.name}`);
    removeMatchup(matchupId);
  }

  function handleRenameMatchup(matchupId: string, name: string) {
    const matchup = deck!.matchups.find((m) => m.id === matchupId);
    if (!authorName || !matchup) return;
    snapshotHistory(authorName, `Renamed matchup: ${matchup.name} -> ${name}`);
    renameMatchup(matchupId, name);
  }

  function handleRevert(entryId: string) {
    if (!authorName) return;
    revertToHistory(entryId, authorName);
  }

  return (
    <div className="space-y-6">
      <DeckHeader deck={deck} onRefreshMoxfield={refreshMoxfield} refreshing={refreshing} />

      {!authorName && <AuthorNameInput onSet={setAuthorName} />}

      {/* Matchups */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Matchups</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowHistory(true)}
              className="btn-secondary"
              title="View edit history"
            >
              History
            </button>
            <button
              onClick={() => setShowAddDialog(true)}
              disabled={!authorName}
              className="btn-primary disabled:opacity-50"
            >
              + Add Matchup
            </button>
          </div>
        </div>
        <MatchupList
          deckId={deck.deckId}
          matchups={deck.matchups}
          onDelete={handleDeleteMatchup}
          onRename={handleRenameMatchup}
        />
      </div>

      <ImportExportButtons deck={deck} onImport={(imported) => useDeckStore.getState().setDeck(imported)} />

      {/* Card preview toggle */}
      <div className="space-y-3">
        <button
          onClick={() => setShowCards(!showCards)}
          className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          {showCards ? 'Hide' : 'Show'} deck cards ({sumQuantities(deck.mainboard)} main / {sumQuantities(deck.sideboard)} side)
        </button>
        {showCards && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">Mainboard</h3>
              <CardGrid cards={deck.mainboard} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">Sideboard</h3>
              <CardGrid cards={deck.sideboard} />
            </div>
          </div>
        )}
      </div>

      <AddMatchupDialog
        open={showAddDialog}
        onAdd={handleAddMatchup}
        onClose={() => setShowAddDialog(false)}
        existingSlugs={deck.matchups.map((m) => m.slug)}
      />

      <HistoryPanel
        history={deck.history}
        onRevert={handleRevert}
        open={showHistory}
        onClose={() => setShowHistory(false)}
      />
    </div>
  );
}
