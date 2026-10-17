import { findVisit } from './sample-visits';
import { intakeAvailability } from './intake-policy';

export const EVALUATION_CRITERIA = [
  { id: 'source', title: 'Source accuracy', question: 'Does each draft statement match its cited transcript without adding facts?' },
  { id: 'uncertainty', title: 'Missing information & uncertainty', question: 'Are missing details and uncertain findings kept unknown rather than presented as confirmed?' },
  { id: 'clarity', title: 'Clinical readability', question: 'Can a doctor distinguish historical statements, findings and proposed plans?' },
  { id: 'review', title: 'Review effort', question: 'Which steps need correction or extra review? Measure actual time in an approved study, not assumed savings.' },
] as const;
export type EvaluationCriterion = typeof EVALUATION_CRITERIA[number]['id'];
export type EvaluationObservation = 'not_reviewed' | 'issue_observed' | 'no_issue_observed';
export const blankEvaluation = (): Record<EvaluationCriterion, EvaluationObservation> => ({ source: 'not_reviewed', uncertainty: 'not_reviewed', clarity: 'not_reviewed', review: 'not_reviewed' });

export function doctorEvaluation(visitId: string) {
  const visit = findVisit(visitId);
  if (!visit) throw new Error('Only existing fictional evaluation cases are available.');
  const intake = intakeAvailability();
  return {
    visit, criteria: EVALUATION_CRITERIA, fictional: true,
    healthcareClearance: intake.cmeUpload ? 'requires_independent_verification' : 'blocked',
    pilotStatus: 'not_activated', clinicalValidation: 'not_verified',
    participatingClinics: null, reviewerIdentity: null, measuredTimeMinutes: null,
    accuracyResult: null, safetyResult: null, studyApproval: null,
    canStartPilot: false, canSubmit: false, canApprove: false, canExport: false,
  } as const;
}