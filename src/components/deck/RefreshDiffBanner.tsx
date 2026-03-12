import type { RefreshDiff } from '@/hooks/useRefreshMoxfield';
import type { DeckDiffResult } from '@/utils/deckDiff';

interface DiffSectionProps {
  label: string;
  diff: DeckDiffResult;
}

function DiffSection({ label, diff }: DiffSectionProps) {
  const hasChanges = diff.addedCards.length > 0 || diff.removedCards.length > 0 || diff.changedQuantities.length > 0;
  if (!hasChanges) return null;

  return (
    <div className="section">
      <strong>{label}:</strong>
      {diff.addedCards.length > 0 && (
        <span className="added">+{diff.addedCards.join(', ')}</span>
      )}
      {diff.removedCards.length > 0 && (
        <span className="removed">-{diff.removedCards.join(', ')}</span>
      )}
      {diff.changedQuantities.map((c) => (
        <span key={c.name} className="changed">
          {c.name} ({c.oldQty}→{c.newQty})
        </span>
      ))}
    </div>
  );
}

interface RefreshDiffBannerProps {
  diff: RefreshDiff;
  onDismiss: () => void;
}

export function RefreshDiffBanner({ diff, onDismiss }: RefreshDiffBannerProps) {
  return (
    <div className="refresh-diff-banner">
      <div className="heading">
        <strong>Deck updated from Moxfield</strong>
        <button onClick={onDismiss} className="dismiss-btn">Dismiss</button>
      </div>
      <DiffSection label="Mainboard" diff={diff.mainboard} />
      <DiffSection label="Sideboard" diff={diff.sideboard} />
      {diff.affectedMatchups.length > 0 && (
        <p className="affected">
          Affected matchups: {diff.affectedMatchups.join(', ')}
        </p>
      )}
    </div>
  );
}
