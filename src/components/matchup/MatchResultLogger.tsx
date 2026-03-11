import { useState } from 'react';
import type { MatchResult } from '@/types/deck';
import { calcWinRate, formatWinRate, formatTimestamp } from '@/utils';
import { TrashIcon } from '@/components/icons';

interface MatchResultLoggerProps {
  results: MatchResult[];
  onAdd: (result: Omit<MatchResult, 'id' | 'timestamp'>) => void;
  onRemove: (resultId: string) => void;
}

const SCORES = [
  { label: '2–0', gamesWon: 2, gamesLost: 0 },
  { label: '2–1', gamesWon: 2, gamesLost: 1 },
  { label: '1–2', gamesWon: 1, gamesLost: 2 },
  { label: '0–2', gamesWon: 0, gamesLost: 2 },
] as const;

export function MatchResultLogger({ results, onAdd, onRemove }: MatchResultLoggerProps) {
  const [onPlay, setOnPlay] = useState<boolean | undefined>(undefined);

  const stats = calcWinRate(results);
  const sorted = [...results].sort((a, b) => b.timestamp - a.timestamp);

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
        {stats.totalMatches > 0 && (
          <span className="stats">
            {formatWinRate(stats.matchWinRate)} ({stats.matchWins}W–{stats.matchLosses}L)
          </span>
        )}
      </div>

      <div className="controls">
        <div className="play-draw">
          <button
            className={`toggle-btn ${onPlay === true ? 'active' : ''}`}
            onClick={() => setOnPlay(onPlay === true ? undefined : true)}
          >
            Play
          </button>
          <button
            className={`toggle-btn ${onPlay === false ? 'active' : ''}`}
            onClick={() => setOnPlay(onPlay === false ? undefined : false)}
          >
            Draw
          </button>
        </div>

        <div className="score-buttons">
          {SCORES.map((s) => (
            <button
              key={s.label}
              className={`score-btn ${s.gamesWon === 2 ? 'win' : 'loss'}`}
              onClick={() => handleScore(s.gamesWon, s.gamesLost)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {sorted.length > 0 && (
        <div className="result-list">
          {sorted.map((r) => (
            <div key={r.id} className="result-item">
              <span className={`score ${r.won ? 'win' : 'loss'}`}>
                {r.gamesWon}–{r.gamesLost}
              </span>
              {r.onPlay !== undefined && (
                <span className="play-draw-tag">{r.onPlay ? 'Play' : 'Draw'}</span>
              )}
              <span className="time">{formatTimestamp(r.timestamp)}</span>
              <button
                onClick={() => onRemove(r.id)}
                className="remove-btn"
                aria-label="Remove result"
              >
                <TrashIcon size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
