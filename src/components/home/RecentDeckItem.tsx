import { Link } from 'react-router-dom';
import type { RecentDeck } from '@/types/deck';
import { CloseIcon } from '@/components/icons';
import { FormatBadge } from '@/components/shared/FormatBadge';
import { scryfallImageUrl } from '@/api/moxfield';

interface RecentDeckItemProps {
  deck: RecentDeck;
  onRemove: () => void;
}

export function RecentDeckItem({ deck, onRemove }: RecentDeckItemProps) {
  const deckColor = deck.deckColor ?? 'slate';
  const artUrl = deck.faceCardId ? scryfallImageUrl(deck.faceCardId, 'art_crop') : null;

  return (
    <div className="recent-deck-item" data-color={deckColor} data-has-art={artUrl ? '' : undefined}>
      <div className="color-bg" />
      {artUrl && (
        <div className="art-bg">
          <img src={artUrl} alt="" className="art-img" loading="lazy" />
        </div>
      )}
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
