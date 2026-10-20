import { describe, expect, it } from 'vitest';
import { foundingClinicSchema } from '@/pages/health/FoundingClinicSignup';
const ok = { clinic_name: 'Lagos Care', country: 'Nigeria', contact_name: 'Ada O', email: 'ada@clinic.ng', practice_type: 'global_clinic', clinician_count: '4', letter_of_intent: false };
describe('founding clinic signup', () => {
  it('accepts a clinic without a letter of intent (non-binding)', () => { expect(foundingClinicSchema.safeParse(ok).success).toBe(true); });
  it('rejects unknown practice types and zero clinicians', () => {
    expect(foundingClinicSchema.safeParse({ ...ok, practice_type: 'pharmacy' }).success).toBe(false);
    expect(foundingClinicSchema.safeParse({ ...ok, clinician_count: '0' }).success).toBe(false);
  });
});
