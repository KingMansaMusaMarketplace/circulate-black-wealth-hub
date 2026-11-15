import { assert, assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { INVITE_ROLES, resendAllowed, staffInviteEmail } from './staff-invite.ts';
import { alertDue, teamAlertEmail } from './team-alert.ts';
import { accessRequestEmail } from './confirmation.ts';

Deno.test('invites can never create an owner', () => {
  assertEquals([...INVITE_ROLES], ['doctor', 'nurse', 'front_desk', 'biller']);
});
Deno.test('invitee email names the inviter and reminds them to check Spam', () => {
  const e = staffInviteEmail({ full_name: 'Pat <Staff>', inviter: 'Dr. Maurice', clinic: 'Sample Clinic', role: 'front_desk', approved: false });
  assert(e.subject.includes('Dr. Maurice'));
  assert(e.text.includes('Front desk'));
  assert(e.text.includes('Spam or Junk'));
  assert(e.html.includes('Pat &lt;Staff&gt;'));
});
Deno.test('a reminder email can only be resent after an hour', () => {
  const now = new Date('2026-11-15T12:00:00Z');
  assertEquals(resendAllowed('2026-11-15T11:30:00Z', now), false);
  assertEquals(resendAllowed('2026-11-15T11:00:00Z', now), true);
  assertEquals(resendAllowed(null, now), true);
});
Deno.test('new-message alerts go out at most once every 30 minutes per person', () => {
  const now = new Date('2026-11-15T12:00:00Z');
  assertEquals(alertDue('2026-11-15T11:45:00Z', now), false);
  assertEquals(alertDue('2026-11-15T11:30:00Z', now), true);
});
Deno.test('message alert email contains no message words, only the clinic name', () => {
  const e = teamAlertEmail('Sample Clinic');
  assert(e.text.includes('Sample Clinic'));
  assert(e.text.includes('only shown inside the app'));
});
Deno.test('Thomas sees staff invites labeled with who invited them', () => {
  const e = accessRequestEmail({ full_name: 'Pat', organization: 'Sample Clinic', role: 'Front desk', work_email: 'p@x.co', phone: 'Not provided', source: 'staff_invite', invited_by: 'Dr. Maurice (m@x.co)' }, { approve: 'a', deny: 'd', revoke: 'r' });
  assert(e.text.includes('Request type: Staff invite'));
  assert(e.text.includes('Invited by: Dr. Maurice'));
  assert(e.html.includes('New staff invite from a clinic'));
});
