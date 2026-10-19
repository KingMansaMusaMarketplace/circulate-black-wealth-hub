import { assertEquals, assertStringIncludes } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { sendClinicalApproval } from './approval-email.ts';
import { validateCsrf } from '../_shared/csrf-guard.ts';
Deno.test('clinical invitations route to the visitor and reply to Thomas', async () => {
  const ok = await sendClinicalApproval(async message => {
    assertEquals(message.to, ['visitor@example.invalid']);
    assertStringIncludes(message.from, '<Thomas@1325.ai>');
    assertEquals(message.reply_to, 'Thomas@1325.ai');
    assertStringIncludes(message.text, 'one twenty-minute viewing');
    assertStringIncludes(message.html, '&lt;Test&gt;');
    return { data: { id: 'fictional-message' }, error: null };
  }, { full_name: '<Test>', work_email: 'visitor@example.invalid' }, 'a'.repeat(48), new Date('2026-10-26T03:00:00Z'));
  assertEquals(ok, true);
});
Deno.test('no provider ID means invitation sending is not confirmed', async () => {
  assertEquals(await sendClinicalApproval(async () => ({ data: null, error: { message: 'failed' } }), { full_name: 'Test', work_email: 'visitor@example.invalid' }, 'a'.repeat(48), new Date()), false);
});
Deno.test('admin mutation requires a well-formed custom request header', () => {
  assertEquals(validateCsrf(new Request('https://example.invalid', { method: 'POST' })).valid, false);
  assertEquals(validateCsrf(new Request('https://example.invalid', { method: 'POST', headers: { 'x-csrf-token': 'invalid' } })).valid, false);
  assertEquals(validateCsrf(new Request('https://example.invalid', { method: 'POST', headers: { 'x-csrf-token': 'a'.repeat(64) } })).valid, true);
});