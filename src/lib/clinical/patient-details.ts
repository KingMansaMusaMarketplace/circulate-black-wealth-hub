// Patient details sheet ("face sheet") rules for the 1325 Clinical pilot.
// Mirrors the hc_pilot_patients_validate trigger so the screen explains problems before saving.
import { containsSsn } from './pilot-records';
import { validatePhotoChoice } from './pilot-photos';

export const DETAIL_FIELDS = [
  { key: 'preferred_name', label: 'Preferred name', max: 80 },
  { key: 'preferred_language', label: 'Preferred language', max: 60 },
  { key: 'phone', label: 'Phone', max: 30 },
  { key: 'primary_doctor', label: 'Primary doctor', max: 120 },
  { key: 'address_line', label: 'Street address', max: 160 },
  { key: 'city', label: 'City', max: 80 },
  { key: 'state_region', label: 'State', max: 60 },
  { key: 'postal_code', label: 'ZIP code', max: 20 },
  { key: 'emergency_contact_name', label: 'Emergency contact', max: 120 },
  { key: 'emergency_contact_relation', label: 'Relationship', max: 60 },
  { key: 'emergency_contact_phone', label: 'Emergency contact phone', max: 30 },
  { key: 'insurance_company', label: 'Insurance company', max: 120 },
  { key: 'insurance_plan', label: 'Insurance plan', max: 120 },
  { key: 'insurance_member_id', label: 'Member ID', max: 60 },
] as const;
export type DetailKey = (typeof DETAIL_FIELDS)[number]['key'];
export type PatientDetails = Partial<Record<DetailKey, string | null>> & { photo_choice?: string | null };

/** Trimmed copy with blanks turned into null, ready to save. */
export function cleanDetails(d: PatientDetails): PatientDetails {
  const out: PatientDetails = {};
  for (const f of DETAIL_FIELDS) { const v = (d[f.key] ?? '').trim(); out[f.key] = v === '' ? null : v; }
  out.photo_choice = d.photo_choice ? d.photo_choice : null;
  return out;
}

export function validatePatientDetails(d: PatientDetails, opts: { real: boolean }): string | null {
  for (const f of DETAIL_FIELDS) {
    const v = (d[f.key] ?? '').trim();
    if (v.length > f.max) return `${f.label} must be ${f.max} characters or fewer.`;
  }
  if (containsSsn(...DETAIL_FIELDS.map((f) => d[f.key]))) return 'Social Security numbers are not allowed.';
  return validatePhotoChoice(d.photo_choice, opts.real);
}

/** One-line address for display, or null when nothing is on file. */
export function formatAddress(d: PatientDetails): string | null {
  const cityLine = [d.city, [d.state_region, d.postal_code].filter(Boolean).join(' ')].filter((s) => s && String(s).trim()).join(', ');
  const parts = [d.address_line, cityLine].filter((s) => s && String(s).trim());
  return parts.length ? parts.join(', ') : null;
}

/** "Name (relationship) · phone", or null. */
export function formatEmergencyContact(d: PatientDetails): string | null {
  if (!d.emergency_contact_name?.trim()) return null;
  return `${d.emergency_contact_name.trim()}${d.emergency_contact_relation?.trim() ? ` (${d.emergency_contact_relation.trim()})` : ''}${d.emergency_contact_phone?.trim() ? ` · ${d.emergency_contact_phone.trim()}` : ''}`;
}
