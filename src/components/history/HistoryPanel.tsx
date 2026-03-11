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
      <div className="history-panel-backdrop" onClick={onClose} />

      <div className="history-panel">
        <div className="header">
          <h3 className="title">Edit History</h3>
          <button
            onClick={onClose}
            className="close-btn"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="content">
          {history.length === 0 ? (
            <p className="empty">No history yet</p>
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
