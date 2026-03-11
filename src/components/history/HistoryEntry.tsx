import type { HistoryEntry } from '@/types/deck';
import { formatTimestamp } from '@/utils/format';

interface HistoryEntryItemProps {
  entry: HistoryEntry;
  onRevert: (entryId: string) => void;
}

export function HistoryEntryItem({ entry, onRevert }: HistoryEntryItemProps) {
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
