import { PILOT_LOCK } from '../../../../supabase/functions/health-kayla-review/pilot-policy';

/** No approval authority or approved healthcare destination exists in this environment. */
export function intakeAvailability() {
  return { agreementUpload: false, cmeUpload: PILOT_LOCK.real_records_allowed, patientCalls: PILOT_LOCK.patient_calls_allowed } as const;
}