import type { Card } from '@/types/deck';

/** Count total mana pips from a mana cost string like "{2}{W}{U}" */
export function parseManaValue(manaCost?: string): number {
  if (!manaCost) return 0;
  let total = 0;
  const pips = manaCost.match(/\{[^}]+\}/g);
  if (!pips) return 0;
  for (const pip of pips) {
    const inner = pip.slice(1, -1);
    const numeric = Number(inner);
    if (!isNaN(numeric)) {
      total += numeric;
    } else {
      // Colored pip ({W}, {U}, {B}, {R}, {G}) or special ({X}, {C}, etc.)
      total += inner === 'X' ? 0 : 1;
    }
  }
  return total;
}

export function isLand(typeLine?: string): boolean {
  return !!typeLine && typeLine.includes('Land');
}

/** Sort cards: non-lands by mana value ascending, then lands at the end */
export function sortCards(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => {
    const aLand = isLand(a.typeLine);
    const bLand = isLand(b.typeLine);
    if (aLand !== bLand) return aLand ? 1 : -1;
    return parseManaValue(a.manaCost) - parseManaValue(b.manaCost);
  });
}
