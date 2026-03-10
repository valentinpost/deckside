import type { CardRef } from '@/types/deck';

interface SideboardPlanProps {
  out: CardRef[];
  inCards: CardRef[];
}

export function SideboardPlan({ out, inCards }: SideboardPlanProps) {
  if (out.length === 0 && inCards.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div className="space-y-1">
        <h4 className="font-medium text-red-400">Out</h4>
        {out.length === 0 ? (
          <p className="text-slate-500">None</p>
        ) : (
          <ul className="space-y-0.5">
            {out.map((ref) => (
              <li key={ref.name} className="text-slate-300">
                -{ref.quantity} {ref.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="space-y-1">
        <h4 className="font-medium text-green-400">In</h4>
        {inCards.length === 0 ? (
          <p className="text-slate-500">None</p>
        ) : (
          <ul className="space-y-0.5">
            {inCards.map((ref) => (
              <li key={ref.name} className="text-slate-300">
                +{ref.quantity} {ref.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
