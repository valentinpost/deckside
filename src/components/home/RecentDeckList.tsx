import type { RecentDeck } from '@/types/deck';
import { RecentDeckItem } from './RecentDeckItem';

interface RecentDeckListProps {
  recents: RecentDeck[];
  onRemove: (deckId: string) => void;
}

export function RecentDeckList({ recents, onRemove }: RecentDeckListProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-300">Recent Decks</h2>
      {recents.length === 0 ? (
        <p className="text-slate-500 text-sm">
          No recent decks yet. Paste a Moxfield URL above to get started.
        </p>
      ) : (
        <div className="space-y-2">
          {recents.map((deck) => (
            <RecentDeckItem
              key={deck.deckId}
              deck={deck}
              onRemove={() => onRemove(deck.deckId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
