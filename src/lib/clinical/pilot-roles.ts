// Staff roles for the 1325 Clinical pilot. Mirrors the database helpers
// hc_member_role / hc_has_clinic_role / hc_can_read_chart and the row rules on the
// pilot tables. The database is the real lock; these only shape what the screen shows.

export const TEAM_ROLES = ['doctor', 'nurse', 'front_desk', 'biller'] as const;
export type TeamRole = (typeof TEAM_ROLES)[number];
export type ClinicRole = TeamRole | 'owner';

export const ROLE_LABELS: Record<string, string> = {
  owner: 'Owner (doctor)', doctor: 'Doctor', nurse: 'Nurse', front_desk: 'Front desk', biller: 'Biller',
};
export const roleLabel = (role?: string | null) => (role ? ROLE_LABELS[role] ?? role : 'Unknown');

/** Minutes an emergency "break the glass" opening lasts (database-enforced). */
export const EMERGENCY_ACCESS_MINUTES = 30;

export interface PilotPermissions {
  readChart: boolean;
  addPatients: boolean;
  addRecords: boolean;
  draftNotes: boolean;
  signNotes: boolean;
  prescribe: boolean;
  orderLabs: boolean;
  collectAndResultLabs: boolean;
  cancelLabs: boolean;
  screenSocialNeeds: boolean;
  needsEmergencyAccess: boolean;
  /** Phase 2 */
  bookAppointments: boolean;
  /** Discharge a patient or record a left-against-medical-advice departure (doctors and nurses only). */
  dischargePatients: boolean;
  workClaims: boolean;
  portalTeam: boolean;
  useBoost: boolean;
}

const CLINICAL = new Set(['owner', 'doctor', 'nurse']);
const PRESCRIBERS = new Set(['owner', 'doctor']);

/** What a clinic role can do. `emergency` is an active break-the-glass opening on this chart. */
export function pilotPermissions(role: string | null | undefined, emergency = false): PilotPermissions {
  const r = role ?? '';
  const clinical = CLINICAL.has(r);
  const prescriber = PRESCRIBERS.has(r);
  const member = clinical || r === 'front_desk' || r === 'biller';
  return {
    readChart: clinical || (member && emergency),
    addPatients: clinical || r === 'front_desk',
    addRecords: clinical,
    draftNotes: clinical,
    signNotes: prescriber,
    prescribe: prescriber,
    orderLabs: prescriber,
    collectAndResultLabs: clinical,
    cancelLabs: prescriber,
    screenSocialNeeds: clinical || r === 'front_desk',
    needsEmergencyAccess: member && !clinical,
    bookAppointments: clinical || r === 'front_desk',
    dischargePatients: clinical,
    workClaims: prescriber || r === 'biller',
    portalTeam: clinical || r === 'front_desk',
    useBoost: clinical,
  };
}

export function validateEmergencyReason(reason: string): string | null {
  const r = reason.trim();
  if (r.length < 10 || r.length > 300) return 'Explain the emergency in 10 to 300 characters.';
  if (/\d{3}-\d{2}-\d{4}/.test(r)) return 'Social Security numbers are not allowed.';
  return null;
}
