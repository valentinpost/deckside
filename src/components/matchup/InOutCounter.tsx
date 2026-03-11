import { sumQuantities } from '@/utils/validation';
import type { CardRef } from '@/types/deck';

interface InOutCounterProps {
  out: CardRef[];
  inCards: CardRef[];
}

export function InOutCounter({ out, inCards }: InOutCounterProps) {
  const outCount = sumQuantities(out);
  const inCount = sumQuantities(inCards);

  if (outCount === 0 && inCount === 0) return null;

  const balanced = outCount === inCount;
  const diff = inCount - outCount;

  return (
    <div className="in-out-counter">
      <div className="counts">
        <span className="out-count">Out: {outCount}</span>
        <span className="in-count">In: {inCount}</span>
      </div>
      <div className="status">
        {balanced ? (
          <span className="balanced">Balanced</span>
        ) : (
          <span className="diff">
            {diff > 0 ? `+${diff}` : diff} cards
          </span>
        )}
      </div>
    </div>
  );
}
