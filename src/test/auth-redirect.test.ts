import { describe, it, expect } from 'vitest';
import { getSafeRedirect, passwordProblems } from '@/lib/auth-redirect';

describe('getSafeRedirect', () => {
  it('returns a same-site path', () => {
    expect(getSafeRedirect('?redirect=%2Fclaim-business%3Ftoken%3Dabc')).toBe('/claim-business?token=abc');
  });
  it('rejects outside sites', () => {
    expect(getSafeRedirect('?redirect=https://evil.com')).toBeNull();
    expect(getSafeRedirect('?redirect=//evil.com')).toBeNull();
  });
});

describe('passwordProblems', () => {
  it('accepts a password meeting all five rules', () => {
    expect(passwordProblems('Abcdef1!')).toEqual([]);
  });
  it('rejects an 8-letter password with no capital, number or symbol', () => {
    expect(passwordProblems('abcdefgh')).toHaveLength(3);
  });
});
