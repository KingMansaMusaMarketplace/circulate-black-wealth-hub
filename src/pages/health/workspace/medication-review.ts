import { buildSamplePatientChart } from './sample-chart';

/** Documentation rehearsal only, not a drug database or treatment engine. */
export function prepareMedicationReview(visitId: string) {
  const chart = buildSamplePatientChart(visitId);
  return {
    visitId, title: chart.title, evidence: chart.medications.excerpts,
    gaps: [
      { id: 'list', title: 'Complete medicine list', detail: 'Names, doses, routes and schedules are not documented as a complete list.' },
      { id: 'allergies', title: 'Allergies and reactions', detail: 'Allergy history is unknown. Missing documentation does not mean no allergies.' },
      { id: 'reconciliation', title: 'Clinician reconciliation', detail: 'Current use, nonprescription medicines and supplements have not been reconciled.' },
    ],
    adherence: visitId === 'visit-blood-pressure-v1' ? 'historical_patient_report' as const : 'not_documented' as const,
    doseChange: visitId === 'visit-blood-pressure-v1' ? 'future_possibility_only' as const : 'not_documented' as const,
    transcript: chart.documents[0].lines,
    allergyStatus: 'unknown' as const, interactionStatus: 'not_checked' as const, doseSafetyStatus: 'not_checked' as const,
    reviewStatus: 'awaiting_clinician_review' as const, fictional: true as const, currentStatusVerified: false as const,
    canPrescribe: false as const, canChangeDose: false as const, canSign: false as const,
    canExport: false as const, canSend: false as const, canAcceptPatientRecords: false as const,
  };
}
