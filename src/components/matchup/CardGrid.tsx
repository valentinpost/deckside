import { useMemo } from 'react';
import type { Card, CardRef } from '@/types/deck';
import { CardTile } from './CardTile';
import { sortCards } from '@/utils/cardSort';

interface CardGridProps {
  cards: Card[];
  selectedRefs?: CardRef[];
  mode?: 'out' | 'in' | 'view';
  onToggle?: (name: string, qty: number) => void;
}

export function CardGrid({ cards, selectedRefs = [], mode = 'view', onToggle }: CardGridProps) {
  const refMap = new Map(selectedRefs.map((r) => [r.name, r.quantity]));
  const sorted = useMemo(() => sortCards(cards), [cards]);

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
      {sorted.map((card, index) => (
        <CardTile
          key={card.name}
          card={card}
          index={index}
          selectedQty={refMap.get(card.name) ?? 0}
          maxQty={card.quantity}
          mode={mode}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
