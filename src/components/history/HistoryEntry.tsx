import type { HistoryEntry as HistoryEntryType } from '@/types/deck';
import { formatTimestamp } from '@/utils/format';

interface HistoryEntryProps {
  entry: HistoryEntryType;
  onRevert: (entryId: string) => void;
}

export function HistoryEntryItem({ entry, onRevert }: HistoryEntryProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-700/50 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-200 truncate">{entry.action}</p>
        <p className="text-xs text-slate-400 mt-0.5">
          {entry.author} &middot; {formatTimestamp(entry.timestamp)}
        </p>
      </div>
      <button
        onClick={() => onRevert(entry.id)}
        className="text-xs text-blue-400 hover:text-blue-300 px-2 py-1 rounded hover:bg-slate-700/50 transition-colors shrink-0"
      >
        Revert
      </button>
    </div>
  );
}
