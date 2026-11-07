// Real-patient go-live rules for the 1325 Clinical pilot.
// The database is the real lock (hc_real_patients_allowed): real patients can be
// saved only while an administrator-recorded unlock is active AND every vendor on
// the Vendor BAA Tracker is cleared. These helpers mirror those rules so the
// screen can explain them; the browser never decides by itself.

import { containsSsn } from './pilot-records';
import { isVendorCleared, summarizeBaaReadiness, type BaaCategory, type BaaStatus } from './vendor-baa';

export interface GoLiveVendor {
  vendor_name: string;
  baa_category: BaaCategory;
  status: BaaStatus;
  attorney_approved: boolean;
}

export interface GoLiveUnlock {
  attorney_name: string;
  attorney_approved_on: string;
  approval_letter_ref: string;
  consent_form_version: string;
  lovable_ruling: string;
  risk_assessment_ref: string;
  clinic_agreement_signed_on: string;
  clinic_agreement_ref: string;
  unlocked_at: string;
  unlocked_by_email: string | null;
}

export interface GoLiveServerStatus {
  real_patients_allowed: boolean;
  vendors_cleared: boolean;
  can_unlock: boolean;
  can_lock: boolean;
  active_unlock: GoLiveUnlock | null;
  vendors: GoLiveVendor[];
}

export interface GoLiveItem { key: string; title: string; detail: string; done: boolean }

export interface GoLiveStatus {
  items: GoLiveItem[];
  doneCount: number;
  vendorsCleared: number;
  vendorsTotal: number;
  vendorsBlocked: string[];
  allVendorsCleared: boolean;
  /** Real patients may be saved only if the server says so AND the vendors are cleared. */
  realPatientsAllowed: boolean;
}

export function buildGoLiveStatus(vendors: GoLiveVendor[], unlock: GoLiveUnlock | null = null, serverAllowed = false): GoLiveStatus {
  const summary = summarizeBaaReadiness(vendors);
  const vendorsBlocked = vendors.filter((v) => !isVendorCleared(v)).map((v) => v.vendor_name);
  const has = !!unlock;
  const items: GoLiveItem[] = [
    { key: 'vendor_agreements', title: 'Every outside company cleared',
      detail: `${summary.cleared} of ${summary.total} outside companies have a signed, attorney-approved agreement or are confirmed to stay away from patient data.`,
      done: summary.allVendorsCleared },
    { key: 'protected_home', title: 'Attorney ruling on Lovable',
      detail: 'Lovable does not sign BAAs. The attorney must rule in writing how real patient data is kept away from it, and the tracker must show Lovable as cleared.',
      done: has && !vendorsBlocked.includes('Lovable') },
    { key: 'patient_consent', title: 'Attorney-approved patient consent form', detail: 'The approved version of the consent form every patient signs.', done: has },
    { key: 'security_review', title: 'Security risk assessment', detail: 'A completed HIPAA security risk assessment.', done: has },
    { key: 'clinic_agreement', title: 'Signed clinic agreement', detail: 'The signed agreement between this clinic and 1325.AI.', done: has },
    { key: 'attorney_go_live', title: 'Attorney written go-live approval', detail: 'Your healthcare attorney confirms in writing that real patients may be entered.', done: has },
  ];
  return {
    items,
    doneCount: items.filter((i) => i.done).length,
    vendorsCleared: summary.cleared,
    vendorsTotal: summary.total,
    vendorsBlocked,
    allVendorsCleared: summary.allVendorsCleared,
    realPatientsAllowed: serverAllowed && summary.allVendorsCleared && has,
  };
}

export interface UnlockInput {
  attorney_name: string;
  attorney_approved_on: string;
  approval_letter_ref: string;
  consent_form_version: string;
  lovable_ruling: string;
  risk_assessment_ref: string;
  clinic_agreement_signed_on: string;
  clinic_agreement_ref: string;
}

const isPastDate = (iso: string, today: Date) => {
  const d = new Date(`${iso}T00:00:00`);
  return !Number.isNaN(d.getTime()) && d <= today && d >= new Date('2026-01-01T00:00:00');
};

