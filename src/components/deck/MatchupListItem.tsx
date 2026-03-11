import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Matchup } from '@/types/deck';
import { getSwapSummary, formatSwapCounts } from '@/utils/validation';
import { calcWinRate } from '@/utils/winRate';
import { EditIcon, TrashIcon } from '@/components/icons';
import { WinRateBadge } from '@/components/shared/WinRateBadge';
import { InlineRenameInput } from './InlineRenameInput';

interface MatchupListItemProps {
  deckId: string;
  matchup: Matchup;
  onDelete: () => void;
  onRename: (name: string) => void;
}

export function MatchupListItem({ deckId, matchup, onDelete, onRename }: MatchupListItemProps) {
  const [editing, setEditing] = useState(false);
  const { outCount, inCount } = getSwapSummary(matchup);
  const winRateStats = calcWinRate(matchup.results ?? []);

  return (
    <div className="matchup-list-item">
      <Link to={`/deck/${deckId}/${matchup.slug}`} className="link">
        {editing ? (
          <InlineRenameInput
            initialName={matchup.name}
            onSubmit={onRename}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <>
            <div className="name">{matchup.name}</div>
            <div className="subtitle">
              {formatSwapCounts(outCount, inCount)}
              <WinRateBadge stats={winRateStats} />
            </div>
          </>
        )}
      </Link>
      <button
        onClick={(e) => { e.preventDefault(); setEditing(true); }}
        className="btn-icon-neutral"
        aria-label={`Rename ${matchup.name}`}
      >
        <EditIcon />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); onDelete(); }}
        className="btn-icon-danger"
        aria-label={`Delete ${matchup.name}`}
      >
        <TrashIcon />
      </button>
    </div>
  );
}
