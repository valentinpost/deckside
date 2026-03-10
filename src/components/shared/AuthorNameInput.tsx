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
          className="flex-1 rounded-lg bg-slate-900 border border-slate-600 px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-sm font-medium transition-colors"
        >
          Save
        </button>
      </div>
    </form>
  );
}
