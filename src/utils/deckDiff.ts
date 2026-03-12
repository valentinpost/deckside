import type { Card, Matchup } from '@/types/deck';

export interface DeckDiffResult {
  addedCards: string[];
  removedCards: string[];
  changedQuantities: Array<{ name: string; oldQty: number; newQty: number }>;
}

export function isDiffEmpty(diff: DeckDiffResult): boolean {
  return diff.addedCards.length === 0 && diff.removedCards.length === 0 && diff.changedQuantities.length === 0;
}

export function diffCardLists(oldCards: Card[], newCards: Card[]): DeckDiffResult {
  const oldCardsByName = new Map(oldCards.map((card) => [card.name, card]));
  const newCardsByName = new Map(newCards.map((card) => [card.name, card]));

  const addedCards: string[] = [];
  const removedCards: string[] = [];
  const changedQuantities: DeckDiffResult['changedQuantities'] = [];

  for (const [name, card] of newCardsByName) {
    const previousCard = oldCardsByName.get(name);
    if (!previousCard) {
      addedCards.push(name);
    } else if (previousCard.quantity !== card.quantity) {
      changedQuantities.push({ name, oldQty: previousCard.quantity, newQty: card.quantity });
    }
  }

  for (const [name] of oldCardsByName) {
    if (!newCardsByName.has(name)) {
      removedCards.push(name);
    }
  }

  return { addedCards, removedCards, changedQuantities };
}

/** Find matchup CardRefs that reference cards no longer in the deck */
export function findStaleRefs(matchups: Matchup[], mainboard: Card[], sideboard: Card[]): Map<string, string[]> {
  const mainboardNames = new Set(mainboard.map((card) => card.name));
  const sideboardNames = new Set(sideboard.map((card) => card.name));
  const staleByMatchup = new Map<string, string[]>();

  for (const matchup of matchups) {
    const staleSet = new Set<string>();
    for (const ref of matchup.out) {
      if (!mainboardNames.has(ref.name)) staleSet.add(ref.name);
    }
    for (const ref of matchup.in) {
      if (!sideboardNames.has(ref.name)) staleSet.add(ref.name);
    }
    for (const ref of matchup.outOnDraw ?? []) {
      if (!mainboardNames.has(ref.name)) staleSet.add(ref.name);
    }
    for (const ref of matchup.inOnDraw ?? []) {
      if (!sideboardNames.has(ref.name)) staleSet.add(ref.name);
    }
    if (staleSet.size > 0) {
      staleByMatchup.set(matchup.id, [...staleSet]);
    }
  }

  return staleByMatchup;
}
