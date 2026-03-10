import type { ScryfallCollectionResponse } from '@/types/scryfall';

const SCRYFALL_API = 'https://api.scryfall.com';
const BATCH_SIZE = 75;

/** Fetch cards from Scryfall by their IDs (batches of 75) */
export async function fetchCardsByIds(scryfallIds: string[]): Promise<ScryfallCollectionResponse['data']> {
  const results: ScryfallCollectionResponse['data'] = [];

  for (let i = 0; i < scryfallIds.length; i += BATCH_SIZE) {
    const batch = scryfallIds.slice(i, i + BATCH_SIZE);
    const res = await fetch(`${SCRYFALL_API}/cards/collection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifiers: batch.map((id) => ({ id })),
      }),
    });
    if (!res.ok) throw new Error(`Scryfall API error (${res.status})`);
    const data = (await res.json()) as ScryfallCollectionResponse;
    results.push(...data.data);
  }

  return results;
}
