import { useParams } from 'react-router-dom';
import { useDeckStore } from '@/store/deckStore';
import { useDeckPage } from '@/hooks/useDeckPage';
import { DeckHeader } from '@/components/deck/DeckHeader';
import { MatchupList } from '@/components/deck/MatchupList';
import { AddMatchupDialog } from '@/components/deck/AddMatchupDialog';
import { CardPreview } from '@/components/deck/CardPreview';
import { HistoryPanel } from '@/components/history/HistoryPanel';
import { ImportExportButtons } from '@/components/import/ImportExportButtons';
import { AuthorNameInput } from '@/components/shared/AuthorNameInput';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorBanner } from '@/components/shared/ErrorBanner';

export function DeckPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const {
    isLoading, error, refetch, deck,
    authorName, setAuthorName,
    showAddDialog, setShowAddDialog,
    showHistory, setShowHistory,
    refreshMoxfield, refreshing,
    handleAddMatchup, handleDeleteMatchup, handleRenameMatchup, handleRevert,
  } = useDeckPage(deckId);

  if (isLoading) return <LoadingSpinner message="Loading deck..." />;
  if (error) return <ErrorBanner message={error.message} onRetry={() => refetch()} />;
  if (!deck) return <ErrorBanner message="Deck not found" />;

  return (
    <div className="space-y-6">
      <DeckHeader deck={deck} onRefreshMoxfield={refreshMoxfield} refreshing={refreshing} />

      {!authorName && <AuthorNameInput onSet={setAuthorName} />}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Matchups</h2>
          <div className="flex gap-2">
            <button onClick={() => setShowHistory(true)} className="btn-secondary" title="View edit history">
              History
            </button>
            <button onClick={() => setShowAddDialog(true)} disabled={!authorName} className="btn-primary disabled:opacity-50">
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
      <CardPreview mainboard={deck.mainboard} sideboard={deck.sideboard} />

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
