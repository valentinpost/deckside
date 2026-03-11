import type { WinRateStats } from '@/utils/winRate';
import { formatWinRate } from '@/utils/winRate';

interface WinRateBadgeProps {
  stats: WinRateStats;
  className?: string;
}

export function WinRateBadge({ stats, className = 'win-rate' }: WinRateBadgeProps) {
  if (stats.totalMatches === 0) return null;
  return (
    <span className={className}>
      {formatWinRate(stats.matchWinRate)} ({stats.matchWins}W-{stats.matchLosses}L)
    </span>
  );
}
