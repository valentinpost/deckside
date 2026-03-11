import { useMemo } from 'react';
import type { Matchup } from '@/types/deck';
import { sumQuantities } from '@/utils/validation';
import { MatchupListItem } from './MatchupListItem';

interface MatchupListProps {
  deckId: string;
  matchups: Matchup[];
  onDelete: (matchupId: string) => void;
  onRename: (matchupId: string, name: string) => void;
}

function isComplete(m: Matchup): boolean {
  const outCount = sumQuantities(m.out);
  const inCount = sumQuantities(m.in);
  return outCount > 0 && outCount === inCount;
}

export function MatchupList({ deckId, matchups, onDelete, onRename }: MatchupListProps) {
  const sorted = useMemo(
    () => [...matchups].sort((a, b) => {
      const aComplete = isComplete(a);
      const bComplete = isComplete(b);
      if (aComplete !== bComplete) return aComplete ? -1 : 1;
      return 0;
    }),
    [matchups],
  );

  if (matchups.length === 0) {
    return (
      <p className="matchup-list-empty">
        No matchups yet. Add one to start building your sideboard guide.
      </p>
    );
  }

  return (
    <div className="matchup-list">
      {sorted.map((m) => (
        <MatchupListItem
          key={m.id}
          deckId={deckId}
          matchup={m}
          onDelete={() => onDelete(m.id)}
          onRename={(name) => onRename(m.id, name)}
        />
      ))}
    </div>
  );
}
