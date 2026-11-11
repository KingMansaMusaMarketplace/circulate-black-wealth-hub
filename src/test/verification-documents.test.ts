import { describe, it, expect } from 'vitest';
import {
  isAiCheckAllowed,
  validateVerificationFile,
  buildVerificationPath,
  isStoredVerificationPath,
} from '@/lib/verification/documents';

describe('verification paperwork rules', () => {
  it('never sends government IDs to the AI check', () => {
    expect(isAiCheckAllowed('identity')).toBe(false);
  });

  it('keeps the AI check for business papers', () => {
    for (const t of ['registration', 'ownership', 'address', 'license'] as const) {
      expect(isAiCheckAllowed(t)).toBe(true);
    }
  });

  it('stores files inside the owner folder', () => {
    expect(buildVerificationPath('owner-1', 'biz-9', 'identity', 'image/png', 42)).toBe('owner-1/biz-9/identity_42.png');
  });

  it('accepts PDF/PNG/JPG up to 10 MB only', () => {
    expect(validateVerificationFile({ type: 'application/pdf', size: 10 * 1024 * 1024 })).toBeNull();
    expect(validateVerificationFile({ type: 'application/pdf', size: 10 * 1024 * 1024 + 1 })).not.toBeNull();
    expect(validateVerificationFile({ type: 'image/gif', size: 100 })).not.toBeNull();
  });

  it('refuses old web addresses as stored files', () => {
    expect(isStoredVerificationPath('https://placeholder.example.com/x.pdf')).toBe(false);
    expect(isStoredVerificationPath('owner-1/biz-9/registration_1.pdf')).toBe(true);
  });
});
