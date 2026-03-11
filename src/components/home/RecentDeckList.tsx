import type { RecentDeck } from '@/types/deck';
import { RecentDeckItem } from './RecentDeckItem';

interface RecentDeckListProps {
  recents: RecentDeck[];
  onRemove: (deckId: string) => void;
}

export function RecentDeckList({ recents, onRemove }: RecentDeckListProps) {
  return (
    <div className="recent-deck-list">
      <h2 className="title">Recent Decks</h2>
      {recents.length === 0 ? (
        <p className="empty">
          No recent decks yet. Paste a Moxfield URL above to get started.
        </p>
      ) : (
        <div className="list">
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
