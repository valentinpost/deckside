import { useState } from 'react';

interface InlineRenameInputProps {
  initialName: string;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

export function InlineRenameInput({ initialName, onSubmit, onCancel }: InlineRenameInputProps) {
  const [editName, setEditName] = useState(initialName);

  function handleSubmit() {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== initialName) {
      onSubmit(trimmed);
    }
    onCancel();
  }

  return (
    <input
      type="text"
      value={editName}
      onChange={(e) => setEditName(e.target.value)}
      onBlur={handleSubmit}
      onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); if (e.key === 'Escape') onCancel(); }}
      onClick={(e) => e.preventDefault()}
      autoFocus
      className="inline-input"
    />
  );
}
