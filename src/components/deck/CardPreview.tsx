import { useState } from 'react';
import type { Card } from '@/types/deck';
import { sumQuantities } from '@/utils/validation';
import { CardGrid } from '@/components/matchup/CardGrid';

interface CardPreviewProps {
  mainboard: Card[];
  sideboard: Card[];
  faceCardId?: string;
  onFaceCardSelect?: (scryfallId: string | undefined) => void;
}

export function CardPreview({ mainboard, sideboard, faceCardId, onFaceCardSelect }: CardPreviewProps) {
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
          {onFaceCardSelect && (
            <p className="face-card-hint">Click a card to set it as your deck's face card</p>
          )}
          <div>
            <h3 className="section-label">Mainboard</h3>
            <CardGrid
              cards={mainboard}
              mode={onFaceCardSelect ? 'face' : 'view'}
              faceCardId={faceCardId}
              onFaceCardSelect={onFaceCardSelect}
            />
          </div>
          <div>
            <h3 className="section-label">Sideboard</h3>
            <CardGrid
              cards={sideboard}
              mode={onFaceCardSelect ? 'face' : 'view'}
              faceCardId={faceCardId}
              onFaceCardSelect={onFaceCardSelect}
            />
          </div>
        </div>
      )}
    </div>
  );
}
