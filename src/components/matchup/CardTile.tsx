import { useState } from 'react';
import type { Card } from '@/types/deck';
import { EAGER_LOAD_COUNT } from '@/constants';

interface CardTileProps {
  card: Card;
  selectedQty?: number;
  maxQty: number;
  mode?: 'out' | 'in' | 'view' | 'face';
  index?: number;
  onToggle?: (name: string, qty: number) => void;
  isFaceCard?: boolean;
  onFaceCardSelect?: (scryfallId: string | undefined) => void;
}

export function CardTile({ card, selectedQty = 0, maxQty, mode = 'view', index = 0, onToggle, isFaceCard, onFaceCardSelect }: CardTileProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const isSelected = selectedQty > 0;
  const isSwapMode = (mode === 'out' || mode === 'in') && onToggle;
  const isFaceMode = mode === 'face' && onFaceCardSelect;
  const isInteractive = isSwapMode || isFaceMode;

  function handleClick() {
    if (isSwapMode) {
      const next = selectedQty >= maxQty ? 0 : selectedQty + 1;
      onToggle!(card.name, next);
    } else if (isFaceMode) {
      // Single click to set, single click to clear
      onFaceCardSelect!(isFaceCard ? undefined : card.scryfallId);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isInteractive}
      className="card-tile"
      data-mode={mode}
      data-interactive={isInteractive ? 'true' : undefined}
      data-dim={isSwapMode && !isSelected ? 'true' : undefined}
      data-selected={isSelected ? '' : undefined}
      data-face-card={isFaceCard ? '' : undefined}
    >
      {!imgLoaded && (
        <div className="loading-overlay">
          <div className="spinner" />
        </div>
      )}
      <img
        src={card.imageUrl}
        alt={card.name}
        width={146}
        height={204}
        loading={index < EAGER_LOAD_COUNT ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setImgLoaded(true)}
        className="image"
        data-loaded={imgLoaded ? 'true' : 'false'}
      />

      {/* Quantity badge */}
      {card.quantity > 1 && (
        <span className="badge-qty">{card.quantity}x</span>
      )}

      {/* Selection count badge */}
      {isSelected && (
        <span className="badge-selection" data-mode={mode}>
          {selectedQty}
        </span>
      )}

      {/* Card name */}
      <div className="name-overlay">
        <p className="card-name">
          {card.name}
        </p>
      </div>
    </button>
  );
}
