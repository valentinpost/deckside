import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SideboardPlan } from '../matchup/SideboardPlan';

describe('SideboardPlan', () => {
  it('returns null when both out and in are empty', () => {
    const { container } = render(<SideboardPlan out={[]} inCards={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders out cards with negative quantities', () => {
    render(<SideboardPlan out={[{ name: 'Lightning Bolt', quantity: 2 }]} inCards={[]} />);
    expect(screen.getByText('-2 Lightning Bolt')).toBeInTheDocument();
  });

  it('renders in cards with positive quantities', () => {
    render(<SideboardPlan out={[]} inCards={[{ name: 'Rest in Peace', quantity: 1 }]} />);
    expect(screen.getByText('+1 Rest in Peace')).toBeInTheDocument();
  });

  it('shows "None" for empty out column when in has cards', () => {
    render(<SideboardPlan out={[]} inCards={[{ name: 'Card', quantity: 1 }]} />);
    expect(screen.getByText('None')).toBeInTheDocument();
  });

  it('shows "None" for empty in column when out has cards', () => {
    render(<SideboardPlan out={[{ name: 'Card', quantity: 1 }]} inCards={[]} />);
    expect(screen.getByText('None')).toBeInTheDocument();
  });

  it('renders multiple cards in each column', () => {
    render(
      <SideboardPlan
        out={[{ name: 'Bolt', quantity: 2 }, { name: 'Push', quantity: 1 }]}
        inCards={[{ name: 'RIP', quantity: 2 }, { name: 'Cage', quantity: 1 }]}
      />,
    );
    expect(screen.getByText('-2 Bolt')).toBeInTheDocument();
    expect(screen.getByText('-1 Push')).toBeInTheDocument();
    expect(screen.getByText('+2 RIP')).toBeInTheDocument();
    expect(screen.getByText('+1 Cage')).toBeInTheDocument();
  });

  it('has Out and In headings', () => {
    render(<SideboardPlan out={[{ name: 'A', quantity: 1 }]} inCards={[{ name: 'B', quantity: 1 }]} />);
    expect(screen.getByText('Out')).toBeInTheDocument();
    expect(screen.getByText('In')).toBeInTheDocument();
  });
});
