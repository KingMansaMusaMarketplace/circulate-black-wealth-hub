import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { validDecisionSubmission } from './decision-confirmation.ts';
const nonce = 'a'.repeat(48);
Deno.test('email GET and cross-origin submissions never authorize a decision', () => {
  assertEquals(validDecisionSubmission(new Request('https://example.invalid'), nonce), false);
  assertEquals(validDecisionSubmission(new Request('https://example.invalid', { method: 'POST', headers: { origin: 'https://attacker.invalid', cookie: `hc_decision_nonce=${nonce}` } }), nonce), false);
});
Deno.test('deliberate same-origin confirmation requires matching cookie nonce', () => {
  const req = new Request('https://example.invalid', { method: 'POST', headers: { origin: 'https://example.invalid', cookie: `hc_decision_nonce=${nonce}` } });
  assertEquals(validDecisionSubmission(req, nonce), true);
  assertEquals(validDecisionSubmission(req, 'b'.repeat(48)), false);
});