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
      <p className="text-slate-500 text-sm py-4">
        No matchups yet. Add one to start building your sideboard guide.
      </p>
    );
  }

  return (
    <div className="space-y-2">
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
