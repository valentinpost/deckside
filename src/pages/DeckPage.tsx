import { useParams } from 'react-router-dom';
import { useDeckPage } from '@/hooks/useDeckPage';
import { DeckHeader } from '@/components/deck/DeckHeader';
import { MatchupList } from '@/components/deck/MatchupList';
import { AddMatchupInline } from '@/components/deck/AddMatchupInline';
import { CardPreview } from '@/components/deck/CardPreview';
import { HistoryPanel } from '@/components/history/HistoryPanel';
import { AuthorNameInput } from '@/components/shared/AuthorNameInput';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorBanner } from '@/components/shared/ErrorBanner';

export function DeckPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const {
    isLoading, error, refetch, deck,
    authorName, setAuthorName,
    showAddMatchup, setShowAddMatchup,
    showHistory, setShowHistory,
    refreshMoxfield, refreshing,
    handleAddMatchup, handleDeleteMatchup, handleRenameMatchup, handleRevert,
    handleImport, handleColorChange, handleFaceCardSelect,
  } = useDeckPage(deckId);

  if (isLoading) return <LoadingSpinner message="Loading deck..." />;
  if (error) return <ErrorBanner message={error.message} onRetry={() => refetch()} />;
  if (!deck) return <ErrorBanner message="Deck not found" />;

  return (
    <div className="deck-page">
      <DeckHeader
        deck={deck}
        onRefreshMoxfield={refreshMoxfield}
        refreshing={refreshing}
        onImport={handleImport}
        onColorChange={handleColorChange}
      />

      {!authorName && <AuthorNameInput onSet={setAuthorName} />}

      <div className="matchups-section">
        <div className="matchups-header">
          <h2 className="matchups-title">Matchups</h2>
          <div className="button-group">
            <button onClick={() => setShowHistory(true)} className="btn-secondary" title="View edit history">
              History
            </button>
            {!showAddMatchup && (
              <button onClick={() => setShowAddMatchup(true)} disabled={!authorName} className="btn-primary">
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
        {showAddMatchup && (
          <AddMatchupInline
            onAdd={(name) => { handleAddMatchup(name); setShowAddMatchup(false); }}
            onCancel={() => setShowAddMatchup(false)}
            existingSlugs={deck.matchups.map((matchup) => matchup.slug)}
          />
        )}
      </div>

      <CardPreview
        mainboard={deck.mainboard}
        sideboard={deck.sideboard}
        faceCardId={deck.faceCardId}
        onFaceCardSelect={handleFaceCardSelect}
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
