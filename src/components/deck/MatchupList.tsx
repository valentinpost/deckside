import type { Matchup } from '@/types/deck';
import { MatchupListItem } from './MatchupListItem';

interface MatchupListProps {
  deckId: string;
  matchups: Matchup[];
  onDelete: (matchupId: string) => void;
  onRename: (matchupId: string, name: string) => void;
}

export function MatchupList({ deckId, matchups, onDelete, onRename }: MatchupListProps) {
  if (matchups.length === 0) {
    return (
      <p className="matchup-list-empty">
        No matchups yet. Add one to start building your sideboard guide.
      </p>
    );
  }

  return (
    <div className="matchup-list">
      {matchups.map((m) => (
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
