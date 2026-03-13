import type { CardRef, Card, Matchup } from '@/types/deck';

/** Sum all card quantities in an array of objects with a `quantity` field */
export function sumQuantities(refs: readonly { quantity: number }[]): number {
  return refs.reduce((sum, item) => sum + item.quantity, 0);
}

/** Check if in/out counts balance */
export function isBalanced(out: CardRef[], inCards: CardRef[]): boolean {
  return sumQuantities(out) === sumQuantities(inCards);
}

/** Get the swap counts and completeness status for a matchup */
export function getSwapSummary(matchup: Matchup): { outCount: number; inCount: number; isComplete: boolean } {
  const outCount = sumQuantities(matchup.out);
  const inCount = sumQuantities(matchup.in);
  return { outCount, inCount, isComplete: outCount > 0 && outCount === inCount };
}

/** Format swap counts as a concise display string */
export function formatSwapCounts(outCount: number, inCount: number): string {
  if (outCount === 0 && inCount === 0) return 'No swaps configured';
  if (outCount === inCount) return `${outCount} swaps`;
  return `${outCount} out / ${inCount} in`;
}

/** Validate that CardRef quantities don't exceed available deck quantities */
export function validateCardRef(ref: CardRef, available: Card[]): string | null {
  const card = available.find((candidate) => candidate.name === ref.name);
  if (!card) return `Card "${ref.name}" not found in deck`;
  if (ref.quantity > card.quantity) {
    return `Cannot swap ${ref.quantity}x ${ref.name} (only ${card.quantity} available)`;
  }
  return null;
}
