import { describe, it, expect } from 'vitest';
import { recoveryRedirectPath, isRecoveryVerifier } from '@/lib/auth/recovery-redirect';

describe('password reset link landing on the homepage', () => {
  it('sends a reset link that fell back to the root to the reset page', () => {
    expect(
      recoveryRedirectPath('https://circulate-black-wealth-hub.lovable.app/?code=abc-123', JSON.stringify('verifier/PASSWORD_RECOVERY')),
    ).toBe('/reset-password?code=abc-123');
  });

  it('leaves normal sign-in links (no reset marker) alone', () => {
    expect(recoveryRedirectPath('https://1325.ai/?code=abc', JSON.stringify('verifier'))).toBeNull();
    expect(recoveryRedirectPath('https://1325.ai/?code=abc', null)).toBeNull();
  });

  it('does nothing when already on the reset page or with no code', () => {
    expect(recoveryRedirectPath('https://1325.ai/reset-password?code=abc', 'v/PASSWORD_RECOVERY')).toBeNull();
    expect(recoveryRedirectPath('https://1325.ai/', 'v/PASSWORD_RECOVERY')).toBeNull();
  });

  it('recognises the marker stored as plain text or JSON', () => {
    expect(isRecoveryVerifier('v/PASSWORD_RECOVERY')).toBe(true);
    expect(isRecoveryVerifier('"v/PASSWORD_RECOVERY"')).toBe(true);
    expect(isRecoveryVerifier('"v"')).toBe(false);
  });
});
