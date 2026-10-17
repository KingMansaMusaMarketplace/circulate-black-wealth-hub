import { buildSampleCareGuide, GuideLanguage } from './care-guide';
import { findVisit } from './sample-visits';
import { intakeAvailability } from './intake-policy';

/** Fixed source previews only. No recipient input, delivery or approval authority. */
export function patientCommunication(visitId: string, language: GuideLanguage = 'en') {
  const visit = findVisit(visitId);
  if (!visit) throw new Error('Unknown fictional visit.');
  const guide = buildSampleCareGuide(visitId, language);
  const patientExcerpt = visit.lines.findIndex((line) => line.startsWith('Patient:'));
  if (patientExcerpt < 0) throw new Error('No patient source excerpt supplied.');
  const intake = intakeAvailability();
  return {
    visit, guide,
    message: { line: patientExcerpt + 1, quote: visit.lines[patientExcerpt], origin: 'visit_transcript' as const, received: false as const },
    followUp: guide.plan.filter((item) => item.line === (visitId === 'visit-back-pain-v1' ? 9 : visitId === 'visit-blood-pressure-v1' ? 8 : -1)),
    appointmentDate: null, recipient: null,
    consentStatus: 'not_verified' as const, reviewStatus: 'unapproved' as const,
    deliveryStatus: 'not_sent' as const, fictional: true as const,
    healthcareClearance: intake.cmeUpload ? 'requires_independent_verification' as const : 'blocked' as const,
    canSend: false as const, canSchedule: false as const, canInvite: false as const,
    canApprove: false as const, canReceive: false as const, canEnterPatientData: false as const,
  };
}