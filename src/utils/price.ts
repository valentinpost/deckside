import type { Card } from '@/types/deck';

export function calcDeckPrice(cards: Card[]): number {
  return cards.reduce((sum, card) => sum + (card.price ?? 0) * card.quantity, 0);
}

export function formatPrice(cents: number): string {
  if (cents <= 0) return '';
  return `$${cents.toFixed(2)}`;
}
