import { SAMPLE_VISITS } from './sample-visits';

/** Presentation provenance only; never grants access or changes saved records. */
export function registrationSource(row: Record<string, unknown>) {
  const visit = SAMPLE_VISITS.find(item => row.notes === `Source: ${item.id}; fictional transcript only; demographics, allergies, medication reconciliation and current clinical status unknown.`);
  if (!visit || row.is_sample !== true || row.dob != null || row.sex != null || row.mrn != null || row.payer != null || row.risk !== 'Unknown' ||
    !Array.isArray(row.conditions) || row.conditions.length || !Array.isArray(row.allergies) || row.allergies.length) return null;
  return visit.title.endsWith(`— ${row.first_name} ${row.last_name}`) ? visit : null;
}