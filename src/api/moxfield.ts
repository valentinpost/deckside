import type { MoxfieldDeckResponse } from '@/types/moxfield';
import type { Card } from '@/types/deck';
import { API } from '@/config';

function getImageUrl(card: MoxfieldDeckResponse['mainboard'][string]['card']): string {
  // Double-faced cards have no top-level image_uris
  const uris = card.image_uris ?? card.card_faces?.[0]?.image_uris;
  return uris?.normal ?? uris?.small ?? '';
}

export function transformMoxfieldCards(
  cards: Record<string, MoxfieldDeckResponse['mainboard'][string]>,
): Card[] {
  return Object.values(cards).map((entry) => ({
    name: entry.card.name,
    scryfallId: entry.card.scryfall_id,
    imageUrl: getImageUrl(entry.card),
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
