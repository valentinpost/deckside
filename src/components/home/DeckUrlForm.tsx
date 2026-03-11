interface DeckUrlFormProps {
  url: string;
  error: string;
  onUrlChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function DeckUrlForm({ url, error, onUrlChange, onSubmit }: DeckUrlFormProps) {
  return (
    <form onSubmit={onSubmit} className="deck-url-form">
      <label htmlFor="moxfield-url" className="label">
        Moxfield Deck URL
      </label>
      <div className="row">
        <input
          id="moxfield-url"
          type="url"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://www.moxfield.com/decks/..."
          className="input"
        />
        <button type="submit" className="submit-btn">
          Load
        </button>
      </div>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
