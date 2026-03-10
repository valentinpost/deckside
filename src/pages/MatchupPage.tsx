import { useParams, Link } from 'react-router-dom';
import { useMatchup } from '@/hooks/useMatchup';
import { CardGrid } from '@/components/matchup/CardGrid';
import { InOutCounter } from '@/components/matchup/InOutCounter';
import { SideboardPlan } from '@/components/matchup/SideboardPlan';
import { StaleCardBanner } from '@/components/matchup/StaleCardBanner';
import { MatchupNotes } from '@/components/matchup/MatchupNotes';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorBanner } from '@/components/shared/ErrorBanner';

export function MatchupPage() {
  const { deckId, matchupSlug } = useParams<{ deckId: string; matchupSlug: string }>();
  const {
    isLoading, error, deck, matchup,
    outRefs, inRefs, notes, setNotes,
    staleCards, handleOutToggle, handleInToggle, handleNotesBlur,
  } = useMatchup(deckId, matchupSlug);

  if (isLoading) return <LoadingSpinner message="Loading deck..." />;
  if (error) return <ErrorBanner message={error.message} />;
  if (!deck) return <ErrorBanner message="Deck not found" />;
  if (!matchup) {
    return (
      <div className="space-y-4">
        <ErrorBanner message={`Matchup "${matchupSlug}" not found`} />
        <Link to={`/deck/${deckId}`} className="text-blue-400 hover:text-blue-300 text-sm">
          Back to deck
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold">{matchup.name}</h1>

      <StaleCardBanner staleCards={staleCards} />

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-red-400">Tap mainboard cards to take OUT</h3>
        <CardGrid cards={deck.mainboard} selectedRefs={outRefs} mode="out" onToggle={handleOutToggle} />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-green-400">Tap sideboard cards to bring IN</h3>
        <CardGrid cards={deck.sideboard} selectedRefs={inRefs} mode="in" onToggle={handleInToggle} />
      </div>

      <SideboardPlan out={outRefs} inCards={inRefs} />
      <MatchupNotes notes={notes} onChange={setNotes} onBlur={handleNotesBlur} />
      <InOutCounter out={outRefs} inCards={inRefs} />
    </div>
  );
}
