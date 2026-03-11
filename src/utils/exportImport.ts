import type { StoredDeck } from '@/types/deck';

export function exportDeckToJson(deck: StoredDeck): void {
  const blob = new Blob([JSON.stringify(deck, null, 2)], { type: 'application/json' });
  const blobUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = blobUrl;
  downloadLink.download = `${deck.deckName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-sideboard.json`;
  downloadLink.click();
  URL.revokeObjectURL(blobUrl);
}

export async function importDeckFromJson(file: File): Promise<StoredDeck> {
  const text = await file.text();
  const parsed = JSON.parse(text) as unknown;

  // Basic validation
  if (
    !parsed ||
    typeof parsed !== 'object' ||
    !('deckId' in parsed) ||
    !('deckName' in parsed) ||
    !('mainboard' in parsed) ||
    !('matchups' in parsed)
  ) {
    throw new Error('Invalid sideboard guide file');
  }

  return parsed as StoredDeck;
}
