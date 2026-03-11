import type { StoredDeck } from '@/types/deck';
import { sumQuantities } from '@/utils/validation';
import { RefreshIcon } from '@/components/icons';

interface DeckHeaderProps {
  deck: StoredDeck;
  onRefreshMoxfield?: () => void;
  refreshing?: boolean;
}

export function DeckHeader({ deck, onRefreshMoxfield, refreshing }: DeckHeaderProps) {
  const mainCount = sumQuantities(deck.mainboard);
  const sideCount = sumQuantities(deck.sideboard);

  return (
    <div className="deck-header">
      <div className="title-row">
        <h1 className="title">{deck.deckName}</h1>
        {onRefreshMoxfield && (
          <button
            onClick={onRefreshMoxfield}
            disabled={refreshing}
            className="refresh-btn"
            title="Refresh from Moxfield"
          >
            <RefreshIcon size={18} className={refreshing ? 'spinning' : undefined} />
          </button>
        )}
      </div>
      <div className="meta">
        {deck.format && <span className="format-badge">{deck.format}</span>}
        <span className="counts">{mainCount} main / {sideCount} side</span>
        <a href={deck.moxfieldUrl} target="_blank" rel="noopener noreferrer" className="link">
          Moxfield
        </a>
      </div>
    </div>
  );
}
