import { describe, expect, it } from 'vitest';
import { viewingMinutes } from '../../supabase/functions/health-access/viewing-duration';
import { administerDecision } from '../../supabase/functions/health-access/admin-decision';

describe('owner-selected special invitation', () => {
  it('keeps ordinary invitations at forty minutes', () => {
    expect(viewingMinutes({})).toBe(40);
    expect(viewingMinutes({ viewing_duration_minutes: 40 })).toBe(40);
  });
  it('allows the protected sixty-minute invitation', () => {
    expect(viewingMinutes({ viewing_duration_minutes: 60 })).toBe(60);
    expect(viewingMinutes({ viewing_duration_minutes: 120 })).toBe(40);
  });
  it('does not approve a special request without administrator verification', async () => {
    let saved = false;
    const result = await administerDecision({ request_id: 'special', decision: 'approve', expected_status: 'pending', confirmed: true }, {
      authorize: async () => false, read: async () => null,
      save: async () => { saved = true; return true; }, sendApproval: async () => true,
    });
    expect(result.status).toBe(403);
    expect(saved).toBe(false);
  });
  it('passes the protected duration to the invitation after confirmed approval', async () => {
    let emailedMinutes = 0;
    const result = await administerDecision({ request_id: 'special', decision: 'approve', expected_status: 'pending', confirmed: true }, {
      authorize: async () => true,
      read: async () => ({ id: 'special', status: 'pending', revoked_at: null, full_name: 'Fictional visitor', work_email: 'visitor@example.invalid', viewing_duration_minutes: 60 }),
      save: async () => true,
      sendApproval: async r => { emailedMinutes = viewingMinutes(r); return true; },
    });
    expect(result.status).toBe(200);
    expect(emailedMinutes).toBe(60);
  });
});