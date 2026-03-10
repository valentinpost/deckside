import { sumQuantities } from '@/utils/validation';
import type { CardRef } from '@/types/deck';

interface InOutCounterProps {
  out: CardRef[];
  inCards: CardRef[];
}

export function InOutCounter({ out, inCards }: InOutCounterProps) {
  const outCount = sumQuantities(out);
  const inCount = sumQuantities(inCards);
  const balanced = outCount === inCount;
  const diff = inCount - outCount;

  return (
    <div className="sticky bottom-0 z-30 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 safe-bottom">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-red-400 font-medium">Out: {outCount}</span>
          <span className="text-green-400 font-medium">In: {inCount}</span>
        </div>
        <div className="text-sm">
          {balanced ? (
            outCount > 0 ? (
              <span className="text-green-400 font-medium">Balanced</span>
            ) : (
              <span className="text-slate-500">No swaps</span>
            )
          ) : (
            <span className="text-yellow-400 font-medium">
              {diff > 0 ? `+${diff}` : diff} cards
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
