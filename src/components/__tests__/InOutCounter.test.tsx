import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InOutCounter } from '../matchup/InOutCounter';

describe('InOutCounter', () => {
  it('returns null when both out and in are empty', () => {
    const { container } = render(<InOutCounter out={[]} inCards={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('displays out and in counts', () => {
    render(<InOutCounter out={[{ name: 'A', quantity: 3 }]} inCards={[{ name: 'B', quantity: 2 }]} />);
    expect(screen.getByText('Out: 3')).toBeInTheDocument();
    expect(screen.getByText('In: 2')).toBeInTheDocument();
  });

  it('shows "Balanced" when counts are equal', () => {
    render(<InOutCounter out={[{ name: 'A', quantity: 2 }]} inCards={[{ name: 'B', quantity: 2 }]} />);
    expect(screen.getByText('Balanced')).toBeInTheDocument();
  });

  it('shows positive diff when in > out', () => {
    render(<InOutCounter out={[{ name: 'A', quantity: 1 }]} inCards={[{ name: 'B', quantity: 3 }]} />);
    expect(screen.getByText('+2 cards')).toBeInTheDocument();
  });

  it('shows negative diff when out > in', () => {
    render(<InOutCounter out={[{ name: 'A', quantity: 4 }]} inCards={[{ name: 'B', quantity: 1 }]} />);
    expect(screen.getByText('-3 cards')).toBeInTheDocument();
  });

  it('sums multiple card refs', () => {
    render(
      <InOutCounter
        out={[{ name: 'A', quantity: 2 }, { name: 'B', quantity: 1 }]}
        inCards={[{ name: 'C', quantity: 3 }]}
      />,
    );
    expect(screen.getByText('Out: 3')).toBeInTheDocument();
    expect(screen.getByText('In: 3')).toBeInTheDocument();
    expect(screen.getByText('Balanced')).toBeInTheDocument();
  });
});
