import { useParams } from 'react-router-dom';
import { useDeckStore } from '@/store/deckStore';
import { useDeckPage } from '@/hooks/useDeckPage';
import { DeckHeader } from '@/components/deck/DeckHeader';
import { MatchupList } from '@/components/deck/MatchupList';
import { AddMatchupInline } from '@/components/deck/AddMatchupInline';
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
    <div className="deck-page">
      <DeckHeader deck={deck} onRefreshMoxfield={refreshMoxfield} refreshing={refreshing} />

      {!authorName && <AuthorNameInput onSet={setAuthorName} />}

      <div className="matchups-section">
        <div className="matchups-header">
          <h2 className="matchups-title">Matchups</h2>
          <div className="button-group">
            <button onClick={() => setShowHistory(true)} className="btn-secondary" title="View edit history">
              History
            </button>
            {!showAddDialog && (
              <button onClick={() => setShowAddDialog(true)} disabled={!authorName} className="btn-primary">
                + Add Matchup
              </button>
            )}
          </div>
        </div>
        <MatchupList
          deckId={deck.deckId}
          matchups={deck.matchups}
          onDelete={handleDeleteMatchup}
          onRename={handleRenameMatchup}
        />
        {showAddDialog && (
          <AddMatchupInline
            onAdd={(name) => { handleAddMatchup(name); setShowAddDialog(false); }}
            onCancel={() => setShowAddDialog(false)}
            existingSlugs={deck.matchups.map((m) => m.slug)}
          />
        )}
      </div>

      <ImportExportButtons deck={deck} onImport={(imported) => useDeckStore.getState().setDeck(imported)} />
      <CardPreview mainboard={deck.mainboard} sideboard={deck.sideboard} />
      <HistoryPanel
        history={deck.history}
        onRevert={handleRevert}
        open={showHistory}
        onClose={() => setShowHistory(false)}
      />
    </div>
  );
}