export function validateUnlock(u: UnlockInput, vendorsCleared: boolean, today = new Date()): string | null {
  if (!vendorsCleared) return 'Every outside company on the Vendor BAA Tracker must be cleared first.';
  if (u.attorney_name.trim().length < 3) return 'Enter the attorney\u2019s full name.';
  if (!isPastDate(u.attorney_approved_on, today)) return 'Attorney approval date must be a real date, not in the future.';
  if (u.approval_letter_ref.trim().length < 3) return 'Enter a reference to the signed go-live letter.';
  if (u.consent_form_version.trim().length < 2) return 'Enter the approved consent form version.';
  if (u.lovable_ruling.trim().length < 10) return 'Enter the attorney\u2019s written ruling on Lovable.';
  if (u.risk_assessment_ref.trim().length < 3) return 'Enter a reference to the security risk assessment.';
  if (!isPastDate(u.clinic_agreement_signed_on, today)) return 'Clinic agreement date must be a real date, not in the future.';
  if (u.clinic_agreement_ref.trim().length < 3) return 'Enter a reference to the signed clinic agreement.';
  return null;
}

export interface RealPatientInput {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone?: string | null;
  consent_signed_on: string;
  insurance_company?: string | null;
  insurance_plan?: string | null;
  insurance_member_id?: string | null;
  insurance_group?: string | null;
  policy_holder?: string | null;
}

export function validateRealPatient(p: RealPatientInput, allowed: boolean, today = new Date()): string | null {
  if (!allowed) return 'Real patients are locked for this clinic.';
  if (!p.first_name.trim() || !p.last_name.trim()) return 'Legal first and last name are required.';
  if (p.first_name.trim().length > 80 || p.last_name.trim().length > 80) return 'Names must be 80 characters or fewer.';
  const dob = new Date(`${p.date_of_birth}T00:00:00`);
  if (!p.date_of_birth || Number.isNaN(dob.getTime()) || dob > today || dob < new Date('1900-01-01T00:00:00')) return 'Date of birth is required and must be between 1900 and today.';
  if (!p.consent_signed_on || !isPastDate(p.consent_signed_on, today)) return 'Enter the date the patient signed the approved consent form.';
  if (p.phone && p.phone.length > 30) return 'Phone number is too long.';
  if (containsSsn(p.first_name, p.last_name, p.phone, p.insurance_company, p.insurance_plan, p.insurance_member_id, p.insurance_group, p.policy_holder)) return 'Social Security numbers are not allowed.';
  return null;
}

/** Real-patient form layout. */
export const REAL_PATIENT_FIELDS: { section: string; fields: { key: keyof RealPatientInput; label: string; type?: string; required?: boolean; max: number }[] }[] = [
  { section: 'Patient', fields: [
    { key: 'first_name', label: 'Legal first name', required: true, max: 80 },
    { key: 'last_name', label: 'Legal last name', required: true, max: 80 },
    { key: 'date_of_birth', label: 'Date of birth', type: 'date', required: true, max: 10 },
    { key: 'phone', label: 'Phone', max: 30 },
  ] },
  { section: 'Insurance', fields: [
    { key: 'insurance_company', label: 'Insurance company', max: 120 },
    { key: 'insurance_plan', label: 'Plan name', max: 120 },
    { key: 'insurance_member_id', label: 'Member ID', max: 60 },
    { key: 'insurance_group', label: 'Group number', max: 60 },
    { key: 'policy_holder', label: 'Policy holder (if not the patient)', max: 120 },
  ] },
  { section: 'Consent', fields: [
    { key: 'consent_signed_on', label: 'Date patient signed the approved consent form', type: 'date', required: true, max: 10 },
  ] },
];

export const CONSENT_DRAFT_LABEL = 'DRAFT for attorney review. Not for signature.';

/** Plain-language outline for the attorney to start from. Not a legal document. */
export const CONSENT_DRAFT_SECTIONS: { title: string; body: string }[] = [
  { title: '1. What 1325 Clinical is', body: 'Software your clinic uses to keep your chart, write visit notes and prepare insurance paperwork. Your doctor makes every medical decision.' },
  { title: '2. What information is kept', body: 'Your name, date of birth, contact details, insurance details, visit notes, medicines, allergies, vital signs and test results.' },
  { title: '3. Who can see it', body: 'Only staff at your clinic who are caring for you, plus outside companies that have signed agreements to protect health information. Every time your chart is opened, it is logged.' },
  { title: '4. AI help', body: 'The clinic may use AI to turn spoken notes into text or to draft summaries. A licensed clinician reviews every word before it is signed.' },
  { title: '5. Your rights', body: 'You may ask for a copy of your record, ask for corrections, ask who has viewed it, and withdraw this consent for future AI use. [Attorney to complete under HIPAA and state law.]' },
  { title: '6. Signature', body: '[Attorney to supply signature, date, and guardian or representative wording.] Patients sign the attorney-approved paper or e-signature version; the clinic records the signing date here.' },
];
