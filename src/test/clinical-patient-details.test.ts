import { describe, expect, it } from 'vitest';
import { cleanDetails, formatAddress, formatEmergencyContact, validatePatientDetails } from '@/lib/clinical/patient-details';

describe('pilot patient details sheet', () => {
  it('refuses Social Security numbers in any detail field', () => {
    expect(validatePatientDetails({ address_line: '123-45-6789 Main St' }, { real: false })).toBe('Social Security numbers are not allowed.');
    expect(validatePatientDetails({ emergency_contact_phone: '123-45-6789' }, { real: false })).toBe('Social Security numbers are not allowed.');
  });
  it('matches the database length limits', () => {
    expect(validatePatientDetails({ address_line: 'x'.repeat(160) }, { real: false })).toBeNull();
    expect(validatePatientDetails({ address_line: 'x'.repeat(161) }, { real: false })).toBe('Street address must be 160 characters or fewer.');
    expect(validatePatientDetails({ postal_code: '1'.repeat(21) }, { real: false })).toBe('ZIP code must be 20 characters or fewer.');
  });
  it('blocks sample faces on real patients', () => {
    expect(validatePatientDetails({ photo_choice: 'face-02' }, { real: true })).toBe('Real patients cannot be given a sample face.');
    expect(validatePatientDetails({ photo_choice: 'face-02' }, { real: false })).toBeNull();
  });
  it('saves blanks as empty, not as spaces', () => {
    const c = cleanDetails({ city: '   ', preferred_name: ' Ali ', photo_choice: '' });
    expect(c.city).toBeNull();
    expect(c.preferred_name).toBe('Ali');
    expect(c.photo_choice).toBeNull();
  });
  it('formats the address and emergency contact for display', () => {
    expect(formatAddress({ address_line: '101 Sample Street', city: 'Chicago', state_region: 'IL', postal_code: '60600' })).toBe('101 Sample Street, Chicago, IL 60600');
    expect(formatAddress({})).toBeNull();
    expect(formatEmergencyContact({ emergency_contact_name: 'Denise Bell', emergency_contact_relation: 'Wife', emergency_contact_phone: '555-0142' })).toBe('Denise Bell (Wife) · 555-0142');
  });
});
