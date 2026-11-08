import { describe, expect, it } from 'vitest';
import { EMERGENCY_ACCESS_MINUTES, TEAM_ROLES, pilotPermissions, validateEmergencyReason } from '@/lib/clinical/pilot-roles';
import { interactionWarnings, prescriptionWarnings, validatePrescription, validateRxStop } from '@/lib/clinical/prescriptions';
import { nextLabSteps, sortOpenOrders, validateLabOrder } from '@/lib/clinical/lab-orders';
import { egfrCkdEpi2021, egfrFromChart, egfrStage, positiveDomains, validateSocialScreening } from '@/lib/clinical/fairness';

describe('staff roles', () => {
  it('offers doctor, nurse, front desk and biller', () => {
    expect([...TEAM_ROLES]).toEqual(['doctor', 'nurse', 'front_desk', 'biller']);
  });
  it('lets only doctors and owners prescribe, order labs and sign notes', () => {
    for (const r of ['owner', 'doctor']) {
      const p = pilotPermissions(r);
      expect([p.prescribe, p.orderLabs, p.signNotes]).toEqual([true, true, true]);
    }
    const nurse = pilotPermissions('nurse');
    expect([nurse.prescribe, nurse.orderLabs, nurse.signNotes]).toEqual([false, false, false]);
    expect([nurse.readChart, nurse.addRecords, nurse.draftNotes, nurse.collectAndResultLabs]).toEqual([true, true, true, true]);
  });
  it('keeps front desk and billers out of medical records unless they break the glass', () => {
    for (const r of ['front_desk', 'biller']) {
      expect(pilotPermissions(r).readChart).toBe(false);
      expect(pilotPermissions(r).needsEmergencyAccess).toBe(true);
      expect(pilotPermissions(r, true).readChart).toBe(true);
      expect(pilotPermissions(r, true).addRecords).toBe(false);
    }
  });
  it('lets front desk register patients and screen social needs, but not billers', () => {
    expect(pilotPermissions('front_desk').addPatients).toBe(true);
    expect(pilotPermissions('front_desk').screenSocialNeeds).toBe(true);
    expect(pilotPermissions('biller').addPatients).toBe(false);
    expect(pilotPermissions('biller').screenSocialNeeds).toBe(false);
  });
  it('gives non-members nothing', () => {
    expect(Object.values(pilotPermissions(null)).some(Boolean)).toBe(false);
  });
  it('opens emergency access for 30 minutes with a 10-character reason', () => {
    expect(EMERGENCY_ACCESS_MINUTES).toBe(30);
    expect(validateEmergencyReason('short')).not.toBeNull();
    expect(validateEmergencyReason('Patient fainted, need allergies')).toBeNull();
  });
});

