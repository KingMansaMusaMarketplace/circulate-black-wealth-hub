import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { decisionCookieName, validDecisionSubmission } from './decision-confirmation.ts';
const nonce = 'a'.repeat(48);
const id = '00000000-0000-0000-0000-000000000001';
const url = `https://example.invalid/?id=${id}&d=approve`;
const cookie = `${decisionCookieName(id, 'approve')}=${nonce}`;
Deno.test('email GET and cross-origin submissions never authorize a decision', () => {
  assertEquals(validDecisionSubmission(new Request(url), nonce), false);
  assertEquals(validDecisionSubmission(new Request(url, { method: 'POST', headers: { origin: 'https://attacker.invalid', cookie } }), nonce), false);
});
Deno.test('deliberate same-origin confirmation requires matching cookie nonce', () => {
  const req = new Request(url, { method: 'POST', headers: { origin: 'https://example.invalid', cookie } });
  assertEquals(validDecisionSubmission(req, nonce), true);
  assertEquals(validDecisionSubmission(req, 'b'.repeat(48)), false);
});
Deno.test('two request confirmations keep independent cookies and cannot cross-authorize', () => {
  const secondId = '00000000-0000-0000-0000-000000000002';
  const secondNonce = 'b'.repeat(48);
  const cookies = `${cookie}; ${decisionCookieName(secondId, 'approve')}=${secondNonce}; ${decisionCookieName(id, 'deny')}=${'c'.repeat(48)}`;
  const request = (requestId: string, action = 'approve') => new Request(`https://example.invalid/?id=${requestId}&d=${action}`, { method: 'POST', headers: { origin: 'https://example.invalid', cookie: cookies } });
  assertEquals(validDecisionSubmission(request(id), nonce), true);
  assertEquals(validDecisionSubmission(request(secondId), secondNonce), true);
  assertEquals(validDecisionSubmission(request(secondId), nonce), false);
  assertEquals(validDecisionSubmission(request(id, 'deny'), nonce), false);
  assertEquals(validDecisionSubmission(new Request(url, { method: 'POST', headers: { cookie } }), nonce), false);
  assertEquals(validDecisionSubmission(new Request(url, { method: 'POST', headers: { origin: 'https://example.invalid' } }), nonce), false);
});