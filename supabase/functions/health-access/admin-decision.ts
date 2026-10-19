export type Decision = 'approve' | 'deny' | 'revoke';
export type DecisionRequest = { id: string; status: string; revoked_at: string | null; full_name: string; work_email: string };
export type DecisionInput = { request_id: string; decision: Decision; expected_status: string; confirmed: true };
export type DecisionDependencies = {
  authorize: () => Promise<boolean>;
  read: (id: string) => Promise<DecisionRequest | null>;
  save: (id: string, expected: string, changes: Record<string, unknown>) => Promise<boolean>;
  sendApproval: (r: DecisionRequest, access: string, expires: Date) => Promise<boolean>;
};
export function allowedDecision(status: string, decision: Decision): boolean {
  return decision === 'revoke' ? status === 'approved' : status === 'pending';
}
export async function administerDecision(input: DecisionInput, deps: DecisionDependencies) {
  if (!await deps.authorize()) return { status: 403, body: { error: 'Administrator sign-in required.' } };
  const r = await deps.read(input.request_id);
  if (!r) return { status: 404, body: { error: 'Request not found.' } };
  if (r.status !== input.expected_status || r.revoked_at || !allowedDecision(r.status, input.decision)) return { status: 409, body: { error: 'This request has changed. Refresh before deciding again.' } };
  const stamp = new Date().toISOString();
  const expires = new Date(Date.now() + 7 * 86400000);
  const access = input.decision === 'approve' ? Array.from(crypto.getRandomValues(new Uint8Array(24)), b => b.toString(16).padStart(2, '0')).join('') : null;
  const changes = input.decision === 'approve'
    ? { status: 'approved', access_token: access, decided_at: stamp, expires_at: expires.toISOString(), device_id: null, first_entered_at: null, viewing_expires_at: null }
    : input.decision === 'deny' ? { status: 'denied', decided_at: stamp, access_token: null }
    : { status: 'revoked', access_token: null, revoked_at: stamp };
  if (!await deps.save(r.id, r.status, changes)) return { status: 409, body: { error: 'Decision not confirmed. Refresh and check before retrying.' } };
  let emailAccepted: boolean | null = null;
  if (access) { try { emailAccepted = await deps.sendApproval(r, access, expires); } catch { emailAccepted = false; } }
  return { status: 200, body: { ok: true, decision: input.decision, email_accepted: emailAccepted } };
}