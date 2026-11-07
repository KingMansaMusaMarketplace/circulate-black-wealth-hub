import { describe, expect, it } from 'vitest';
import { PILOT_DATA_MODE, containsSsn, validateErrorReason, validatePilotPatient, validatePilotRecord } from '@/lib/clinical/pilot-records';

const today = new Date('2026-11-07T12:00:00');
const patient = { first_name: 'Testy', last_name: 'Example', test_patient_confirmed: true };
const record = { record_type: 'visit_note', recorded_on: '2026-11-07', title: 'Follow-up visit' };

describe('pilot test-patient rules', () => {
  it('stays in test-patients-only mode', () => {
    expect(PILOT_DATA_MODE).toBe('test_patients_only');
  });
  it('refuses a patient not confirmed as a made-up test patient', () => {
    expect(validatePilotPatient({ ...patient, test_patient_confirmed: false }, today)).toMatch(/made-up test patient/);
  });
  it('accepts a confirmed test patient', () => {
    expect(validatePilotPatient(patient, today)).toBeNull();
  });
  it('refuses a future date of birth', () => {
    expect(validatePilotPatient({ ...patient, date_of_birth: '2027-01-01' }, today)).toMatch(/Date of birth/);
  });
  it('refuses Social Security numbers anywhere', () => {
    expect(containsSsn('call 123-45-6789')).toBe(true);
    expect(validatePilotPatient({ ...patient, conditions: ['SSN 123-45-6789'] }, today)).toMatch(/Social Security/);
    expect(validatePilotRecord({ ...record, details: '123-45-6789' }, today)).toMatch(/Social Security/);
  });
  it('refuses impossible vital signs', () => {
    expect(validatePilotRecord({ ...record, record_type: 'vitals', bp_sys: 400 }, today)).toMatch(/Systolic/);
    expect(validatePilotRecord({ ...record, record_type: 'vitals', heart_rate: 10 }, today)).toMatch(/Heart rate/);
  });
  it('requires a medicine name for medicine records', () => {
    expect(validatePilotRecord({ ...record, record_type: 'medication', medication_name: '' }, today)).toMatch(/Medicine name/);
  });
  it('requires a reason to mark a record entered in error', () => {
    expect(validateErrorReason('  ')).not.toBeNull();
    expect(validateErrorReason('wrong patient')).toBeNull();
  });
});
