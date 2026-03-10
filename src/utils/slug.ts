/**
 * Create a URL-safe slug from a matchup name.
 * "vs Burn" → "vs-burn"
 * "4C Omnath (Yorion)" → "4c-omnath-yorion"
 */
export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
