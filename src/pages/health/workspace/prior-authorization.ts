import { findVisit } from './sample-visits';

export const AUTHORIZATION_VISIT_ID = 'visit-knee-v1';
const evidence = [
  { label: 'Requested service', line: 8, quote: 'Doctor: We will order an MRI of the right knee.' },
  { label: 'Reported injury', line: 2, quote: 'Patient: I twisted my right knee playing basketball three days ago.' },
  { label: 'Reported symptoms', line: 3, quote: 'Patient: It swelled up the same night and it is hard to fully straighten it.' },
  { label: 'Recorded examination', line: 4, quote: 'Doctor: There is moderate swelling of the right knee and tenderness along the inside joint line.' },
  { label: 'Examination limitation', line: 5, quote: 'Doctor: Ligament testing is limited today because of pain.' },
  { label: 'Unconfirmed clinical concern', line: 6, quote: 'Doctor: I am concerned about a possible meniscus injury, but I cannot confirm that today.' },
] as const;

export function validateAuthorizationEvidence(items: ReadonlyArray<{ line: number; quote: string }>, visitId: string) {
  const visit = findVisit(visitId);
  if (visitId !== AUTHORIZATION_VISIT_ID || !visit) throw new Error('Unknown authorization sample');
  for (const item of items) {
    if (!Number.isInteger(item.line) || visit.lines[item.line - 1] !== item.quote) {
      throw new Error('Authorization source mismatch');
    }
  }
}

/** Fixed sample assembly only; no clinical text input, payer decision, or submission. */
export function prepareAuthorizationPacket(visitId: string) {
  validateAuthorizationEvidence(evidence, visitId);
  return {
    visitId,
    evidence: evidence.map((item) => ({ ...item })),
    gaps: [
      { id: 'identity', label: 'Patient identifiers, insurer and member ID are absent from this transcript.' },
      { id: 'order', label: 'A signed imaging order, ordering clinician and service date are not supplied.' },
      { id: 'rationale', label: 'The doctor must confirm the written clinical rationale; the suspected injury is not a confirmed diagnosis.' },
      { id: 'payer', label: 'The insurer’s authorization rules and required attachments have not been verified.' },
      { id: 'appeal', label: 'No denial letter is supplied. An appeal cannot be prepared from this sample.' },
    ],
    status: 'awaiting_doctor_review' as const,
    fictional: true as const,
    canSubmit: false as const,
    canExport: false as const,
    isMedicalNecessityDecision: false as const,
  };
}

export type AuthorizationPacket = ReturnType<typeof prepareAuthorizationPacket>;