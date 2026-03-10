import { describe, it, expect } from 'vitest';
import { toSlug } from '../slug';

describe('toSlug', () => {
  it('converts spaces to dashes', () => {
    expect(toSlug('vs Burn')).toBe('vs-burn');
  });

  it('handles parentheses and special characters', () => {
    expect(toSlug('4C Omnath (Yorion)')).toBe('4c-omnath-yorion');
  });

  it('removes leading/trailing dashes', () => {
    expect(toSlug('--hello--')).toBe('hello');
  });

  it('lowercases everything', () => {
    expect(toSlug('VS MONO RED')).toBe('vs-mono-red');
  });

  it('collapses multiple special chars', () => {
    expect(toSlug('foo   bar---baz')).toBe('foo-bar-baz');
  });
});
