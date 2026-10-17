import { describe, expect, it } from 'vitest';
import { intakeAvailability } from '../pages/health/workspace/intake-policy';
import { pilotInsert, PILOT_FIELDS, type PilotChecklist } from '../../supabase/functions/health-kayla-review/pilot-policy';

describe('clinical intake clearance', () => {
  it('keeps signed agreement uploads unavailable without an approved agreement and destination', () => {
    expect(intakeAvailability().agreementUpload).toBe(false);
  });
  it('never enables CME uploads from a clinic readiness submission', () => {
    const checklist = Object.fromEntries(PILOT_FIELDS.map(key => [key, true])) as PilotChecklist;
    expect(pilotInsert('clinic', 'authenticated-requester', checklist).status).toBe('awaiting_verification');
    expect(intakeAvailability().cmeUpload).toBe(false);
  });
  it('keeps patient calls blocked during intake preparation', () => {
    expect(intakeAvailability().patientCalls).toBe(false);
  });
});