import type { StoredDeck } from '@/types/deck';

export function exportDeckToJson(deck: StoredDeck): void {
  const blob = new Blob([JSON.stringify(deck, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${deck.deckName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-sideboard.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importDeckFromJson(file: File): Promise<StoredDeck> {
  const text = await file.text();
  const data = JSON.parse(text) as unknown;

  // Basic validation
  if (
    !data ||
    typeof data !== 'object' ||
    !('deckId' in data) ||
    !('deckName' in data) ||
    !('mainboard' in data) ||
    !('matchups' in data)
  ) {
    throw new Error('Invalid sideboard guide file');
  }

  return data as StoredDeck;
}
