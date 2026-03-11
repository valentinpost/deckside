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
    <form onSubmit={handleSubmit} className="author-name-input">
      <p className="prompt">
        Enter your name to track edits:
      </p>
      <div className="row">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="input"
        />
        <button type="submit" className="btn-primary">
          Save
        </button>
      </div>
    </form>
  );
}
