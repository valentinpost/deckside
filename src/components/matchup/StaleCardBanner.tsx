interface StaleCardBannerProps {
  staleCards: string[];
}

export function StaleCardBanner({ staleCards }: StaleCardBannerProps) {
  if (staleCards.length === 0) return null;

  return (
    <div className="stale-card-banner">
      <p className="heading">
        Stale cards detected
      </p>
      <p className="body">
        The following cards are referenced in this matchup but no longer in the deck:{' '}
        {staleCards.join(', ')}
      </p>
    </div>
  );
}
