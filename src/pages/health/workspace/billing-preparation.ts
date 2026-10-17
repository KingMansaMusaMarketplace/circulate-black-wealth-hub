import { checkSampleDocumentation } from './documentation-check';
import { findVisit } from './sample-visits';
import { intakeAvailability } from './intake-policy';

export const BILLING_STAGES = [
  { id: 'eligibility', title: 'Insurance checks', status: 'Not checked', requirements: ['Patient identity and matching must be verified.', 'Insurer, member identifier and coverage dates are not supplied.', 'An approved eligibility provider and current payer response are required.'] },
  { id: 'claim', title: 'Claim preparation', status: 'Not prepared', requirements: ['Service date and rendering provider are not supplied.', 'Diagnosis and procedure codes require qualified billing review; none are suggested here.', 'Payer-specific requirements and authorization must be independently verified.'] },
  { id: 'payment', title: 'Payment tracking', status: 'No payment record', requirements: ['No claim submission or payer response is supplied.', 'Charges, allowed amounts, adjustments and patient responsibility are unknown.', 'Reconciliation requires verified remittance and payment records.'] },
] as const;

/** Documentation evidence is never coverage, coding, claim or payment approval. */
export function billingPreparation(visitId: string) {
  const visit = findVisit(visitId);
  if (!visit) throw new Error('Unknown fictional visit.');
  const documentation = checkSampleDocumentation(visitId);
  return {
    visit, documentation, stages: BILLING_STAGES,
    fictional: true as const, healthcareClearance: intakeAvailability().cmeUpload ? 'requires_independent_verification' as const : 'blocked' as const,
    eligibility: 'not_checked' as const, claimStatus: 'not_prepared' as const,
    paymentStatus: 'no_record' as const, reviewStatus: 'unapproved' as const,
    payer: null, memberId: null, serviceDate: null, claimId: null,
    charges: null, paidAmount: null, patientResponsibility: null,
    diagnosisCodes: [], procedureCodes: [],
    canCheckInsurance: false as const, canSubmitClaim: false as const,
    canCollectPayment: false as const, canExport: false as const, canApprove: false as const,
  };
}