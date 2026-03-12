import type { StoredDeck, CardRef } from '@/types/deck';

function formatRefs(refs: CardRef[], prefix: string): string {
  if (refs.length === 0) return 'None';
  return refs.map((ref) => `${prefix}${ref.quantity} ${ref.name}`).join(', ');
}

function refsEqual(a: CardRef[], b: CardRef[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((ref, i) => {
    const other = b[i];
    return other !== undefined && ref.name === other.name && ref.quantity === other.quantity;
  });
}

export function generateSideboardGuide(deck: StoredDeck): string {
  const lines: string[] = [];
  const divider = '='.repeat(40);

  lines.push(divider);
  lines.push(deck.deckName);
  if (deck.format) lines.push(`Format: ${deck.format}`);
  lines.push(divider);

  if (deck.matchups.length === 0) {
    lines.push('');
    lines.push('No matchups configured.');
    return lines.join('\n');
  }

  for (const matchup of deck.matchups) {
    lines.push('');
    lines.push(`--- vs. ${matchup.name} ---`);
    lines.push(`OUT: ${formatRefs(matchup.out, '-')}`);
    lines.push(`IN:  ${formatRefs(matchup.in, '+')}`);

    const hasDrawPlan = matchup.outOnDraw || matchup.inOnDraw;
    if (hasDrawPlan) {
      const drawOut = matchup.outOnDraw ?? matchup.out;
      const drawIn = matchup.inOnDraw ?? matchup.in;
      const differs = !refsEqual(drawOut, matchup.out) || !refsEqual(drawIn, matchup.in);
      if (differs) {
        lines.push(`On the Draw:`);
        lines.push(`OUT: ${formatRefs(drawOut, '-')}`);
        lines.push(`IN:  ${formatRefs(drawIn, '+')}`);
      }
    }

    if (matchup.notes.trim()) {
      lines.push('');
      lines.push(`Notes: ${matchup.notes.trim()}`);
    }
  }

  lines.push('');
  return lines.join('\n');
}

export function exportSideboardGuide(deck: StoredDeck): void {
  const text = generateSideboardGuide(deck);
  const blob = new Blob([text], { type: 'text/plain' });
  const blobUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = blobUrl;
  downloadLink.download = `${deck.deckName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-guide.txt`;
  downloadLink.click();
  URL.revokeObjectURL(blobUrl);
}
