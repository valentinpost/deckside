import { useParams, Link } from 'react-router-dom';
import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { useMatchup } from '@/hooks/useMatchup';
import { CardGrid } from '@/components/matchup/CardGrid';
import { InOutCounter } from '@/components/matchup/InOutCounter';
import { SideboardPlan } from '@/components/matchup/SideboardPlan';
import { StaleCardBanner } from '@/components/matchup/StaleCardBanner';
import { MatchupNotes } from '@/components/matchup/MatchupNotes';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorBanner } from '@/components/shared/ErrorBanner';

const DESKTOP_MQ = '(min-width: 640px)';

export function MatchupPage() {
  const { deckId, matchupSlug } = useParams<{ deckId: string; matchupSlug: string }>();
  const {
    isLoading, error, deck, matchup,
    outRefs, inRefs, notes, setNotes,
    staleCards, handleOutToggle, handleInToggle, handleNotesBlur,
  } = useMatchup(deckId, matchupSlug);

  const summaryRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prevHeight = useRef(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const hasSwaps = outRefs.length > 0 || inRefs.length > 0;

  // Set initial height synchronously on desktop
  useLayoutEffect(() => {
    const summary = summaryRef.current;
    const content = contentRef.current;
    if (!summary || !content) return;
    if (!window.matchMedia(DESKTOP_MQ).matches) return;
    const h = content.offsetHeight;
    summary.style.height = `${h}px`;
    prevHeight.current = h;
  }, [hasSwaps]);

  // Animate height changes on desktop via ResizeObserver
  useEffect(() => {
    const summary = summaryRef.current;
    const content = contentRef.current;
    if (!summary || !content) return;

    if (!window.matchMedia(DESKTOP_MQ).matches) {
      summary.style.height = '';
      prevHeight.current = 0;
      return;
    }

    const ro = new ResizeObserver(() => {
      const h = content.offsetHeight;
      if (prevHeight.current > 0 && Math.abs(h - prevHeight.current) > 1) {
        setIsAnimating(true);
      }
      summary.style.height = `${h}px`;
      prevHeight.current = h;
    });
    ro.observe(content);
    return () => ro.disconnect();
  }, [hasSwaps]);

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
        {deck.format && <span className="deck-format">{deck.format}</span>}
      </div>

      <StaleCardBanner staleCards={staleCards} />

      <div className="section" data-disabled={isAnimating || undefined}>
        <h3 className="out-label">Tap mainboard cards to take OUT</h3>
        <CardGrid cards={deck.mainboard} selectedRefs={outRefs} mode="out" onToggle={handleOutToggle} />
      </div>

      <div className="section" data-disabled={isAnimating || undefined}>
        <h3 className="in-label">Tap sideboard cards to bring IN</h3>
        <CardGrid cards={deck.sideboard} selectedRefs={inRefs} mode="in" onToggle={handleInToggle} />
      </div>

      <MatchupNotes notes={notes} onChange={setNotes} onBlur={handleNotesBlur} />

      {hasSwaps && (
        <div
          className="sideboard-summary"
          ref={summaryRef}
          onTransitionEnd={(e) => {
            if (e.target === summaryRef.current) setIsAnimating(false);
          }}
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
