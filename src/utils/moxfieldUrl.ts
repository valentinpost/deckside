/**
 * Extract the deck ID from a Moxfield URL.
 * Supports formats:
 *   https://www.moxfield.com/decks/AbCdEf123
 *   https://moxfield.com/decks/AbCdEf123
 *   moxfield.com/decks/AbCdEf123
 */
export function parseMoxfieldUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Try URL parsing
  try {
    const url = new URL(
      trimmed.startsWith('http') ? trimmed : `https://${trimmed}`,
    );
    if (!url.hostname.endsWith('moxfield.com')) return null;

    const match = url.pathname.match(/^\/decks\/([A-Za-z0-9_-]+)/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export function buildMoxfieldUrl(deckId: string): string {
  return `https://www.moxfield.com/decks/${deckId}`;
}
