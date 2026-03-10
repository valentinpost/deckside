import type { HistoryEntry as HistoryEntryType } from '@/types/deck';

interface HistoryEntryProps {
  entry: HistoryEntryType;
  onRevert: (entryId: string) => void;
}

function formatTimestamp(ts: number): string {
  const date = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

export function HistoryEntryComponent({ entry, onRevert }: HistoryEntryProps) {
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
