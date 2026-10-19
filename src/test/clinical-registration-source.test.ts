import { describe, expect, it } from 'vitest';
import { registrationSource } from '@/pages/health/workspace/registration-source';
import { SAMPLE_VISITS } from '@/pages/health/workspace/sample-visits';

const row = (id: string, first: string, last: string) => ({ notes: `Source: ${id}; fictional transcript only; demographics, allergies, medication reconciliation and current clinical status unknown.`, first_name: first, last_name: last, is_sample: true, dob: null, sex: null, mrn: null, payer: null, conditions: [], allergies: [], risk: 'Unknown' });
describe('source-grounded clinic identities', () => {
  it('links only Avery, Sam and Riley to their actual immutable transcript', () => {
    expect(registrationSource(row('visit-back-pain-v1', 'Avery', 'Example'))).toEqual(SAMPLE_VISITS[0]);
    expect(registrationSource(row('visit-blood-pressure-v1', 'Sam', 'Placeholder'))).toEqual(SAMPLE_VISITS[1]);
    expect(registrationSource(row('visit-knee-v1', 'Riley', 'Demo'))).toEqual(SAMPLE_VISITS[2]);
  });
  it('does not treat legacy or invented clinical facts as source-grounded registration', () => {
    expect(registrationSource({ first_name: 'Avery', last_name: 'Example', risk: 'High', notes: null })).toBeNull();
    const clean = row('visit-back-pain-v1', 'Avery', 'Example');
    expect(registrationSource({ ...clean, dob: '1959-08-02' })).toBeNull();
    expect(registrationSource({ ...clean, allergies: ['None known'] })).toBeNull();
    expect(registrationSource({ ...clean, first_name: 'Jordan' })).toBeNull();
  });
});