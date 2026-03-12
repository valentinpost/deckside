import { useParams, Link } from 'react-router-dom';
import { useMatchup } from '@/hooks/useMatchup';
import { useResizeAnimation } from '@/hooks/useResizeAnimation';
import { FormatBadge } from '@/components/shared/FormatBadge';
import { CardGrid } from '@/components/matchup/CardGrid';
import { InOutCounter } from '@/components/matchup/InOutCounter';
import { SideboardPlan } from '@/components/matchup/SideboardPlan';
import { StaleCardBanner } from '@/components/matchup/StaleCardBanner';
import { MatchupNotes } from '@/components/matchup/MatchupNotes';
import { MatchResultLogger } from '@/components/matchup/MatchResultLogger';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorBanner } from '@/components/shared/ErrorBanner';

export function MatchupPage() {
  const { deckId, matchupSlug } = useParams<{ deckId: string; matchupSlug: string }>();
  const {
    isLoading, error, deck, matchup,
    outRefs, inRefs, notes, setNotes,
    onDraw, setOnDraw,
    staleCards, handleOutToggle, handleInToggle, handleNotesBlur,
    handleAddResult, handleRemoveResult,
  } = useMatchup(deckId, matchupSlug);

  const hasSwaps = outRefs.length > 0 || inRefs.length > 0;
  const { containerRef, contentRef, isAnimating, handleTransitionEnd } = useResizeAnimation(hasSwaps);

  if (isLoading) return <LoadingSpinner message="Loading deck..." />;
  if (error) return <ErrorBanner message={error.message} />;
  if (!deck) return <ErrorBanner message="Deck not found" />;
  if (!matchup) {
    return (
      <div className="matchup-page-not-found">
        <ErrorBanner message={`Matchup "${matchupSlug}" not found`} />
        <Link to={`/deck/${deckId}`} className="back-link">
          Back to deck
        </Link>
      </div>
    );
  }

  return (
    <div className="matchup-page">
      <div className="page-header">
        <h1 className="title">{matchup.name}</h1>
        <FormatBadge format={deck.format} />
      </div>

      <StaleCardBanner staleCards={staleCards} />

      <div className="play-draw-toggle">
        <button
          className="toggle-btn"
          data-active={!onDraw ? '' : undefined}
          onClick={() => setOnDraw(false)}
        >
          Play
        </button>
        <button
          className="toggle-btn"
          data-active={onDraw ? '' : undefined}
          onClick={() => setOnDraw(true)}
        >
          Draw
        </button>
      </div>

      <div className="section" data-disabled={isAnimating || undefined}>
        <h3 className="out-label">Tap mainboard cards to take OUT</h3>
        <CardGrid cards={deck.mainboard} selectedRefs={outRefs} mode="out" onToggle={handleOutToggle} />
      </div>

      <div className="section" data-disabled={isAnimating || undefined}>
        <h3 className="in-label">Tap sideboard cards to bring IN</h3>
        <CardGrid cards={deck.sideboard} selectedRefs={inRefs} mode="in" onToggle={handleInToggle} />
      </div>

      <MatchupNotes notes={notes} onChange={setNotes} onBlur={handleNotesBlur} />

      <MatchResultLogger
        results={matchup.results ?? []}
        onAdd={handleAddResult}
        onRemove={handleRemoveResult}
      />

      {hasSwaps && (
        <div
          className="sideboard-summary"
          ref={containerRef}
          onTransitionEnd={handleTransitionEnd}
        >
          <div className="summary-inner" ref={contentRef}>
            <InOutCounter out={outRefs} inCards={inRefs} />
            <SideboardPlan out={outRefs} inCards={inRefs} />
          </div>
        </div>
      )}
    </div>
  );
}
