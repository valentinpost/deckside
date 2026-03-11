import type { HistoryEntry as HistoryEntryType } from '@/types/deck';
import { formatTimestamp } from '@/utils/format';

interface HistoryEntryProps {
  entry: HistoryEntryType;
  onRevert: (entryId: string) => void;
}

export function HistoryEntryItem({ entry, onRevert }: HistoryEntryProps) {
  return (
    <div className="history-entry">
      <div className="body">
        <p className="action">{entry.action}</p>
        <p className="meta">
          {entry.author} &middot; {formatTimestamp(entry.timestamp)}
        </p>
      </div>
      <button
        onClick={() => onRevert(entry.id)}
        className="revert-btn"
      >
        Revert
      </button>
    </div>
  );
}
