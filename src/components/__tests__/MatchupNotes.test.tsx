import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MatchupNotes } from '../matchup/MatchupNotes';

describe('MatchupNotes', () => {
  it('renders textarea with value', () => {
    render(<MatchupNotes notes="Keep in Bolt" onChange={vi.fn()} onBlur={vi.fn()} />);
    expect(screen.getByDisplayValue('Keep in Bolt')).toBeInTheDocument();
  });

  it('shows placeholder when empty', () => {
    render(<MatchupNotes notes="" onChange={vi.fn()} onBlur={vi.fn()} />);
    expect(screen.getByPlaceholderText(/Strategy notes/)).toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MatchupNotes notes="" onChange={onChange} onBlur={vi.fn()} />);
    await user.type(screen.getByRole('textbox'), 'x');
    expect(onChange).toHaveBeenCalledWith('x');
  });

  it('calls onBlur when textarea loses focus', async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();
    render(<MatchupNotes notes="test" onChange={vi.fn()} onBlur={onBlur} />);
    await user.click(screen.getByRole('textbox'));
    await user.tab();
    expect(onBlur).toHaveBeenCalledOnce();
  });

  it('has a label', () => {
    render(<MatchupNotes notes="" onChange={vi.fn()} onBlur={vi.fn()} />);
    expect(screen.getByLabelText('Notes')).toBeInTheDocument();
  });
});
