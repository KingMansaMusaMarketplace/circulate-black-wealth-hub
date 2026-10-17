import { describe, expect, it } from 'vitest';
import { PILOT_FIELDS, PILOT_LOCK, pendingPilotRequirements, pilotInsert, type PilotChecklist } from '../../supabase/functions/health-kayla-review/pilot-policy';
const all = Object.fromEntries(PILOT_FIELDS.map(key => [key, true])) as PilotChecklist;
describe('real-record pilot gates', () => {
  it('does not unlock patient data when a clinic BAA is reported', () => {
    const checklist = { ...all, vendor_baas_reported: false, attorney_review_reported: false, safeguards_reported: false };
    expect(pendingPilotRequirements(checklist)).toEqual(['vendor_baas_reported', 'attorney_review_reported', 'safeguards_reported']);
    expect(pilotInsert('clinic', 'authenticated-user', checklist).status).toBe('awaiting_verification');
    expect(PILOT_LOCK.real_records_allowed).toBe(false);
  });
  it('keeps all self-reported requirements subject to independent verification', () => {
    expect(pendingPilotRequirements(all)).toEqual([]);
    expect(pilotInsert('clinic', 'authenticated-user', all).status).toBe('awaiting_verification');
    expect(PILOT_LOCK.real_records_allowed).toBe(false);
  });
  it('keeps patient calls blocked', () => { expect(PILOT_LOCK.patient_calls_allowed).toBe(false); });
  it('uses validated requester identity and discards extra payload fields', () => {
    const row = pilotInsert('clinic', 'authenticated-user', { ...all, requested_by: 'attacker', status: 'approved', patient_text: 'unwanted' } as PilotChecklist);
    expect(row.requested_by).toBe('authenticated-user'); expect(row.status).toBe('awaiting_verification'); expect(row).not.toHaveProperty('patient_text');
  });
  it('does not support guest readiness requests', () => { expect(() => pilotInsert('clinic', '', all)).toThrow('Authenticated requester required'); });
});