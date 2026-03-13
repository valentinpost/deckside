import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Matchup, MatchResult } from '@/types/deck';
import { getSwapSummary } from '@/utils/validation';
import { calcWinRate } from '@/utils/winRate';
import { WinRateBadge } from '@/components/shared/WinRateBadge';
import { InOutCounter } from '@/components/matchup/InOutCounter';
import { SideboardPlan } from '@/components/matchup/SideboardPlan';
import { ScoreControls } from '@/components/matchup/ScoreControls';
import { PlayDrawToggle } from '@/components/shared/PlayDrawToggle';
import { EditIcon } from '@/components/icons';

interface MatchupListItemProps {
  deckId: string;
  matchup: Matchup;
  expanded: boolean;
  onToggle: () => void;
  onAddResult: (matchupId: string, result: Omit<MatchResult, 'id' | 'timestamp'>) => void;
}

export function MatchupListItem({ deckId, matchup, expanded, onToggle, onAddResult }: MatchupListItemProps) {
  const [onDraw, setOnDraw] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [onPlay, setOnPlay] = useState<boolean | undefined>(undefined);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!expanded) setShowScore(false);
    if (expanded && itemRef.current) {
      itemRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [expanded]);
  const winRateStats = calcWinRate(matchup.results ?? []);
  const hasDrawPlan = matchup.outOnDraw !== undefined || matchup.inOnDraw !== undefined;
  const { outCount, inCount, isComplete } = getSwapSummary(matchup);
  const hasSwaps = outCount > 0 || inCount > 0;

  const previewOut = onDraw ? (matchup.outOnDraw ?? matchup.out) : matchup.out;
  const previewIn = onDraw ? (matchup.inOnDraw ?? matchup.in) : matchup.in;

  function handleScore(gamesWon: number, gamesLost: number) {
    onAddResult(matchup.id, { won: gamesWon === 2, gamesWon, gamesLost, onPlay });
    setOnPlay(undefined);
    setShowScore(false);
  }

  return (
    <div ref={itemRef} className="matchup-list-item" data-expanded={expanded || undefined} data-incomplete={!isComplete ? '' : undefined}>
      <div className="row">
        <button className="row-toggle" onClick={onToggle}>
          <div className="info">
            <div className="name">{matchup.name}</div>
            {winRateStats.totalMatches > 0 && (
              <div className="subtitle">
                <WinRateBadge stats={winRateStats} />
              </div>
            )}
          </div>
        </button>
        <Link
          to={`/deck/${deckId}/${matchup.slug}`}
          className="edit-link"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Edit ${matchup.name}`}
        >
          <EditIcon size={14} />
        </Link>
        <button className="chevron-btn" onClick={onToggle} aria-label="Toggle preview">
          <span className="chevron" />
        </button>
      </div>

      {expanded && (
        <div className="preview">
          {hasDrawPlan && <PlayDrawToggle onDraw={onDraw} onChange={setOnDraw} />}
          {hasSwaps ? (
            <>
              <InOutCounter out={previewOut} inCards={previewIn} />
              <SideboardPlan out={previewOut} inCards={previewIn} />
            </>
          ) : (
            <p className="empty">No swaps configured yet.</p>
          )}

          {showScore ? (
            <div className="preview-results">
              <ScoreControls onPlay={onPlay} onPlayChange={setOnPlay} onScore={handleScore} />
            </div>
          ) : (
            <button className="log-result-btn" onClick={() => setShowScore(true)}>
              Log Result
            </button>
          )}
        </div>
      )}
    </div>
  );
}
