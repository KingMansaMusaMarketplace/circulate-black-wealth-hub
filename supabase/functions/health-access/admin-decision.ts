export type Decision = 'approve' | 'deny' | 'revoke' | 'reopen' | 'extend';
export type DecisionRequest = { id: string; status: string; revoked_at: string | null; full_name: string; work_email: string; first_entered_at?: string | null; viewing_expires_at?: string | null };
export type DecisionInput = { request_id: string; decision: Decision; expected_status: string; confirmed: true };
export type DecisionDependencies = {
  authorize: () => Promise<boolean>;
  read: (id: string) => Promise<DecisionRequest | null>;
  save: (id: string, expected: string, changes: Record<string, unknown>) => Promise<boolean>;
  sendApproval: (r: DecisionRequest, access: string, expires: Date) => Promise<boolean>;
};
export function allowedDecision(status: string, decision: Decision): boolean {
  if (decision === 'revoke') return status === 'approved';
  if (decision === 'extend') return status === 'approved';
  if (decision === 'reopen') return status === 'expired';
  return status === 'pending';
}
export async function administerDecision(input: DecisionInput, deps: DecisionDependencies) {
  if (!await deps.authorize()) return { status: 403, body: { error: 'Administrator sign-in required.' } };
  const r = await deps.read(input.request_id);
  if (!r) return { status: 404, body: { error: 'Request not found.' } };
  if (r.status !== input.expected_status || r.revoked_at || !allowedDecision(r.status, input.decision)) return { status: 409, body: { error: 'This request has changed. Refresh before deciding again.' } };
  const stamp = new Date().toISOString();
  if (input.decision === 'extend') {
    const end = r.viewing_expires_at ? Date.parse(r.viewing_expires_at) : NaN;
    if (!r.first_entered_at || !Number.isFinite(end) || end <= Date.now()) return { status: 409, body: { error: 'This visitor is not viewing right now. Refresh before deciding again.' } };
    // Resets the open session to a full twenty minutes on the same link and device.
    const until = new Date(Date.now() + 20 * 60000).toISOString();
    if (!await deps.save(r.id, r.status, { status: 'approved', viewing_expires_at: until })) return { status: 409, body: { error: 'Decision not confirmed. Refresh and check before retrying.' } };
    return { status: 200, body: { ok: true, decision: 'extend', email_accepted: null, viewing_expires_at: until } };
  }
  const expires = new Date(Date.now() + 7 * 86400000);
  const access = input.decision === 'approve' || input.decision === 'reopen' ? Array.from(crypto.getRandomValues(new Uint8Array(24)), b => b.toString(16).padStart(2, '0')).join('') : null;
  const changes = access
    ? { status: 'approved', access_token: access, decided_at: stamp, expires_at: expires.toISOString(), device_id: null, first_entered_at: null, viewing_expires_at: null }
    : input.decision === 'deny' ? { status: 'denied', decided_at: stamp, access_token: null }
    : { status: 'revoked', access_token: null, revoked_at: stamp };
  if (!await deps.save(r.id, r.status, changes)) return { status: 409, body: { error: 'Decision not confirmed. Refresh and check before retrying.' } };
  let emailAccepted: boolean | null = null;
  if (access) { try { emailAccepted = await deps.sendApproval(r, access, expires); } catch { emailAccepted = false; } }
  return { status: 200, body: { ok: true, decision: input.decision, email_accepted: emailAccepted } };
}