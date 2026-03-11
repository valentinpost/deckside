import type { MatchResult } from '@/types/deck';
import { formatTimestamp } from '@/utils';
import { TrashIcon } from '@/components/icons';

interface ResultHistoryListProps {
  results: MatchResult[];
  onRemove: (resultId: string) => void;
}

export function ResultHistoryList({ results, onRemove }: ResultHistoryListProps) {
  const sortedByNewest = [...results].sort((a, b) => b.timestamp - a.timestamp);

  if (sortedByNewest.length === 0) return null;

  return (
    <div className="result-list">
      {sortedByNewest.map((result) => (
        <div key={result.id} className="result-item">
          <span className={`score ${result.won ? 'win' : 'loss'}`}>
            {result.gamesWon}-{result.gamesLost}
          </span>
          {result.onPlay !== undefined && (
            <span className="play-draw-tag">{result.onPlay ? 'Play' : 'Draw'}</span>
          )}
          <span className="time">{formatTimestamp(result.timestamp)}</span>
          <button
            onClick={() => onRemove(result.id)}
            className="remove-btn"
            aria-label="Remove result"
          >
            <TrashIcon size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
