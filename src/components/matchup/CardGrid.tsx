import type { Card, CardRef } from '@/types/deck';
import { CardTile } from './CardTile';

interface CardGridProps {
  cards: Card[];
  selectedRefs?: CardRef[];
  mode?: 'out' | 'in' | 'view';
  onToggle?: (name: string, qty: number) => void;
}

export function CardGrid({ cards, selectedRefs = [], mode = 'view', onToggle }: CardGridProps) {
  const refMap = new Map(selectedRefs.map((r) => [r.name, r.quantity]));

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
      {cards.map((card) => (
        <CardTile
          key={card.name}
          card={card}
          selectedQty={refMap.get(card.name) ?? 0}
          maxQty={card.quantity}
          mode={mode}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
