import { describe, expect, it } from 'vitest';
import {
  buildGoLiveStatus, CONSENT_DRAFT_LABEL, validateRealPatient, validateUnlock,
  type GoLiveUnlock, type GoLiveVendor, type UnlockInput,
} from '@/lib/clinical/go-live';

const signed = (name: string): GoLiveVendor => ({ vendor_name: name, baa_category: 'requires_baa', status: 'signed', attorney_approved: true });
const lovableDeclined: GoLiveVendor = { vendor_name: 'Lovable', baa_category: 'requires_baa', status: 'vendor_declined', attorney_approved: false };
const unlock: GoLiveUnlock = {
  attorney_name: 'Douglas Morrison', attorney_approved_on: '2026-11-01', approval_letter_ref: 'Letter 2026-11-01',
  consent_form_version: 'v1', lovable_ruling: 'Real data hosted outside Lovable reach', risk_assessment_ref: 'RA-1',
  clinic_agreement_signed_on: '2026-11-01', clinic_agreement_ref: 'CA-1', unlocked_at: '2026-11-02T00:00:00Z', unlocked_by_email: null,
};
const form: UnlockInput = { ...unlock };
const today = new Date('2026-11-07T12:00:00');

describe('real-patient unlock switch', () => {
  it('stays locked when the attorney approved but a vendor (Lovable) is not cleared', () => {
    const s = buildGoLiveStatus([signed('Supabase'), lovableDeclined], unlock, true);
    expect(s.realPatientsAllowed).toBe(false);
    expect(s.vendorsBlocked).toEqual(['Lovable']);
  });

  it('stays locked when every vendor is cleared but no attorney unlock is recorded', () => {
    expect(buildGoLiveStatus([signed('Supabase'), signed('OpenAI')], null, true).realPatientsAllowed).toBe(false);
  });

  it('stays locked if the server says locked, even when everything looks done', () => {
    expect(buildGoLiveStatus([signed('Supabase')], unlock, false).realPatientsAllowed).toBe(false);
  });

  it('unlocks only when vendors are cleared, an unlock is recorded and the server agrees', () => {
    const s = buildGoLiveStatus([signed('Supabase'), signed('OpenAI')], unlock, true);
    expect(s.realPatientsAllowed).toBe(true);
    expect(s.doneCount).toBe(6);
  });

  it('a signed vendor agreement without attorney approval does not count', () => {
    const s = buildGoLiveStatus([{ vendor_name: 'OpenAI', baa_category: 'requires_baa', status: 'signed', attorney_approved: false }]);
    expect(s.vendorsCleared).toBe(0);
  });

  it('unlock form is refused while any vendor is not cleared', () => {
    expect(validateUnlock(form, false, today)).toMatch(/Vendor BAA Tracker/);
    expect(validateUnlock(form, true, today)).toBeNull();
  });

  it('unlock form requires a written Lovable ruling and a non-future approval date', () => {
    expect(validateUnlock({ ...form, lovable_ruling: 'ok' }, true, today)).toMatch(/Lovable/);
    expect(validateUnlock({ ...form, attorney_approved_on: '2026-12-01' }, true, today)).toMatch(/future/);
  });

  it('real patients need a birth date and consent date, and reject Social Security numbers', () => {
    const p = { first_name: 'Ada', last_name: 'Lee', date_of_birth: '1980-01-01', consent_signed_on: '2026-11-05' };
    expect(validateRealPatient(p, false, today)).toMatch(/locked/);
    expect(validateRealPatient(p, true, today)).toBeNull();
    expect(validateRealPatient({ ...p, consent_signed_on: '' }, true, today)).toMatch(/consent/);
    expect(validateRealPatient({ ...p, date_of_birth: '' }, true, today)).toMatch(/Date of birth/);
    expect(validateRealPatient({ ...p, insurance_member_id: '123-45-6789' }, true, today)).toMatch(/Social Security/);
  });

  it('the consent outline is labeled as a draft not for signature', () => {
    expect(CONSENT_DRAFT_LABEL).toMatch(/not for signature/i);
  });
});
