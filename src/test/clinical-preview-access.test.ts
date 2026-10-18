import { describe, expect, it } from 'vitest';
import { readPreviewGrant } from '@/pages/health/preview-access';

const start = '2026-10-18T17:00:00.000Z';
const grant = (end: string, now = start) => ({ ok: true, name: 'Test visitor', email: 'visitor@example.invalid', server_now: now, viewing_expires_at: end });
describe('single five-minute visitor viewing', () => {
  it('accepts exactly five minutes from server first entry', () => {
    expect(readPreviewGrant(grant('2026-10-18T17:05:00.000Z'))?.remaining).toBe(300000);
  });
  it('a returning visitor receives only the remaining window', () => {
    expect(readPreviewGrant(grant('2026-10-18T17:05:00.000Z', '2026-10-18T17:04:00.000Z'))?.remaining).toBe(60000);
  });
  it('denies at the exact five-minute deadline', () => {
    expect(readPreviewGrant(grant('2026-10-18T17:05:00.000Z', '2026-10-18T17:05:00.000Z'))).toBeNull();
  });
  it('does not accept the former 45-minute window', () => {
    expect(readPreviewGrant(grant('2026-10-18T17:45:00.000Z'))).toBeNull();
  });
  it('cannot open from browser timing alone or an unverified identity', () => {
    expect(readPreviewGrant({ ok: true, name: 'Test', email: 'test@example.invalid', expires_at: '2026-10-25' })).toBeNull();
    expect(readPreviewGrant({ ...grant('2026-10-18T17:05:00.000Z'), ok: false })).toBeNull();
  });
});