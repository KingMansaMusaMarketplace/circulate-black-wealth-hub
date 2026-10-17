import { z } from 'zod';
import { findVisit, SAMPLE_VISITS } from './sample-visits';
import { prepareSampleChart } from './chart-prep';
import { buildSampleCareGuide, GuideLanguage } from './care-guide';

export const DOCTOR_DAY_STEPS = ['Schedule', 'Chart preparation', 'Visit transcript', 'Doctor review', 'Follow-up'] as const;
export const DOCTOR_DAY_CASES = SAMPLE_VISITS.map((visit, index) => ({
  visitId: visit.id, title: visit.title, slot: ['8:30 AM', '10:00 AM', '1:15 PM'][index],
}));
const caseId = z.string().refine((id) => Boolean(findVisit(id)), 'Only built-in fictional cases are available.');

/** A rehearsal slot is not a dated appointment or evidence of a completed encounter. */
export function doctorDayCase(id: string, language: GuideLanguage = 'en') {
  const visitId = caseId.parse(id);
  const visit = findVisit(visitId);
  const slot = DOCTOR_DAY_CASES.find((item) => item.visitId === visitId);
  if (!visit || !slot) throw new Error('Sample case unavailable');
  return {
    visit, slot, prep: prepareSampleChart(visitId), guide: buildSampleCareGuide(visitId, language),
    fictional: true as const, appointmentStatus: 'rehearsal_only' as const,
    currentEncounterCompleted: false as const, canSend: false as const,
    canBook: false as const, canApproveGuide: false as const,
  };
}