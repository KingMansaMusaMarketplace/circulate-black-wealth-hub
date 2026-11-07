import { describe, expect, it } from 'vitest';
import { isVendorCleared, summarizeBaaReadiness } from '@/lib/clinical/vendor-baa';

describe('Vendor BAA tracker rules', () => {
  it('a signed BAA without attorney approval does not clear the vendor', () => {
    expect(isVendorCleared({ baa_category: 'requires_baa', status: 'signed', attorney_approved: false })).toBe(false);
  });

  it('a signed, attorney-approved BAA clears the vendor', () => {
    expect(isVendorCleared({ baa_category: 'requires_baa', status: 'signed', attorney_approved: true })).toBe(true);
  });

  it('a required vendor cannot be cleared by keeping it away from patient data', () => {
    expect(isVendorCleared({ baa_category: 'requires_baa', status: 'kept_away_from_patient_data', attorney_approved: false })).toBe(false);
  });

  it('a non-essential service clears once confirmed kept away from patient data', () => {
    expect(isVendorCleared({ baa_category: 'keep_phi_away', status: 'kept_away_from_patient_data', attorney_approved: false })).toBe(true);
  });

  it('real patient data stays blocked even when every vendor is cleared', () => {
    const r = summarizeBaaReadiness([
      { baa_category: 'requires_baa', status: 'signed', attorney_approved: true },
      { baa_category: 'keep_phi_away', status: 'kept_away_from_patient_data', attorney_approved: false },
    ]);
    expect(r.allVendorsCleared).toBe(true);
    expect(r.realPatientDataAllowed).toBe(false);
  });

  it('counts remaining vendors and declined required vendors', () => {
    const r = summarizeBaaReadiness([
      { baa_category: 'requires_baa', status: 'signed', attorney_approved: true },
      { baa_category: 'requires_baa', status: 'vendor_declined', attorney_approved: false },
      { baa_category: 'requires_baa', status: 'requested', attorney_approved: false },
    ]);
    expect(r.cleared).toBe(1);
    expect(r.remaining).toBe(2);
    expect(r.declinedRequired).toBe(1);
    expect(r.allVendorsCleared).toBe(false);
  });
});
