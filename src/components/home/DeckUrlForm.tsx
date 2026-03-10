interface DeckUrlFormProps {
  url: string;
  error: string;
  onUrlChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function DeckUrlForm({ url, error, onUrlChange, onSubmit }: DeckUrlFormProps) {
  return (
    <form onSubmit={onSubmit} className="max-w-lg mx-auto space-y-3">
      <label htmlFor="moxfield-url" className="block text-sm font-medium text-slate-300">
        Moxfield Deck URL
      </label>
      <div className="flex gap-2">
        <input
          id="moxfield-url"
          type="url"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://www.moxfield.com/decks/..."
          className="input-md flex-1"
        />
        <button type="submit" className="btn-primary px-5 py-3">
          Load
        </button>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </form>
  );
}
