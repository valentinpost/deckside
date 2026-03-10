import { useState } from 'react';
import type { Card } from '@/types/deck';

interface CardTileProps {
  card: Card;
  selectedQty?: number;
  maxQty: number;
  mode?: 'out' | 'in' | 'view';
  onToggle?: (name: string, qty: number) => void;
}

export function CardTile({ card, selectedQty = 0, maxQty, mode = 'view', onToggle }: CardTileProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const isSelected = selectedQty > 0;
  const isInteractive = mode !== 'view' && onToggle;

  function handleClick() {
    if (!isInteractive) return;
    // Cycle: 0 → 1 → 2 → ... → maxQty → 0
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
      className={`relative card-aspect rounded-lg overflow-hidden bg-slate-800 transition-all ${borderColor} ${dimClass} ${isInteractive ? 'cursor-pointer active:scale-95' : 'cursor-default'}`}
    >
      {!imgLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-slate-600 border-t-slate-400 rounded-full animate-spin" />
        </div>
      )}
      <img
        src={card.imageUrl}
        alt={card.name}
        loading="lazy"
        onLoad={() => setImgLoaded(true)}
        className={`w-full h-full object-cover ${imgLoaded ? '' : 'opacity-0'}`}
      />

      {/* Quantity badge */}
      {card.quantity > 1 && (
        <span className="absolute top-1 left-1 bg-black/70 text-white text-xs font-bold px-1.5 py-0.5 rounded">
          {card.quantity}x
        </span>
      )}

      {/* Selection count badge */}
      {isSelected && (
        <span
          className={`absolute top-1 right-1 text-white text-xs font-bold px-1.5 py-0.5 rounded ${
            mode === 'out' ? 'bg-red-600' : 'bg-green-600'
          }`}
        >
          {selectedQty}
        </span>
      )}
    </button>
  );
}
