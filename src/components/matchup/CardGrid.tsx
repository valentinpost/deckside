import { useMemo } from 'react';
import type { Card, CardRef } from '@/types/deck';
import { CardTile } from './CardTile';
import { sortCards } from '@/utils/cardSort';

interface CardGridProps {
  cards: Card[];
  selectedRefs?: CardRef[];
  mode?: 'out' | 'in' | 'view' | 'face';
  onToggle?: (name: string, qty: number) => void;
  faceCardId?: string;
  onFaceCardSelect?: (scryfallId: string | undefined) => void;
}

export function CardGrid({ cards, selectedRefs = [], mode = 'view', onToggle, faceCardId, onFaceCardSelect }: CardGridProps) {
  const selectedQuantityByName = new Map(selectedRefs.map((ref) => [ref.name, ref.quantity]));
  const sorted = useMemo(() => sortCards(cards), [cards]);

  return (
    <div className="card-grid">
      {sorted.map((card, index) => (
        <CardTile
          key={card.name}
          card={card}
          index={index}
          selectedQty={selectedQuantityByName.get(card.name) ?? 0}
          maxQty={card.quantity}
          mode={mode}
          onToggle={onToggle}
          isFaceCard={faceCardId === card.scryfallId}
          onFaceCardSelect={onFaceCardSelect}
        />
      ))}
    </div>
  );
}
