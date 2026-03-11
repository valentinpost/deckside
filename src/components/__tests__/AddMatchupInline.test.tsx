import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddMatchupInline } from '../deck/AddMatchupInline';

describe('AddMatchupInline', () => {
  it('renders an input with placeholder', () => {
    render(<AddMatchupInline onAdd={vi.fn()} onCancel={vi.fn()} existingSlugs={[]} />);
    expect(screen.getByPlaceholderText(/vs Burn/)).toBeInTheDocument();
  });

  it('auto-focuses the input', () => {
    render(<AddMatchupInline onAdd={vi.fn()} onCancel={vi.fn()} existingSlugs={[]} />);
    expect(screen.getByPlaceholderText(/vs Burn/)).toHaveFocus();
  });

  it('calls onAdd with trimmed name on Enter', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddMatchupInline onAdd={onAdd} onCancel={vi.fn()} existingSlugs={[]} />);

    await user.type(screen.getByPlaceholderText(/vs Burn/), 'vs Control{Enter}');
    expect(onAdd).toHaveBeenCalledWith('vs Control');
  });

  it('calls onCancel on Escape', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<AddMatchupInline onAdd={vi.fn()} onCancel={onCancel} existingSlugs={[]} />);

    await user.type(screen.getByPlaceholderText(/vs Burn/), 'vs X{Escape}');
    expect(onCancel).toHaveBeenCalled();
  });

  it('calls onCancel when blurring empty input', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<AddMatchupInline onAdd={vi.fn()} onCancel={onCancel} existingSlugs={[]} />);

    await user.click(screen.getByPlaceholderText(/vs Burn/));
    await user.tab(); // blur
    expect(onCancel).toHaveBeenCalled();
  });

  it('submits on blur with non-empty input', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddMatchupInline onAdd={onAdd} onCancel={vi.fn()} existingSlugs={[]} />);

    await user.type(screen.getByPlaceholderText(/vs Burn/), 'vs Aggro');
    await user.tab(); // blur
    expect(onAdd).toHaveBeenCalledWith('vs Aggro');
  });

  it('shows error for duplicate slug', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddMatchupInline onAdd={onAdd} onCancel={vi.fn()} existingSlugs={['vs-burn']} />);

    await user.type(screen.getByPlaceholderText(/vs Burn/), 'vs Burn{Enter}');
    expect(screen.getByText(/similar name already exists/)).toBeInTheDocument();
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('does not double-fire on Enter then blur', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    const onCancel = vi.fn();
    render(<AddMatchupInline onAdd={onAdd} onCancel={onCancel} existingSlugs={[]} />);

    await user.type(screen.getByPlaceholderText(/vs Burn/), 'vs Mill{Enter}');
    // blur fires after Enter — should be guarded by doneRef
    await user.tab();

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });
});
