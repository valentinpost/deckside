import { useState } from 'react';
import type { Card } from '@/types/deck';
import { sumQuantities } from '@/utils/validation';
import { CardGrid } from '@/components/matchup/CardGrid';

interface CardPreviewProps {
  mainboard: Card[];
  sideboard: Card[];
}

export function CardPreview({ mainboard, sideboard }: CardPreviewProps) {
  const [showCards, setShowCards] = useState(false);

  return (
    <div className="space-y-3">
      <button
        onClick={() => setShowCards(!showCards)}
        className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
      >
        {showCards ? 'Hide' : 'Show'} deck cards ({sumQuantities(mainboard)} main / {sumQuantities(sideboard)} side)
      </button>
      {showCards && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-2">Mainboard</h3>
            <CardGrid cards={mainboard} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-2">Sideboard</h3>
            <CardGrid cards={sideboard} />
          </div>
        </div>
      )}
    </div>
  );
}
