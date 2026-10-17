import { buildSamplePatientChart } from './sample-chart';
import { prepareMedicationReview } from './medication-review';
import { intakeAvailability } from './intake-policy';

/** Fixed documentation review, not risk scoring, triage or clinical screening. */
export function clinicalSafety(visitId: string) {
  const chart = buildSamplePatientChart(visitId);
  const medication = prepareMedicationReview(visitId);
  const lines = chart.documents[0].lines;
  const references = visitId === 'visit-knee-v1'
    ? [{ line: 5, title: 'Limited historical exam' }, { line: 6, title: 'Unconfirmed historical assessment' }, { line: 8, title: 'Planned imaging, not a result' }]
    : visitId === 'visit-blood-pressure-v1'
      ? [{ line: 2, title: 'Historical medicine-use report' }, { line: 7, title: 'Possible future dose discussion' }, { line: 8, title: 'Requested monitoring, not a received log' }]
      : [{ line: 7, title: 'Historical clinician impression' }, { line: 9, title: 'Proposed follow-up, not a completed visit' }];
  return {
    visitId, title: chart.title, lines, gaps: chart.gaps,
    evidence: references.map((reference) => {
      const text = lines[reference.line - 1];
      if (!text) throw new Error('Fictional safety source unavailable.');
      return { ...reference, text };
    }),
    allergyStatus: medication.allergyStatus,
    reconciliation: chart.medications.reconciliation,
    interactionStatus: medication.interactionStatus,
    doseSafetyStatus: medication.doseSafetyStatus,
    reviewStatus: medication.reviewStatus,
    intake: intakeAvailability(),
    fictional: true as const, riskScore: null, clinicalValidation: 'not_verified' as const,
    canApprove: false as const, canPrescribe: false as const, canExport: false as const,
    canSend: false as const, canScreen: false as const,
  };
}