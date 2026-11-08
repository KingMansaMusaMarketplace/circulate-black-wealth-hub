// Pilot patient portal rules. Mirrors hc_pilot_portal_* in the database:
// test patients only, a tester account sees only the test patient it is linked to,
// and messages are plain text (no attachments) with no automatic medical replies.

export const PORTAL_TEST_NOTICE =
  'Pilot patient portal · made-up test patients only. A tester signs in with their own 1325 account and sees only the test patient they were invited to. Messages are read by the clinic team — never for emergencies.';

export const PATIENT_TOPICS = ['question', 'appointment_request', 'refill_request'] as const;
export type PortalTopic = (typeof PATIENT_TOPICS)[number] | 'reply';
export const TOPIC_LABELS: Record<PortalTopic, string> = {
  question: 'Question for my care team', appointment_request: 'Request an appointment', refill_request: 'Request a refill', reply: 'Reply from the clinic',
};

export const MESSAGE_MAX = 2000;

export function validatePortalMessage(body: string): string | null {
  const b = body.trim();
  if (b.length < 1) return 'Write a message first.';
  if (b.length > MESSAGE_MAX) return `Messages can be up to ${MESSAGE_MAX.toLocaleString()} characters.`;
  if (/\d{3}-\d{2}-\d{4}/.test(b)) return 'Social Security numbers are not allowed.';
  return null;
}

export function validatePortalEmail(email: string): string | null {
  const e = email.trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e) || e.length > 254) return 'Enter a valid email address.';
  return null;
}

type Msg = { sender_kind?: string | null; read_by_clinic_at?: string | null; read_by_patient_at?: string | null };
/** Unread messages for one side: the clinic counts patient messages, the patient counts clinic replies. */
export function unreadFor(side: 'clinic' | 'patient', messages: Msg[]): number {
  return messages.filter((m) => (side === 'clinic'
    ? m.sender_kind === 'patient' && !m.read_by_clinic_at
    : m.sender_kind === 'clinic' && !m.read_by_patient_at)).length;
}
