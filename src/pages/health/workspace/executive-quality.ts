import { SAMPLE_VISITS } from './sample-visits';
import { buildSamplePatientChart } from './sample-chart';
import { doctorEvaluation } from './doctor-evaluation';
import { intakeAvailability } from './intake-policy';

/** Source inventory only: never patient population statistics or measured outcomes. */
export function executiveQuality() {
  const intake = intakeAvailability();
  return {
    fictional: true as const,
    cases: SAMPLE_VISITS.map((visit) => {
      const chart = buildSamplePatientChart(visit.id);
      return { id: visit.id, title: visit.title, lineCount: visit.lines.length,
        lines: visit.lines, gaps: chart.gaps, evaluation: doctorEvaluation(visit.id) };
    }),
    metrics: { accuracyPercent: null, safetyResult: null, reviewTimeMinutes: null,
      monthlySavings: null, uptimePercent: null, qualityScore: null },
    clearance: 'not_verified' as const,
    live: { records: intake.cmeUpload, calls: intake.patientCalls, agreements: intake.agreementUpload },
    canApprove: false as const, canExport: false as const,
  };
}