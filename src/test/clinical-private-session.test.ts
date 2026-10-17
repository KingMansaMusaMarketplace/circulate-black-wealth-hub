import { beforeEach, describe, expect, it } from 'vitest';
import { closePrivateSession, PRIVATE_SESSION_END, PRIVATE_SESSION_ENDED } from '@/pages/health/PrivateSession';

beforeEach(() => localStorage.clear());
describe('ending a clinical private session', () => {
  it('removes the active visit deadline and persists a lock across reloads', () => {
    localStorage.setItem(PRIVATE_SESSION_END, String(Date.now() + 45 * 60 * 1000));
    closePrivateSession(localStorage);
    expect(localStorage.getItem(PRIVATE_SESSION_END)).toBeNull();
    expect(localStorage.getItem(PRIVATE_SESSION_ENDED)).toBe('true');
  });
  it('preserves the approved link and device binding for the seven-day access window', () => {
    localStorage.setItem('hc_preview_access', 'approved-link');
    localStorage.setItem('hc_preview_device', 'original-device');
    closePrivateSession(localStorage);
    expect(localStorage.getItem('hc_preview_access')).toBe('approved-link');
    expect(localStorage.getItem('hc_preview_device')).toBe('original-device');
  });
});