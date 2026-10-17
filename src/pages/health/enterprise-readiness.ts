import { intakeAvailability } from './workspace/intake-policy';

/** Informational roadmap, not evidence of legal approval or an unlock mechanism. */
export function enterpriseReadiness() {
  const availability = intakeAvailability();
  return {
    phases: [
      { id: 'fictional', title: 'Fictional evaluation', status: 'available_for_evaluation', label: 'Sample evaluation available', items: [
        { title: 'Source-linked sample workflows', detail: 'Fictional examples are available for evaluation. This is not completed clinical validation.' },
        { title: 'Doctor review', detail: 'Clinical decisions remain with doctors. Sample workflows do not authorize real-record processing.' },
        { title: 'Private access', detail: 'Visitor approval controls access to the preview only, not permission to enter patient records.' },
      ] },
      { id: 'clearance', title: 'Legal & healthcare clearance', status: 'not_verified', label: 'Verification outstanding', items: [
        { title: 'Attorney-approved clinic agreement', detail: 'An attorney-approved Business Associate Agreement (BAA) is not available here. Signing remains unavailable.' },
        { title: 'Coverage for each vendor', detail: 'Written BAA coverage must be confirmed for the exact hosting, AI, email and other services handling records. Coverage is not verified here.' },
        { title: 'Dedicated healthcare environment', detail: 'Independent verification of access controls, security risk assessment, audit logging, recovery and incident response is required.' },
        { title: 'Operational safeguards', detail: 'Privacy, retention, workforce training and breach procedures require review before real records are allowed.' },
      ] },
      { id: 'pilot', title: 'Real-record pilot', status: 'locked', label: 'Not activated', items: [
        { title: 'Pilot activation', detail: 'No pilot clinic count or launch date is confirmed. A pilot requires verified legal coverage and healthcare safeguards.' },
        { title: 'Patient calls & recordings', detail: 'Remain blocked pending healthcare clearance and review of calling, recording and consent requirements.' },
      ] },
    ],
    agreementUploadAllowed: availability.agreementUpload,
    realRecordsAllowed: availability.cmeUpload,
    patientCallsAllowed: availability.patientCalls,
    canApprove: false,
  } as const;
}