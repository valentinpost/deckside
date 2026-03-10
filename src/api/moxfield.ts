import type { MoxfieldDeckResponse } from '@/types/moxfield';
import type { Card } from '@/types/deck';
import { API } from '@/config';

/**
 * Build a Scryfall image URL from a scryfall_id.
 * Scryfall CDN format: https://cards.scryfall.io/SIZE/front/A/B/SCRYFALL_ID.jpg
 * where A and B are the first two characters of the ID.
 */
export function scryfallImageUrl(scryfallId: string, size: 'small' | 'normal' = 'small'): string {
  const a = scryfallId[0];
  const b = scryfallId[1];
  return `https://cards.scryfall.io/${size}/front/${a}/${b}/${scryfallId}.jpg`;
}

export function transformMoxfieldCards(
  cards: Record<string, MoxfieldDeckResponse['mainboard'][string]>,
): Card[] {
  return Object.values(cards).map((entry) => ({
    name: entry.card.name,
    scryfallId: entry.card.scryfall_id,
    imageUrl: scryfallImageUrl(entry.card.scryfall_id),
    quantity: entry.quantity,
    manaCost: entry.card.mana_cost,
    typeLine: entry.card.type_line,
  }));
}

export async function fetchMoxfieldDeck(deckId: string): Promise<MoxfieldDeckResponse> {
  const res = await fetch(API.moxfield(deckId));
  if (!res.ok) {
    throw new Error(`Failed to fetch deck from Moxfield (${res.status})`);
  }
  return res.json() as Promise<MoxfieldDeckResponse>;
}
