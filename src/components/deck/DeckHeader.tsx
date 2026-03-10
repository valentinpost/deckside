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
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">{deck.deckName}</h1>
      <div className="flex items-center gap-3 text-sm text-slate-400">
        {deck.format && (
          <>
            <span className="capitalize">{deck.format}</span>
            <span className="text-slate-600">|</span>
          </>
        )}
        <span>{sumQuantities(deck.mainboard)} mainboard</span>
        <span className="text-slate-600">|</span>
        <span>{sumQuantities(deck.sideboard)} sideboard</span>
        <span className="text-slate-600">|</span>
        <a href={deck.moxfieldUrl} target="_blank" rel="noopener noreferrer" className="link">
          Moxfield
        </a>
        {onRefreshMoxfield && (
          <button
            onClick={onRefreshMoxfield}
            disabled={refreshing}
            className="text-slate-400 hover:text-slate-200 disabled:opacity-50 transition-colors"
            title="Refresh from Moxfield"
          >
            <RefreshIcon className={refreshing ? 'animate-spin' : ''} />
          </button>
        )}
      </div>
    </div>
  );
}
