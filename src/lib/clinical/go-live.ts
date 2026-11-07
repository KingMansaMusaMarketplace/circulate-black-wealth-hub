// Real-patient go-live rules for the 1325 Clinical pilot.
// This module only DESCRIBES what go-live will need. It can never switch on
// real patient data: the database still refuses any patient who is not
// confirmed as made-up, and this hosting setup (Lovable does not sign BAAs)
// is not where real patients will live.

import { isVendorCleared, summarizeBaaReadiness, type BaaCategory, type BaaStatus } from './vendor-baa';

export interface GoLiveVendor {
  vendor_name: string;
  baa_category: BaaCategory;
  status: BaaStatus;
  attorney_approved: boolean;
}

export interface GoLiveItem {
  key: string;
  title: string;
  detail: string;
  done: boolean;
}

export interface GoLiveStatus {
  items: GoLiveItem[];
  doneCount: number;
  vendorsCleared: number;
  vendorsTotal: number;
  vendorsBlocked: string[];
  /** Always false in this setup. */
  realPatientsAllowed: false;
}

/** Steps that are recorded outside this app (attorney letters, signed clinic
 *  agreement, independent security review, protected hosting). They are never
 *  marked done from a browser. */
const OFFLINE_STEPS: Omit<GoLiveItem, 'done'>[] = [
  { key: 'clinic_agreement', title: 'Signed clinic agreement', detail: 'An attorney-approved agreement between each clinic and 1325.AI (a Business Associate Agreement, or BAA).' },
  { key: 'patient_consent', title: 'Attorney-approved patient consent form', detail: 'The draft below must be reviewed and approved by your healthcare attorney before any patient signs it.' },
  { key: 'security_review', title: 'Independent security review', detail: 'A HIPAA risk assessment and security review by an outside firm.' },
  { key: 'protected_home', title: 'Protected home for real patient data', detail: 'Real patients must live on services that have all signed BAAs. Lovable does not sign BAAs, so real records cannot be entered through this setup.' },
  { key: 'attorney_go_live', title: 'Attorney written go-live approval', detail: 'Your healthcare attorney confirms in writing that real patients may be entered.' },
];

export function buildGoLiveStatus(vendors: GoLiveVendor[]): GoLiveStatus {
  const summary = summarizeBaaReadiness(vendors);
  const vendorsBlocked = vendors.filter((v) => !isVendorCleared(v)).map((v) => v.vendor_name);
  const items: GoLiveItem[] = [
    {
      key: 'vendor_agreements',
      title: 'Every outside company cleared',
      detail: `${summary.cleared} of ${summary.total} outside companies have a signed, attorney-approved agreement or are confirmed to stay away from patient data.`,
      done: summary.allVendorsCleared,
    },
    ...OFFLINE_STEPS.map((s) => ({ ...s, done: false })),
  ];
  return {
    items,
    doneCount: items.filter((i) => i.done).length,
    vendorsCleared: summary.cleared,
    vendorsTotal: summary.total,
    vendorsBlocked,
    realPatientsAllowed: false,
  };
}

/** Fields the real-patient setup form will collect after go-live. Shown locked. */
export const REAL_PATIENT_FIELDS: { section: string; fields: { label: string; type?: string; placeholder: string }[] }[] = [
  { section: 'Patient', fields: [
    { label: 'Legal first name', placeholder: 'Locked until go-live' },
    { label: 'Legal last name', placeholder: 'Locked until go-live' },
    { label: 'Date of birth', type: 'date', placeholder: '' },
    { label: 'Phone', placeholder: 'Locked until go-live' },
  ] },
  { section: 'Insurance', fields: [
    { label: 'Insurance company', placeholder: 'Locked until go-live' },
    { label: 'Plan name', placeholder: 'Locked until go-live' },
    { label: 'Member ID', placeholder: 'Locked until go-live' },
    { label: 'Group number', placeholder: 'Locked until go-live' },
    { label: 'Policy holder (if not the patient)', placeholder: 'Locked until go-live' },
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
  { title: '6. Signature', body: '[Attorney to supply signature, date, and guardian or representative wording.] Signing is turned off until the attorney approves this form.' },
];
