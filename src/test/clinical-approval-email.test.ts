import { describe, expect, it } from 'vitest';
import { emailWasAccepted } from '../../supabase/functions/health-access/confirmation';
import { clinicalEmailRouting } from '../../supabase/functions/health-access/email-routing';

describe('clinical email routing', () => {
  it('sends clinical emails from Thomas rather than Partner', () => {
    expect(clinicalEmailRouting().from).toBe('"Thomas at 1325.AI" <Thomas@1325.ai>');
  });
  it('routes all clinical replies to Thomas', () => {
    expect(clinicalEmailRouting().reply_to).toBe('Thomas@1325.ai');
    expect(clinicalEmailRouting('visitor@example.com').reply_to).toBe('Thomas@1325.ai');
  });
  it('delivers owner requests to Thomas', () => {
    expect(clinicalEmailRouting().to).toEqual(['Thomas@1325.ai']);
  });
  it('keeps private invitations addressed to the requesting visitor', () => {
    expect(clinicalEmailRouting('visitor@example.com').to).toEqual(['visitor@example.com']);
  });
});

describe('clinical approval email acceptance', () => {
  it('requires an email service message identifier', () => {
    expect(emailWasAccepted({ data: { id: 'message-123' }, error: null })).toBe(true);
    expect(emailWasAccepted({ data: null, error: null })).toBe(false);
  });
  it('does not confirm sending when the email service returns an error', () => {
    expect(emailWasAccepted({ data: { id: 'message-123' }, error: { message: 'Rejected' } })).toBe(false);
  });
});