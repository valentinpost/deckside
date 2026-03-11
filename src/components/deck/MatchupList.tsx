import { useMemo } from 'react';
import type { Matchup } from '@/types/deck';
import { getSwapSummary } from '@/utils/validation';
import { MatchupListItem } from './MatchupListItem';

interface MatchupListProps {
  deckId: string;
  matchups: Matchup[];
  onDelete: (matchupId: string) => void;
  onRename: (matchupId: string, name: string) => void;
}

export function MatchupList({ deckId, matchups, onDelete, onRename }: MatchupListProps) {
  const sorted = useMemo(
    () => [...matchups].sort((a, b) => {
      const aComplete = getSwapSummary(a).isComplete;
      const bComplete = getSwapSummary(b).isComplete;
      if (aComplete !== bComplete) return aComplete ? -1 : 1;
      return 0;
    }),
    [matchups],
  );

  if (matchups.length === 0) {
    return (
      <p className="matchup-list-empty">
        No matchups yet. Add one to start building your sideboard plan.
      </p>
    );
  }

  return (
    <div className="matchup-list">
      {sorted.map((matchup) => (
        <MatchupListItem
          key={matchup.id}
          deckId={deckId}
          matchup={matchup}
          onDelete={() => onDelete(matchup.id)}
          onRename={(name) => onRename(matchup.id, name)}
        />
      ))}
    </div>
  );
}
