import { describe, it, expect } from 'vitest';
import { parseMoxfieldUrl, buildMoxfieldUrl } from '../moxfieldUrl';

describe('parseMoxfieldUrl', () => {
  it('parses a full https URL', () => {
    expect(parseMoxfieldUrl('https://www.moxfield.com/decks/AbCdEf123')).toBe('AbCdEf123');
  });

  it('parses without www', () => {
    expect(parseMoxfieldUrl('https://moxfield.com/decks/AbCdEf123')).toBe('AbCdEf123');
  });

  it('parses without protocol', () => {
    expect(parseMoxfieldUrl('moxfield.com/decks/AbCdEf123')).toBe('AbCdEf123');
  });

  it('handles trailing slashes', () => {
    expect(parseMoxfieldUrl('https://www.moxfield.com/decks/AbCdEf123/')).toBe('AbCdEf123');
  });

  it('handles deck IDs with dashes and underscores', () => {
    expect(parseMoxfieldUrl('https://www.moxfield.com/decks/Ab-Cd_Ef')).toBe('Ab-Cd_Ef');
  });

  it('returns null for empty input', () => {
    expect(parseMoxfieldUrl('')).toBeNull();
  });

  it('returns null for non-moxfield URLs', () => {
    expect(parseMoxfieldUrl('https://google.com/decks/abc')).toBeNull();
  });

  it('returns null for moxfield URLs without /decks/', () => {
    expect(parseMoxfieldUrl('https://www.moxfield.com/users/abc')).toBeNull();
  });

  it('handles whitespace', () => {
    expect(parseMoxfieldUrl('  https://www.moxfield.com/decks/abc  ')).toBe('abc');
  });
});

describe('buildMoxfieldUrl', () => {
  it('builds a URL from a deck ID', () => {
    expect(buildMoxfieldUrl('AbCdEf123')).toBe('https://www.moxfield.com/decks/AbCdEf123');
  });
});
