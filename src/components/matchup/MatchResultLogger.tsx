import { useState } from 'react';
import type { MatchResult } from '@/types/deck';
import { calcWinRate } from '@/utils';
import { WinRateBadge } from '@/components/shared/WinRateBadge';
import { ScoreControls } from './ScoreControls';
import { ResultHistoryList } from './ResultHistoryList';

interface MatchResultLoggerProps {
  results: MatchResult[];
  onAdd: (result: Omit<MatchResult, 'id' | 'timestamp'>) => void;
  onRemove: (resultId: string) => void;
}

export function MatchResultLogger({ results, onAdd, onRemove }: MatchResultLoggerProps) {
  const [onPlay, setOnPlay] = useState<boolean | undefined>(undefined);
  const winRateStats = calcWinRate(results);

  function handleScore(gamesWon: number, gamesLost: number) {
    onAdd({
      won: gamesWon === 2,
      gamesWon,
      gamesLost,
      onPlay,
    });
    setOnPlay(undefined);
  }

  return (
    <div className="match-result-logger">
      <div className="header">
        <span className="label">Match Results</span>
        <WinRateBadge stats={winRateStats} className="stats" />
      </div>

      <ScoreControls onPlay={onPlay} onPlayChange={setOnPlay} onScore={handleScore} />
      <ResultHistoryList results={results} onRemove={onRemove} />
    </div>
  );
}
