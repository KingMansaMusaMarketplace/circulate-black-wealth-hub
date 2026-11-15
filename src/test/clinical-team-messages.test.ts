import { describe, expect, it } from 'vitest';
import { INVITES_PER_CLINIC_PER_DAY, MESSAGE_MAX_LENGTH, inviteErrorMessage, inviteStage, validateInvite, validateTeamMessage } from '@/lib/clinical/team-messages';

describe('clinic team invitations', () => {
  it('allows 10 invitations per clinic per day', () => {
    expect(INVITES_PER_CLINIC_PER_DAY).toBe(10);
    expect(inviteErrorMessage('limit')).toContain('10 invitations');
  });
  it('shows 1325 approval status for each invite', () => {
    expect(inviteStage('requested', 'pending')).toBe('waiting');
    expect(inviteStage('requested', 'approved')).toBe('approved');
    expect(inviteStage('requested', 'denied')).toBe('not_approved');
    expect(inviteStage('requested', 'expired')).toBe('not_approved');
    expect(inviteStage('joined', 'expired')).toBe('joined');
    expect(inviteStage('cancelled', 'approved')).toBe('cancelled');
  });
  it('requires a name and a real email', () => {
    expect(validateInvite({ full_name: 'P', email: 'p@x.co' })).toBe('Enter their full name.');
    expect(validateInvite({ full_name: 'Pat Staff', email: 'not-an-email' })).toBe('Enter a valid email address.');
    expect(validateInvite({ full_name: 'Pat Staff', email: 'pat@clinic.co' })).toBeNull();
  });
});

describe('clinic team messages', () => {
  it('refuses Social Security numbers', () => {
    expect(validateTeamMessage('Patient SSN 123-45-6789')).toBe('Social Security numbers are not allowed.');
  });
  it('limits messages to 1,000 characters', () => {
    expect(MESSAGE_MAX_LENGTH).toBe(1000);
    expect(validateTeamMessage('x'.repeat(1000))).toBeNull();
    expect(validateTeamMessage('x'.repeat(1001))).toContain('1,000');
  });
  it('refuses empty messages', () => {
    expect(validateTeamMessage('   ')).toBe('Type a message first.');
  });
});
