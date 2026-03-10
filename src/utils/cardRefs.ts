import type { CardRef } from '@/types/deck';

/**
 * Toggle a card's quantity in a CardRef array.
 * If qty is 0, removes the card. If the card exists, updates its quantity.
 * Otherwise, adds a new entry.
 */
export function toggleCardRef(refs: CardRef[], name: string, qty: number): CardRef[] {
  if (qty === 0) {
    return refs.filter((r) => r.name !== name);
  }
  if (refs.some((r) => r.name === name)) {
    return refs.map((r) => (r.name === name ? { ...r, quantity: qty } : r));
  }
  return [...refs, { name, quantity: qty }];
}
