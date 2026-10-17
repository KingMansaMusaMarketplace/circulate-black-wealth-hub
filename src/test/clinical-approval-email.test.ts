import { describe, expect, it } from 'vitest';
import { emailWasAccepted } from '../../supabase/functions/health-access/confirmation';

describe('clinical approval email acceptance', () => {
  it('requires an email service message identifier', () => {
    expect(emailWasAccepted({ data: { id: 'message-123' }, error: null })).toBe(true);
    expect(emailWasAccepted({ data: null, error: null })).toBe(false);
  });
  it('does not confirm sending when the email service returns an error', () => {
    expect(emailWasAccepted({ data: { id: 'message-123' }, error: { message: 'Rejected' } })).toBe(false);
  });
});