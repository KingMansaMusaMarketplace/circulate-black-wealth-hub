// Readiness reporting is not authorization to process patient data.
export const PILOT_FIELDS = ['clinic_baa_reported', 'vendor_baas_reported', 'attorney_review_reported', 'safeguards_reported', 'doctor_assigned_reported'] as const;
export type PilotChecklist = Record<typeof PILOT_FIELDS[number], boolean>;
export const PILOT_LOCK = {
  status: 'awaiting_verification',
  real_records_allowed: false,
  patient_calls_allowed: false,
  reason: 'Real records require independently verified attorney clearance, signed clinic and vendor agreements, and approved healthcare safeguards in a dedicated environment.',
} as const;
export function pendingPilotRequirements(checklist: PilotChecklist): string[] {
  return PILOT_FIELDS.filter(field => checklist[field] !== true);
}
export function pilotInsert(clinicId: string, authenticatedUserId: string, checklist: PilotChecklist) {
  if (!authenticatedUserId) throw new Error('Authenticated requester required');
  return { clinic_id: clinicId, requested_by: authenticatedUserId,
    ...Object.fromEntries(PILOT_FIELDS.map(field => [field, checklist[field] === true])), status: PILOT_LOCK.status };
}