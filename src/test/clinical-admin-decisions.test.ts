import { describe, expect, it, vi } from 'vitest';
import { administerDecision, allowedDecision, type DecisionDependencies, type DecisionInput } from '../../supabase/functions/health-access/admin-decision';
const input: DecisionInput = { request_id: 'fictional', decision: 'approve', expected_status: 'pending', confirmed: true };
const deps = (): DecisionDependencies => ({ authorize: vi.fn(async () => true), read: vi.fn(async () => ({ id: 'fictional', status: 'pending', revoked_at: null, full_name: 'Test', work_email: 'test@example.invalid' })), save: vi.fn(async () => true), sendApproval: vi.fn(async () => true) });
describe('Clinical administrator decisions', () => {
  it('rejects unauthorized decisions before reading or saving', async () => {
    const d = deps(); d.authorize = async () => false;
    expect((await administerDecision(input, d)).status).toBe(403);
    expect(d.read).not.toHaveBeenCalled(); expect(d.save).not.toHaveBeenCalled();
  });
  it('approves pending requests and emails only after a saved decision', async () => {
    const d = deps(); const r = await administerDecision(input, d);
    expect(r.body).toEqual({ ok: true, decision: 'approve', email_accepted: true });
    expect(d.save).toHaveBeenCalledWith('fictional', 'pending', expect.objectContaining({ status: 'approved', device_id: null, first_entered_at: null, viewing_expires_at: null }));
    expect(d.sendApproval).toHaveBeenCalledOnce();
    expect(JSON.stringify(r.body)).not.toContain('access_token');
  });
  it('does not email when a competing decision wins', async () => {
    const d = deps(); d.save = async () => false;
    expect((await administerDecision(input, d)).status).toBe(409);
    expect(d.sendApproval).not.toHaveBeenCalled();
  });
  it('never resets an already-approved visit', async () => {
    const d = deps(); d.read = async () => ({ id: 'fictional', status: 'approved', revoked_at: null, full_name: 'Test', work_email: 'test@example.invalid' });
    expect((await administerDecision(input, d)).status).toBe(409); expect(d.save).not.toHaveBeenCalled();
  });
  it('denies without sending an invitation', async () => {
    const d = deps(); expect((await administerDecision({ ...input, decision: 'deny' }, d)).status).toBe(200);
    expect(d.save).toHaveBeenCalledWith('fictional', 'pending', expect.objectContaining({ status: 'denied', access_token: null })); expect(d.sendApproval).not.toHaveBeenCalled();
  });
  it('revokes approved access without changing its original deadlines', async () => {
    const d = deps(); d.read = async () => ({ id: 'fictional', status: 'approved', revoked_at: null, full_name: 'Test', work_email: 'test@example.invalid' });
    await administerDecision({ ...input, decision: 'revoke', expected_status: 'approved' }, d);
    expect(d.save).toHaveBeenCalledWith('fictional', 'approved', { status: 'revoked', access_token: null, revoked_at: expect.any(String) }); expect(d.sendApproval).not.toHaveBeenCalled();
  });
  it('reports a saved approval separately from failed email sending', async () => {
    const d = deps(); d.sendApproval = async () => { throw new Error('provider'); };
    expect((await administerDecision(input, d)).body).toEqual({ ok: true, decision: 'approve', email_accepted: false });
  });
  it('offers decisions only for eligible statuses', () => {
    expect(allowedDecision('pending', 'approve')).toBe(true); expect(allowedDecision('pending', 'deny')).toBe(true);
    expect(allowedDecision('approved', 'revoke')).toBe(true); expect(allowedDecision('revoked', 'approve')).toBe(false); expect(allowedDecision('denied', 'revoke')).toBe(false);
  });
});
import { allowedDecision as allowedReopen } from '../../supabase/functions/health-access/admin-decision';
describe('20 more minutes', () => {
  it('only re-opens finished (expired) visits', () => {
    expect(allowedReopen('expired', 'reopen')).toBe(true);
    expect(allowedReopen('approved', 'reopen')).toBe(false);
    expect(allowedReopen('denied', 'reopen')).toBe(false);
    expect(allowedReopen('revoked', 'reopen')).toBe(false);
  });
});
