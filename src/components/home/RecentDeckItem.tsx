import { Link } from 'react-router-dom';
import type { RecentDeck } from '@/types/deck';
import { CloseIcon } from '@/components/icons';
import { FormatBadge } from '@/components/shared/FormatBadge';

interface RecentDeckItemProps {
  deck: RecentDeck;
  onRemove: () => void;
}

export function RecentDeckItem({ deck, onRemove }: RecentDeckItemProps) {
  return (
    <div className="recent-deck-item">
      <Link to={`/deck/${deck.deckId}`} className="link">
        <div className="name">
          <span className="name-text">{deck.deckName}</span>
          <FormatBadge format={deck.format} />
        </div>
        <div className="meta">
          Last opened {new Date(deck.lastOpened).toLocaleDateString()}
        </div>
      </Link>
      <button
        onClick={onRemove}
        className="remove-btn"
        aria-label={`Remove ${deck.deckName}`}
      >
        <CloseIcon size={16} />
      </button>
    </div>
  );
}
