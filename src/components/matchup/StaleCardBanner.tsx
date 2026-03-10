interface StaleCardBannerProps {
  staleCards: string[];
}

export function StaleCardBanner({ staleCards }: StaleCardBannerProps) {
  if (staleCards.length === 0) return null;

  return (
    <div className="rounded-lg bg-yellow-950/50 border border-yellow-800 p-3">
      <p className="text-yellow-200 text-sm font-medium">
        Stale cards detected
      </p>
      <p className="text-yellow-300/70 text-xs mt-1">
        The following cards are referenced in this matchup but no longer in the deck:{' '}
        {staleCards.join(', ')}
      </p>
    </div>
  );
}
