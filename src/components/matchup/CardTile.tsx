import { useState } from 'react';
import type { Card } from '@/types/deck';
import { EAGER_LOAD_COUNT } from '@/constants';

interface CardTileProps {
  card: Card;
  selectedQty?: number;
  maxQty: number;
  mode?: 'out' | 'in' | 'view';
  index?: number;
  onToggle?: (name: string, qty: number) => void;
}

export function CardTile({ card, selectedQty = 0, maxQty, mode = 'view', index = 0, onToggle }: CardTileProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const isSelected = selectedQty > 0;
  const isInteractive = mode !== 'view' && onToggle;

  function handleClick() {
    if (!isInteractive) return;
    const next = selectedQty >= maxQty ? 0 : selectedQty + 1;
    onToggle(card.name, next);
  }

  const borderColor =
    mode === 'out' && isSelected
      ? 'ring-2 ring-red-500'
      : mode === 'in' && isSelected
        ? 'ring-2 ring-green-500'
        : '';

  const dimClass = isInteractive && !isSelected ? 'opacity-50' : '';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isInteractive}
      className={`card-tile ${borderColor} ${dimClass} ${isInteractive ? 'cursor-pointer active:scale-95' : 'cursor-default'}`}
    >
      {!imgLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-slate-600 border-t-slate-400 rounded-full animate-spin" />
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
        className={`w-full h-full object-cover ${imgLoaded ? '' : 'opacity-0'}`}
      />

      {/* Quantity badge */}
      {card.quantity > 1 && (
        <span className="badge-qty">{card.quantity}x</span>
      )}

      {/* Selection count badge */}
      {isSelected && (
        <span className={`badge-selection ${mode === 'out' ? 'bg-red-600' : 'bg-green-600'}`}>
          {selectedQty}
        </span>
      )}

      {/* Card name */}
      <div className="card-name-overlay">
        <p className="text-white text-[10px] leading-tight truncate font-medium">
          {card.name}
        </p>
      </div>
    </button>
  );
}