describe('practice prescriptions', () => {
  const base = { drug_name: 'Lisinopril', dose: '1 tablet', route: 'by mouth', frequency: 'once a day', quantity: 30, refills: 0, instructions: 'Take 1 tablet daily' };
  it('warns on a direct allergy match', () => {
    expect(prescriptionWarnings('Penicillin VK', ['Penicillin'], [])[0]).toMatch(/allergy to Penicillin/);
  });
  it('warns when a medicine is in an allergy family', () => {
    expect(prescriptionWarnings('Amoxicillin 500 mg', ['Penicillin'], []).some((w) => /penicillin family/.test(w))).toBe(true);
  });
  it('warns on starter interaction pairs', () => {
    expect(interactionWarnings('Ibuprofen', ['Warfarin 5 mg'])[0]).toMatch(/bleeding/);
    expect(interactionWarnings('Alprazolam', ['Oxycodone'])[0]).toMatch(/breathing/);
    expect(interactionWarnings('Sildenafil', ['Nitroglycerin'])[0]).toMatch(/low blood pressure/);
    expect(interactionWarnings('Metformin', ['Lisinopril'])).toEqual([]);
  });
  it('warns on duplicates', () => {
    expect(prescriptionWarnings('Lisinopril 20 mg', [], ['Lisinopril 10 mg'])[0]).toMatch(/Duplicate/);
  });
  it('requires a 10-character override reason when there is a warning', () => {
    expect(validatePrescription(base, ['Allergy'])).toMatch(/safety warning/);
    expect(validatePrescription({ ...base, override_reason: 'Allergist cleared it' }, ['Allergy'])).toBeNull();
  });
  it('limits refills to 0–11 and quantity to 1–1,000', () => {
    expect(validatePrescription({ ...base, refills: 12 }, [])).toMatch(/Refills/);
    expect(validatePrescription({ ...base, quantity: 0 }, [])).toMatch(/Quantity/);
    expect(validatePrescription(base, [])).toBeNull();
  });
  it('needs a stop reason and a date on or after the prescription date', () => {
    const today = new Date('2026-11-08T12:00:00');
    expect(validateRxStop('2026-11-01', '2026-11-05', 'Side effects', today)).toMatch(/Stop date/);
    expect(validateRxStop('2026-11-08', '2026-11-05', 'ok', today)).toMatch(/reason/);
    expect(validateRxStop('2026-11-08', '2026-11-05', 'Side effects', today)).toBeNull();
  });
});

describe('lab orders', () => {
  it('moves ordered → collected → resulted, or cancelled', () => {
    expect(nextLabSteps('ordered')).toEqual(['collected', 'resulted', 'cancelled']);
    expect(nextLabSteps('collected')).toEqual(['resulted', 'cancelled']);
    expect(nextLabSteps('resulted')).toEqual([]);
    expect(nextLabSteps('cancelled')).toEqual([]);
  });
  it('lists STAT before urgent before routine', () => {
    const rows = [
      { id: 'a', status: 'ordered', priority: 'routine', ordered_on: '2026-11-01' },
      { id: 'b', status: 'collected', priority: 'stat', ordered_on: '2026-11-07' },
      { id: 'c', status: 'ordered', priority: 'urgent', ordered_on: '2026-11-02' },
      { id: 'd', status: 'resulted', priority: 'stat', ordered_on: '2026-11-01' },
    ];
    expect(sortOpenOrders(rows).map((r) => r.id)).toEqual(['b', 'c', 'a']);
  });
  it('rejects a bad priority', () => {
    expect(validateLabOrder({ test_name: 'CBC', priority: 'asap' })).toMatch(/Priority/);
  });
});

describe('fairness tools', () => {
  it('uses the race-free 2021 CKD-EPI formula', () => {
    expect(egfrCkdEpi2021(1.0, 50, 'female')).toBe(69);
    expect(egfrCkdEpi2021(1.0, 50, 'male')).toBe(92);
  });
  it('stages kidney function', () => {
    expect(egfrStage(92)).toMatch(/^G1/);
    expect(egfrStage(50)).toMatch(/^G3a/);
    expect(egfrStage(10)).toMatch(/^G5/);
  });
  it('reads the newest creatinine from the chart', () => {
    const recs = [
      { record_type: 'lab_result', status: 'active', title: 'Creatinine', lab_value: '2.0', lab_unit: 'mg/dL', recorded_on: '2026-01-01' },
      { record_type: 'lab_result', status: 'active', title: 'Creatinine', lab_value: '1.0', lab_unit: 'mg/dL', recorded_on: '2026-11-01' },
    ];
    const r = egfrFromChart(recs, '1976-06-01', 'female');
    expect(r.ok && r.egfr).toBe(69);
    expect(egfrFromChart(recs, null, 'female').ok).toBe(false);
  });
  it('flags "yes" answers as social needs and requires all five answers', () => {
    expect(positiveDomains({ housing: 'yes', food: 'no', transportation: 'yes', utilities: 'declined', safety: 'no' })).toEqual(['housing', 'transportation']);
    expect(validateSocialScreening({ housing: 'yes' })).not.toBeNull();
  });
});
