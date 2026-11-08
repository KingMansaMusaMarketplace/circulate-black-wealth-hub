// Lab orders for the 1325 Clinical pilot. Orders are never sent to a real lab;
// results are typed in by the care team. Mirrors hc_pilot_lab_orders_validate.

export const LAB_PRIORITIES = ['routine', 'urgent', 'stat'] as const;
export type LabPriority = (typeof LAB_PRIORITIES)[number];
export const LAB_PRIORITY_LABELS: Record<LabPriority, string> = { routine: 'Routine', urgent: 'Urgent', stat: 'STAT (right away)' };

export const LAB_ORDER_STATUSES = ['ordered', 'collected', 'resulted', 'cancelled'] as const;
export type LabOrderStatus = (typeof LAB_ORDER_STATUSES)[number];
export const LAB_ORDER_STATUS_LABELS: Record<LabOrderStatus, string> = {
  ordered: 'Waiting for sample', collected: 'Sample collected', resulted: 'Result in', cancelled: 'Cancelled',
};

/** Common tests offered as quick picks; any test name can be typed. */
export const COMMON_LAB_TESTS = [
  'Complete blood count (CBC)', 'Basic metabolic panel (BMP)', 'Comprehensive metabolic panel (CMP)', 'Creatinine',
  'Hemoglobin A1c', 'Lipid panel', 'TSH (thyroid)', 'Urinalysis', 'Vitamin D', 'PSA',
];

export const LAB_NOT_SENT_NOTICE = 'Practice lab order — not sent to Quest, LabCorp or any lab. Type the result in when you have it.';

const SSN = /\d{3}-\d{2}-\d{4}/;

export function validateLabOrder(o: { test_name: string; priority: string; reason?: string | null }): string | null {
  const t = o.test_name.trim();
  if (t.length < 2 || t.length > 140) return 'Test name is required (140 characters max).';
  if (!(LAB_PRIORITIES as readonly string[]).includes(o.priority)) return 'Priority must be routine, urgent or STAT.';
  if ((o.reason ?? '').trim().length > 300) return 'Reason is too long (300 characters max).';
  if (SSN.test(`${t} ${o.reason ?? ''}`)) return 'Social Security numbers are not allowed.';
  return null;
}

/** Allowed next steps from a status (database-enforced). */
export function nextLabSteps(status: string): LabOrderStatus[] {
  if (status === 'ordered') return ['collected', 'resulted', 'cancelled'];
  if (status === 'collected') return ['resulted', 'cancelled'];
  return [];
}

export const isOpenLabOrder = (status: string) => status === 'ordered' || status === 'collected';

/** Open orders, urgent first, then oldest first. */
export function sortOpenOrders<T extends { status: string; priority: string; ordered_on: string }>(orders: T[]): T[] {
  const rank: Record<string, number> = { stat: 0, urgent: 1, routine: 2 };
  return orders.filter((o) => isOpenLabOrder(o.status))
    .sort((a, b) => (rank[a.priority] ?? 3) - (rank[b.priority] ?? 3) || a.ordered_on.localeCompare(b.ordered_on));
}
