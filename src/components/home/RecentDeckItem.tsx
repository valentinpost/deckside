import { Link } from 'react-router-dom';
import type { RecentDeck } from '@/types/deck';
import { CloseIcon } from '@/components/icons';

interface RecentDeckItemProps {
  deck: RecentDeck;
  onRemove: () => void;
}

export function RecentDeckItem({ deck, onRemove }: RecentDeckItemProps) {
  return (
    <div className="list-item">
      <Link to={`/deck/${deck.deckId}`} className="flex-1 min-w-0">
        <div className="font-medium truncate">
          {deck.deckName}
          {deck.format && (
            <span className="ml-2 text-xs text-slate-400 bg-slate-700 rounded px-1.5 py-0.5 capitalize">
              {deck.format}
            </span>
          )}
        </div>
        <div className="text-xs text-slate-400 mt-0.5">
          Last opened {new Date(deck.lastOpened).toLocaleDateString()}
        </div>
      </Link>
      <button
        onClick={onRemove}
        className="btn-icon-danger"
        aria-label={`Remove ${deck.deckName}`}
      >
        <CloseIcon size={16} />
      </button>
    </div>
  );
}
