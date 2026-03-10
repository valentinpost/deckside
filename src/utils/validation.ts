import type { CardRef, Card } from '@/types/deck';

/** Sum all card quantities in an array of objects with a `quantity` field */
export function sumQuantities(refs: readonly { quantity: number }[]): number {
  return refs.reduce((sum, r) => sum + r.quantity, 0);
}

/** Check if in/out counts balance */
export function isBalanced(out: CardRef[], inCards: CardRef[]): boolean {
  return sumQuantities(out) === sumQuantities(inCards);
}

/** Validate that CardRef quantities don't exceed available deck quantities */
export function validateCardRef(ref: CardRef, available: Card[]): string | null {
  const card = available.find((c) => c.name === ref.name);
  if (!card) return `Card "${ref.name}" not found in deck`;
  if (ref.quantity > card.quantity) {
    return `Cannot swap ${ref.quantity}x ${ref.name} (only ${card.quantity} available)`;
  }
  return null;
}
