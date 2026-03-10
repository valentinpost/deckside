import { Link } from 'react-router-dom';
import type { Matchup } from '@/types/deck';
import { sumQuantities } from '@/utils/validation';

interface MatchupListItemProps {
  deckId: string;
  matchup: Matchup;
  onDelete: () => void;
}

export function MatchupListItem({ deckId, matchup, onDelete }: MatchupListItemProps) {
  const outCount = sumQuantities(matchup.out);
  const inCount = sumQuantities(matchup.in);
  const balanced = outCount === inCount;

  return (
    <div className="flex items-center gap-3 rounded-lg bg-slate-800/50 border border-slate-700/50 p-3 hover:bg-slate-800 transition-colors">
      <Link
        to={`/deck/${deckId}/${matchup.slug}`}
        className="flex-1 min-w-0"
      >
        <div className="font-medium truncate">{matchup.name}</div>
        <div className="text-xs text-slate-400 mt-0.5">
          {outCount > 0 || inCount > 0 ? (
            <span className={balanced ? 'text-green-400' : 'text-yellow-400'}>
              -{outCount} / +{inCount}
            </span>
          ) : (
            <span>No swaps configured</span>
          )}
        </div>
      </Link>
      <button
        onClick={(e) => { e.preventDefault(); onDelete(); }}
        className="p-2 text-slate-500 hover:text-red-400 transition-colors shrink-0"
        aria-label={`Delete ${matchup.name}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      </button>
    </div>
  );
}
