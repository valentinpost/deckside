import type { StoredDeck } from '@/types/deck';
import { sumQuantities } from '@/utils/validation';
import { RefreshIcon } from '@/components/icons';

interface DeckHeaderProps {
  deck: StoredDeck;
  onRefreshMoxfield?: () => void;
  refreshing?: boolean;
}

export function DeckHeader({ deck, onRefreshMoxfield, refreshing }: DeckHeaderProps) {
  return (
    <div className="deck-header">
      <h1 className="title">{deck.deckName}</h1>
      <div className="meta">
        {deck.format && (
          <>
            <span className="capitalize">{deck.format}</span>
            <span className="separator">|</span>
          </>
        )}
        <span>{sumQuantities(deck.mainboard)} mainboard</span>
        <span className="separator">|</span>
        <span>{sumQuantities(deck.sideboard)} sideboard</span>
        <span className="separator">|</span>
        <a href={deck.moxfieldUrl} target="_blank" rel="noopener noreferrer" className="link">
          Moxfield
        </a>
        {onRefreshMoxfield && (
          <button
            onClick={onRefreshMoxfield}
            disabled={refreshing}
            className="refresh-btn"
            title="Refresh from Moxfield"
          >
            <RefreshIcon className={refreshing ? 'spinning' : undefined} />
          </button>
        )}
      </div>
    </div>
  );
}
