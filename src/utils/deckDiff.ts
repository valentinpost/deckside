import type { Card, Matchup } from '@/types/deck';

export interface DeckDiffResult {
  addedCards: string[];
  removedCards: string[];
  changedQuantities: Array<{ name: string; oldQty: number; newQty: number }>;
}

export function diffCardLists(oldCards: Card[], newCards: Card[]): DeckDiffResult {
  const oldMap = new Map(oldCards.map((c) => [c.name, c]));
  const newMap = new Map(newCards.map((c) => [c.name, c]));

  const addedCards: string[] = [];
  const removedCards: string[] = [];
  const changedQuantities: DeckDiffResult['changedQuantities'] = [];

  for (const [name, card] of newMap) {
    const old = oldMap.get(name);
    if (!old) {
      addedCards.push(name);
    } else if (old.quantity !== card.quantity) {
      changedQuantities.push({ name, oldQty: old.quantity, newQty: card.quantity });
    }
  }

  for (const [name] of oldMap) {
    if (!newMap.has(name)) {
      removedCards.push(name);
    }
  }

  return { addedCards, removedCards, changedQuantities };
}

/** Find matchup CardRefs that reference cards no longer in the deck */
export function findStaleRefs(matchups: Matchup[], mainboard: Card[], sideboard: Card[]): Map<string, string[]> {
  const mainNames = new Set(mainboard.map((c) => c.name));
  const sideNames = new Set(sideboard.map((c) => c.name));
  const stale = new Map<string, string[]>();

  for (const matchup of matchups) {
    const staleCards: string[] = [];
    for (const ref of matchup.out) {
      if (!mainNames.has(ref.name)) staleCards.push(ref.name);
    }
    for (const ref of matchup.in) {
      if (!sideNames.has(ref.name)) staleCards.push(ref.name);
    }
    if (staleCards.length > 0) {
      stale.set(matchup.id, staleCards);
    }
  }

  return stale;
}
