import type { StoredDeck } from '@/types/deck';
import { sumQuantities } from '@/utils/validation';

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
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={refreshing ? 'animate-spin' : ''}>
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
