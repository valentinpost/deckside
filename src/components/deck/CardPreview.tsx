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
    <div className="card-preview">
      <button
        onClick={() => setShowCards(!showCards)}
        className="toggle-btn"
      >
        {showCards ? 'Hide' : 'Show'} deck cards ({sumQuantities(mainboard)} main / {sumQuantities(sideboard)} side)
      </button>
      {showCards && (
        <div className="cards">
          <div>
            <h3 className="section-label">Mainboard</h3>
            <CardGrid cards={mainboard} />
          </div>
          <div>
            <h3 className="section-label">Sideboard</h3>
            <CardGrid cards={sideboard} />
          </div>
        </div>
      )}
    </div>
  );
}
