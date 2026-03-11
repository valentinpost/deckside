import type { StoredDeck, DeckColor } from '@/types/deck';
import { sumQuantities } from '@/utils/validation';
import { calcDeckWinRate } from '@/utils/winRate';
import { calcDeckPrice, formatPrice } from '@/utils/price';
import { RefreshIcon } from '@/components/icons';
import { FormatBadge } from '@/components/shared/FormatBadge';
import { WinRateBadge } from '@/components/shared/WinRateBadge';
import { DeckOptionsMenu } from './DeckOptionsMenu';

interface DeckHeaderProps {
  deck: StoredDeck;
  onRefreshMoxfield?: () => void;
  refreshing?: boolean;
  onImport: (deck: StoredDeck) => void;
  onColorChange: (color: DeckColor) => void;
}

export function DeckHeader({ deck, onRefreshMoxfield, refreshing, onImport, onColorChange }: DeckHeaderProps) {
  const mainCount = sumQuantities(deck.mainboard);
  const sideCount = sumQuantities(deck.sideboard);
  const deckStats = calcDeckWinRate(deck.matchups);
  const totalPrice = calcDeckPrice([...deck.mainboard, ...deck.sideboard]);
  const priceStr = formatPrice(totalPrice);
  const deckColor = deck.deckColor ?? 'slate';

  return (
    <div className="deck-header" data-color={deckColor}>
      <div className="color-tint" />
      <div className="title-row">
        <h1 className="title">{deck.deckName}</h1>
        <div className="title-actions">
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
          <DeckOptionsMenu deck={deck} onImport={onImport} onColorChange={onColorChange} />
        </div>
      </div>
      <div className="meta">
        <FormatBadge format={deck.format} />
        <WinRateBadge stats={deckStats} className="win-rate-badge" />
        <span className="counts">{mainCount} main / {sideCount} side</span>
        {priceStr && <span className="price">{priceStr}</span>}
        <a href={deck.moxfieldUrl} target="_blank" rel="noopener noreferrer" className="link">
          Moxfield
        </a>
      </div>
    </div>
  );
}
