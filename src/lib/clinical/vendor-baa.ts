// Vendor BAA tracker rules. The tracker records paperwork only; it never
// unlocks real patient data. Real data stays blocked until a separate,
// attorney-approved go-live decision exists outside this tracker.

export type BaaCategory = 'requires_baa' | 'keep_phi_away';
export type BaaStatus =
  | 'not_requested'
  | 'requested'
  | 'draft_received'
  | 'attorney_review'
  | 'signed'
  | 'vendor_declined'
  | 'kept_away_from_patient_data';

export interface VendorBaa {
  id: string;
  vendor_name: string;
  service_used_for: string;
  baa_category: BaaCategory;
  status: BaaStatus;
  vendor_contact: string | null;
  requested_on: string | null;
  signed_on: string | null;
  signed_by: string | null;
  attorney_approved: boolean;
  plan_and_cost: string | null;
  notes: string | null;
  sort_order: number;
  updated_at: string;
}

export const STATUS_LABELS: Record<BaaStatus, string> = {
  not_requested: 'Not requested',
  requested: 'Requested',
  draft_received: 'Agreement received',
  attorney_review: 'With attorney',
  signed: 'Signed',
  vendor_declined: 'Vendor declined',
  kept_away_from_patient_data: 'Kept away from patient data',
};

export const STATUS_OPTIONS: Record<BaaCategory, BaaStatus[]> = {
  requires_baa: ['not_requested', 'requested', 'draft_received', 'attorney_review', 'signed', 'vendor_declined'],
  keep_phi_away: ['not_requested', 'kept_away_from_patient_data', 'requested', 'draft_received', 'attorney_review', 'signed'],
};

/** A vendor is cleared only when its BAA is signed AND the attorney approved it,
 *  or (for non-essential services) it is confirmed kept away from patient data. */
export function isVendorCleared(v: Pick<VendorBaa, 'baa_category' | 'status' | 'attorney_approved'>): boolean {
  if (v.status === 'signed') return v.attorney_approved;
  if (v.baa_category === 'keep_phi_away') return v.status === 'kept_away_from_patient_data';
  return false;
}

export interface BaaReadiness {
  total: number;
  cleared: number;
  remaining: number;
  declinedRequired: number;
  allVendorsCleared: boolean;
  /** Always false: this tracker can never switch on real patient data. */
  realPatientDataAllowed: false;
}

export function summarizeBaaReadiness(rows: Pick<VendorBaa, 'baa_category' | 'status' | 'attorney_approved'>[]): BaaReadiness {
  const cleared = rows.filter(isVendorCleared).length;
  const declinedRequired = rows.filter((r) => r.baa_category === 'requires_baa' && r.status === 'vendor_declined').length;
  return {
    total: rows.length,
    cleared,
    remaining: rows.length - cleared,
    declinedRequired,
    allVendorsCleared: rows.length > 0 && cleared === rows.length,
    realPatientDataAllowed: false,
  };
}
