import { useState } from 'react';
import { getAuthorName, setAuthorName } from '@/db/localstorage';

interface AuthorNameInputProps {
  onSet: (name: string) => void;
}

export function AuthorNameInput({ onSet }: AuthorNameInputProps) {
  const [name, setName] = useState(() => getAuthorName());

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) {
      setAuthorName(trimmed);
      onSet(trimmed);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-slate-800 rounded-lg border border-slate-700">
      <p className="text-sm text-slate-300">
        Enter your name to track edits:
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="input-sm flex-1"
        />
        <button type="submit" className="btn-primary">
          Save
        </button>
      </div>
    </form>
  );
}
