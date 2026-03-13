import { useState, useMemo } from 'react';
import type { Matchup, MatchResult } from '@/types/deck';
import { getSwapSummary } from '@/utils/validation';
import { MatchupListItem } from './MatchupListItem';

interface MatchupListProps {
  deckId: string;
  matchups: Matchup[];
  onAddResult: (matchupId: string, result: Omit<MatchResult, 'id' | 'timestamp'>) => void;
}

export function MatchupList({ deckId, matchups, onAddResult }: MatchupListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
          expanded={expandedId === matchup.id}
          onToggle={() => setExpandedId(expandedId === matchup.id ? null : matchup.id)}
          onAddResult={onAddResult}
        />
      ))}
    </div>
  );
}
