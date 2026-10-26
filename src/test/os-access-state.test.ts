import { describe, expect, it } from 'vitest';
import { osViewState } from '@/components/admin/OsAccessRequests';

describe('1325 OS walkthrough status', () => {
  const now = Date.parse('2026-10-27T00:00:00Z');
  it('shows viewing ended once the hour passes', () => {
    expect(osViewState({ status: 'approved', viewing_started_at: '2026-10-26T22:00:00Z', viewing_expires_at: '2026-10-26T23:00:00Z' }, now)).toBe('Viewing hour ended');
  });
  it('shows viewing now inside the hour', () => {
    expect(osViewState({ status: 'approved', viewing_started_at: '2026-10-26T23:30:00Z', viewing_expires_at: '2026-10-27T00:30:00Z' }, now)).toBe('Viewing now');
  });
  it('approved but unopened has not started the clock', () => {
    expect(osViewState({ status: 'approved', viewing_started_at: null, viewing_expires_at: null }, now)).toBe('Approved · not opened yet');
  });
});
