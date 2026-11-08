// Outside approvals tracker (certifications, network contracts, audits).
// Paperwork only: nothing on this tracker turns on e-prescribing, lab or record
// exchange, claim sending or real patient data — each needs its own contract,
// testing and the attorney-approved go-live step.

export type MilestoneStatus = 'not_started' | 'researching' | 'applied' | 'in_progress' | 'passed' | 'blocked' | 'not_needed_yet';
export const MILESTONE_STATUSES: MilestoneStatus[] = ['not_started', 'researching', 'applied', 'in_progress', 'passed', 'blocked', 'not_needed_yet'];
export const MILESTONE_STATUS_LABELS: Record<MilestoneStatus, string> = {
  not_started: 'Not started', researching: 'Researching', applied: 'Applied / contacted', in_progress: 'In progress',
  passed: 'Passed / signed', blocked: 'Blocked', not_needed_yet: 'Not needed yet',
};

export type MilestoneArea = 'certification' | 'e_prescribing' | 'labs' | 'exchange' | 'billing' | 'security' | 'international';
export const AREA_LABELS: Record<MilestoneArea, string> = {
  certification: 'U.S. EHR certification', e_prescribing: 'E-prescribing', labs: 'Lab connections', exchange: 'Record exchange',
  billing: 'Claims & payments', security: 'Security audits', international: 'International',
};

export interface Milestone {
  id: string; item_key: string; title: string; area: MilestoneArea; why_it_matters: string; who_issues: string | null; status: MilestoneStatus;
  owner_name: string | null; next_step: string | null; target_date: string | null; estimated_cost: string | null; notes: string | null; sort_order: number; updated_at: string;
}

/** "Passed" counts as done; "not needed yet" is left out of the total. */
export function summarizeMilestones(rows: Pick<Milestone, 'status' | 'target_date'>[], today = new Date()) {
  const counted = rows.filter((r) => r.status !== 'not_needed_yet');
  const done = counted.filter((r) => r.status === 'passed').length;
  const blocked = counted.filter((r) => r.status === 'blocked').length;
  const iso = today.toISOString().slice(0, 10);
  const overdue = counted.filter((r) => r.status !== 'passed' && r.target_date && r.target_date < iso).length;
  return { total: counted.length, done, blocked, overdue, active: counted.length - done };
}

export function validateMilestoneEdit(m: { owner_name: string; next_step: string; estimated_cost: string; notes: string }): string | null {
  if (m.owner_name.length > 120) return 'Owner name is too long (120 characters max).';
  if (m.next_step.length > 500) return 'Next step is too long (500 characters max).';
  if (m.estimated_cost.length > 120) return 'Cost note is too long (120 characters max).';
  if (m.notes.length > 2000) return 'Notes are too long (2,000 characters max).';
  return null;
}
