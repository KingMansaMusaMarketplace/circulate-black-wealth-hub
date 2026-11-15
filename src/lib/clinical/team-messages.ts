/**
 * Clinic team invitations and in-app team messages (test patients only).
 * Mirrors hc_create_team_invite / hc_team_messages_validate and health-access staff-invite.ts / team-alert.ts.
 * An invite only files a request to 1325; Thomas still approves every person.
 */
import { containsSsn } from './pilot-records';

export const INVITES_PER_CLINIC_PER_DAY = 10;
export const INVITE_RESEND_MINUTES = 60;
export const MESSAGE_MAX_LENGTH = 1000;
export const MESSAGES_PER_HOUR = 60;
export const ALERT_THROTTLE_MINUTES = 30;
/** How often the bell checks for new messages while the workspace is open. */
export const MESSAGE_POLL_SECONDS = 30;

export function validateTeamMessage(body: string): string | null {
  const text = body.trim();
  if (!text) return 'Type a message first.';
  if (text.length > MESSAGE_MAX_LENGTH) return `Messages must be ${MESSAGE_MAX_LENGTH.toLocaleString()} characters or fewer.`;
  if (containsSsn(text)) return 'Social Security numbers are not allowed.';
  return null;
}

export function validateInvite(input: { full_name: string; email: string }): string | null {
  if (input.full_name.trim().length < 2) return 'Enter their full name.';
  if (input.full_name.trim().length > 120) return 'Name must be 120 characters or fewer.';
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.email.trim())) return 'Enter a valid email address.';
  return null;
}

export type InviteStage = 'waiting' | 'approved' | 'not_approved' | 'joined' | 'cancelled';

/** What the doctor sees for each invite. 1325's decision comes from the linked access request. */
export function inviteStage(status: string, requestStatus: string | null | undefined): InviteStage {
  if (status === 'joined') return 'joined';
  if (status === 'cancelled') return 'cancelled';
  if (requestStatus === 'approved') return 'approved';
  if (requestStatus === 'denied' || requestStatus === 'revoked' || requestStatus === 'expired') return 'not_approved';
  return 'waiting';
}

export const INVITE_STAGE_LABELS: Record<InviteStage, string> = {
  waiting: 'Waiting for 1325 approval',
  approved: 'Approved, not signed in yet',
  not_approved: 'Not approved yet (Resend asks 1325 again)',
  joined: 'Joined',
  cancelled: 'Cancelled',
};

export function inviteErrorMessage(reason?: string, fallback?: string): string {
  switch (reason) {
    case 'already_member': return 'That person is already on your clinic team.';
    case 'exists': return 'That person already has an open invitation. Use Resend below.';
    case 'limit': return `You can send up to ${INVITES_PER_CLINIC_PER_DAY} invitations per day. Please try again tomorrow.`;
    case 'person_limit': return 'That email has had too many requests today. Please try again tomorrow.';
    case 'too_soon': return `A reminder was sent less than ${INVITE_RESEND_MINUTES} minutes ago. Please wait a little.`;
    case 'closed': return 'This invitation is already closed.';
    case 'viewing': return 'Your approved viewing is not active. Reopen your private link and try again.';
    case 'sign_in': return 'Please sign in again.';
    case 'not_owner': return fallback || 'Only the clinic owner can invite team members.';
    default: return fallback || 'The invitation could not be sent. Please try again.';
  }
}
