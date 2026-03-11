import type { MoxfieldDeckResponse } from '@/types/moxfield';
import type { Card } from '@/types/deck';
import { API } from '@/config';

/**
 * Build a Scryfall image URL from a scryfall_id.
 * Scryfall CDN format: https://cards.scryfall.io/SIZE/front/A/B/SCRYFALL_ID.jpg
 * where A and B are the first two characters of the ID.
 */
export function scryfallImageUrl(scryfallId: string, size: 'small' | 'normal' | 'art_crop' = 'small'): string {
  const firstChar = scryfallId[0];
  const secondChar = scryfallId[1];
  return `https://cards.scryfall.io/${size}/front/${firstChar}/${secondChar}/${scryfallId}.jpg`;
}

function parsePrice(entry: MoxfieldDeckResponse['mainboard'][string]): number | undefined {
  // Moxfield sometimes returns price at entry level, sometimes on card.prices
  if (typeof entry.price === 'number' && entry.price > 0) return entry.price;
  const usd = entry.card.prices?.usd;
  if (usd) {
    const parsed = parseFloat(usd);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  return undefined;
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
    price: parsePrice(entry),
  }));
}

export async function fetchMoxfieldDeck(deckId: string): Promise<MoxfieldDeckResponse> {
  const response = await fetch(API.moxfield(deckId));
  if (!response.ok) {
    throw new Error(`Failed to fetch deck from Moxfield (${response.status})`);
  }
  return response.json() as Promise<MoxfieldDeckResponse>;
}
