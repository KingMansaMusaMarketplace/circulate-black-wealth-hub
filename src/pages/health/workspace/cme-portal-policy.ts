import { intakeAvailability } from './intake-policy';

export type CmeStatus = 'awaiting_review' | 'revision_requested' | 'reviewed' | 'source_links_missing';
export type CmeDecision = { decision: string; created_at: string };

export function cmePortalAccess(clinicId?: string, clinicRole?: string) {
  const clinicMember = Boolean(clinicId && clinicRole && ['owner', 'doctor', 'staff'].includes(clinicRole));
  return {
    clinicMember,
    uploadsAllowed: clinicMember && intakeAvailability().cmeUpload,
    canReview: clinicMember && (clinicRole === 'doctor' || clinicRole === 'owner'),
  };
}

/** AI completion never counts as a doctor's decision. */
export function cmeCaseStatus(hasVerifiedSources: boolean, decisions: CmeDecision[]): CmeStatus {
  if (!hasVerifiedSources) return 'source_links_missing';
  const latest = [...decisions].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))[0];
  if (latest?.decision === 'accepted') return 'reviewed';
  if (latest?.decision === 'revision_requested') return 'revision_requested';
  return 'awaiting_review';
}