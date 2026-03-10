import { useState } from 'react';
import type { HistoryEntry } from '@/types/deck';
import { HistoryEntryItem } from './HistoryEntry';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { CloseIcon } from '@/components/icons';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onRevert: (entryId: string) => void;
  open: boolean;
  onClose: () => void;
}

export function HistoryPanel({ history, onRevert, open, onClose }: HistoryPanelProps) {
  const [revertTarget, setRevertTarget] = useState<string | null>(null);

  function handleRevert(entryId: string) {
    setRevertTarget(entryId);
  }

  function confirmRevert() {
    if (revertTarget) {
      onRevert(revertTarget);
      setRevertTarget(null);
    }
  }

  if (!open) return null;

  return (
    <>
      <div className="backdrop" onClick={onClose} />

      <div className="bottom-sheet">
        <div className="bottom-sheet-header">
          <h3 className="font-semibold">Edit History</h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4">
          {history.length === 0 ? (
            <p className="text-slate-500 text-sm py-6 text-center">No history yet</p>
          ) : (
            history.map((entry) => (
              <HistoryEntryItem
                key={entry.id}
                entry={entry}
                onRevert={handleRevert}
              />
            ))
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!revertTarget}
        title="Revert Changes"
        message="This will restore matchups to the selected snapshot. A new history entry will be logged for the revert."
        confirmLabel="Revert"
        confirmVariant="danger"
        onConfirm={confirmRevert}
        onCancel={() => setRevertTarget(null)}
      />
    </>
  );
}
