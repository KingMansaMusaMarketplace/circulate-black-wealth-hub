// Practice billing rules for the pilot. Mirrors hc_pilot_claims_validate.
// Practice claims are NEVER sent to an insurer or clearinghouse, and 1325 never
// suggests codes — the doctor or biller types every code themselves.

export const CLAIM_NOT_SENT_NOTICE =
  'Practice claims only. Nothing here is sent to an insurer or clearinghouse, and 1325 does not suggest codes or visit levels — your doctor or biller enters every code. “Marked sent”, “paid” and “denied” are rehearsal steps you record by hand.';

export const ICD10_PATTERN = /^[A-TV-Z][0-9][0-9A-Z](\.[0-9A-Z]{1,4})?$/;
export const PROCEDURE_PATTERN = /^([0-9]{4}[0-9A-Z]|[A-V][0-9]{4})$/;
export const MODIFIER_PATTERN = /^[0-9A-Z]{2}$/;
export const MAX_DX = 12;
export const MAX_LINES = 12;
export const MAX_CHARGE_CENTS = 10_000_000;

export const CLAIM_STATUSES = ['draft', 'ready', 'practice_submitted', 'practice_paid', 'practice_denied', 'void'] as const;
export type ClaimStatus = (typeof CLAIM_STATUSES)[number];
export const CLAIM_STATUS_LABELS: Record<ClaimStatus, string> = {
  draft: 'Draft', ready: 'Ready to send', practice_submitted: 'Marked sent (practice)', practice_paid: 'Paid (practice)',
  practice_denied: 'Denied (practice)', void: 'Void',
};

export interface ClaimLine { code: string; modifier: string | null; units: number; charge_cents: number; dx_pointers: number[] }
export interface ClaimDraft { payer_name: string; member_id: string | null; diagnosis_codes: string[]; lines: ClaimLine[] }

export const isClosedClaim = (s: string) => s === 'practice_paid' || s === 'void';

/** Allowed next steps (same as the database). */
export function nextClaimSteps(status: string): ClaimStatus[] {
  switch (status) {
    case 'draft': return ['ready', 'void'];
    case 'ready': return ['practice_submitted', 'draft', 'void'];
    case 'practice_submitted': return ['practice_paid', 'practice_denied', 'void'];
    case 'practice_denied': return ['draft', 'void'];
    default: return [];
  }
}

/** "125.5" / "$1,200.00" → cents, or null when not a valid amount. */
export function dollarsToCents(v: string): number | null {
  const s = v.replace(/[$,\s]/g, '');
  if (!/^\d+(\.\d{1,2})?$/.test(s)) return null;
  return Math.round(Number(s) * 100);
}
export const formatCents = (c: number | null | undefined) =>
  `$${(Number(c ?? 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const normalizeDx = (codes: string[]) => codes.map((c) => c.trim().toUpperCase()).filter(Boolean);
export const claimTotalCents = (lines: ClaimLine[]) => lines.reduce((t, l) => t + l.units * l.charge_cents, 0);

export function validateClaimDraft(c: ClaimDraft, opts: { ready?: boolean } = {}): string | null {
  const payer = c.payer_name.trim();
  if (payer.length < 2 || payer.length > 120) return 'Payer name is required (120 characters max).';
  if ((c.member_id ?? '').trim().length > 40) return 'Member ID is too long (40 characters max).';
  if (/\d{3}-\d{2}-\d{4}/.test(`${payer} ${c.member_id ?? ''}`)) return 'Social Security numbers are not allowed.';
  const dx = normalizeDx(c.diagnosis_codes);
  if (dx.length > MAX_DX) return `A claim can list up to ${MAX_DX} diagnosis codes.`;
  if (new Set(dx).size !== dx.length) return 'List each diagnosis code only once.';
  const badDx = dx.find((d) => !ICD10_PATTERN.test(d));
  if (badDx) return `Diagnosis code ${badDx} doesn’t look like an ICD-10 code (for example E11.9).`;
  if (c.lines.length > MAX_LINES) return `A claim can have up to ${MAX_LINES} charge lines.`;
  for (const l of c.lines) {
    const code = l.code.trim().toUpperCase();
    if (!PROCEDURE_PATTERN.test(code)) return `Procedure code ${code || '(blank)'} doesn’t look like a CPT or HCPCS code (for example 99213).`;
    if (l.modifier && !MODIFIER_PATTERN.test(l.modifier.trim().toUpperCase())) return 'Modifiers are 2 letters or numbers (for example 25).';
    if (!Number.isInteger(l.units) || l.units < 1 || l.units > 99) return 'Units must be 1 to 99.';
    if (!Number.isInteger(l.charge_cents) || l.charge_cents < 0 || l.charge_cents > MAX_CHARGE_CENTS) return 'Each charge must be between $0 and $100,000.';
    if (l.dx_pointers.length < 1 || l.dx_pointers.length > 4) return 'Link each charge line to 1 to 4 diagnosis codes.';
    if (l.dx_pointers.some((p) => !Number.isInteger(p) || p < 1 || p > dx.length)) return 'Diagnosis links must point to listed codes.';
  }
  if (opts.ready && (dx.length === 0 || c.lines.length === 0)) return 'Add at least one diagnosis code and one charge line before marking the claim ready.';
  return null;
}

export function validatePaidAmount(paidCents: number | null, totalCents: number): string | null {
  if (paidCents === null || paidCents < 0 || paidCents > totalCents) return 'Paid amount must be between $0 and the claim total.';
  return null;
}

export function validateClaimReason(reason: string, what: 'denial' | 'void'): string | null {
  const r = reason.trim();
  if (r.length < 3) return what === 'denial' ? 'Give the denial reason (at least 3 characters).' : 'Give a reason for voiding (at least 3 characters).';
  if (r.length > 300) return 'Reason is too long (300 characters max).';
  if (/\d{3}-\d{2}-\d{4}/.test(r)) return 'Social Security numbers are not allowed.';
  return null;
}

type ClaimRow = { status: string; total_cents: number | null; paid_cents: number | null };
/** Practice totals for the billing dashboard. Void claims are left out of money totals. */
export function summarizeClaims(claims: ClaimRow[]) {
  const counts = Object.fromEntries(CLAIM_STATUSES.map((s) => [s, 0])) as Record<ClaimStatus, number>;
  let billed = 0; let paid = 0; let waiting = 0; let denied = 0;
  for (const c of claims) {
    if ((CLAIM_STATUSES as readonly string[]).includes(c.status)) counts[c.status as ClaimStatus] += 1;
    if (c.status === 'void') continue;
    const total = Number(c.total_cents ?? 0);
    billed += total;
    if (c.status === 'practice_paid') paid += Number(c.paid_cents ?? 0);
    if (c.status === 'practice_submitted') waiting += total;
    if (c.status === 'practice_denied') denied += total;
  }
  return { counts, billed, paid, waiting, denied };
}
