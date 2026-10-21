// Fixed fictional billing rehearsal. Nothing here is sent, saved or approved.
// Codes are illustrative examples for demonstration and always require certified coder review.

export type SimCode = { system: 'ICD-10-CM' | 'ICD-11' | 'CPT'; code: string | null; label: string; sourceLine: number; fee?: number };

export type BillingSimulation = {
  visitId: string;
  patient: string;
  payer: string;
  memberId: string;
  eligibility: { status: 'Active (simulated)'; copay: number; deductibleRemaining: number };
  codes: SimCode[];
  mips: { measure: string; result: 'Met' | 'Not met' | 'Not applicable'; note: string };
};

export const SIM_WATERMARK = 'Fictional simulation · Sample data only · Not submitted to any payer';

export const BILLING_SIMULATIONS: Record<string, BillingSimulation> = {
  'visit-back-pain-v1': {
    visitId: 'visit-back-pain-v1', patient: 'Avery Example', payer: 'Sample Health Plan (fictional)', memberId: 'SIM-000-1001',
    eligibility: { status: 'Active (simulated)', copay: 25, deductibleRemaining: 350 },
    codes: [
      { system: 'ICD-10-CM', code: 'M54.50', label: 'Low back pain, unspecified', sourceLine: 7 },
      { system: 'ICD-11', code: 'ME84.2', label: 'Low back pain', sourceLine: 7 },
      { system: 'CPT', code: '99213', label: 'Established patient visit, low complexity', sourceLine: 1, fee: 135 },
    ],
    mips: { measure: 'Quality tracking example', result: 'Not applicable', note: 'No sample quality measure applies to this visit.' },
  },
  'visit-blood-pressure-v1': {
    visitId: 'visit-blood-pressure-v1', patient: 'Sam Placeholder', payer: 'Sample Medicare Plan (fictional)', memberId: 'SIM-000-1002',
    eligibility: { status: 'Active (simulated)', copay: 25, deductibleRemaining: 350 },
    codes: [
      { system: 'ICD-10-CM', code: 'I10', label: 'Essential (primary) hypertension', sourceLine: 6 },
      { system: 'ICD-11', code: 'BA00', label: 'Essential hypertension', sourceLine: 6 },
      { system: 'CPT', code: '99214', label: 'Established patient visit, moderate complexity', sourceLine: 7, fee: 185 },
    ],
    mips: { measure: 'Quality #236 · Controlling high blood pressure', result: 'Not met', note: 'Sample reading 142/90 is not below 140/90, so the measure is not met for this visit.' },
  },
  'visit-knee-v1': {
    visitId: 'visit-knee-v1', patient: 'Riley Demo', payer: 'Sample Health Plan (fictional)', memberId: 'SIM-000-1003',
    eligibility: { status: 'Active (simulated)', copay: 25, deductibleRemaining: 350 },
    codes: [
      { system: 'ICD-10-CM', code: 'M25.561', label: 'Pain in right knee', sourceLine: 4 },
      { system: 'ICD-11', code: null, label: 'Mapping needs certified coder review', sourceLine: 4 },
      { system: 'CPT', code: '99213', label: 'Established patient visit, low complexity', sourceLine: 1, fee: 135 },
      { system: 'CPT', code: '73721', label: 'MRI right knee, without contrast (ordered)', sourceLine: 8, fee: 0 },
    ],
    mips: { measure: 'Quality tracking example', result: 'Not applicable', note: 'No sample quality measure applies to this visit.' },
  },
};

export function billingSimulation(visitId: string) {
  const sim = BILLING_SIMULATIONS[visitId];
  if (!sim) throw new Error('Unknown fictional visit.');
  const totalCharge = sim.codes.reduce((sum, c) => sum + (c.fee ?? 0), 0);
  return {
    ...sim, totalCharge, watermark: SIM_WATERMARK,
    live: false as const, transmitted: false as const, saved: false as const,
  };
}
