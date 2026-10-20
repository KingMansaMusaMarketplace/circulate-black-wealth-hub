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
import { foundingCsv } from '@/components/admin/FoundingClinicsList';
describe('founding clinic spreadsheet', () => {
  it('marks letters of intent and neutralizes formula text', () => {
    const csv = foundingCsv([{ id: '1', clinic_name: '=HACK()', country: 'UK', contact_name: 'A', email: 'a@b.co', practice_type: 'global_clinic', clinician_count: 3, letter_of_intent: true, created_at: '2026-10-20T00:00:00Z' }]);
    expect(csv).toContain(`"'=HACK()"`);
    expect(csv.split('\n')[1].endsWith('"Yes"')).toBe(true);
  });
});
