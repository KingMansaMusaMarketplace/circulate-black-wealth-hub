import { intakeAvailability } from './intake-policy';

export const CONNECTION_TYPES = [
  { id: 'laboratory', title: 'Laboratory', purpose: 'Orders and received results', requirements: [
    'Select the laboratory and confirm its approved connection program.',
    'Validate patient matching, order identifiers, units, reference ranges and corrected results.',
    'Define clinician result review, critical-result escalation and delivery-failure handling.',
  ], sample: [
    { field: 'Order reference', value: 'FICTIONAL-ORDER-01' },
    { field: 'Result status', value: 'No result supplied — not received' },
    { field: 'Values and reference ranges', value: 'Not supplied' },
    { field: 'Chart destination', value: 'Proposed results review queue — not written' },
  ] },
  { id: 'pharmacy', title: 'Pharmacy', purpose: 'Clinician-authorized prescriptions', requirements: [
    'Select an approved prescribing service and verify prescriber identity and jurisdiction.',
    'Validate medicine identifiers, allergy reconciliation, pharmacy matching and prescribing permissions.',
    'Review controlled-substance requirements where applicable and test rejection/cancellation handling.',
  ], sample: [
    { field: 'Prescription reference', value: 'FICTIONAL-RX-01' },
    { field: 'Medicine and dose', value: 'Not supplied — no prescription prepared' },
    { field: 'Prescriber authorization', value: 'Not verified' },
    { field: 'Pharmacy delivery', value: 'Not sent' },
  ] },
  { id: 'records', title: 'Medical-record systems', purpose: 'Authorized record exchange', requirements: [
    'Select the clinic record system and confirm its approved access program and permitted record types.',
    'Validate patient matching, source identifiers, dates, consent and record provenance.',
    'Test field mapping, duplicate handling without automatic merging, and clinician review before chart writes.',
  ], sample: [
    { field: 'External record reference', value: 'FICTIONAL-RECORD-01' },
    { field: 'Patient match', value: 'Not verified — no patient linked' },
    { field: 'Source system', value: 'Illustrative only — no provider connected' },
    { field: 'Chart import', value: 'Not performed' },
  ] },
] as const;

/** Presentation-only preparation: no connector, credentials, record input or approval authority. */
export function connectionPreparation(id: string) {
  const connection = CONNECTION_TYPES.find((item) => item.id === id);
  if (!connection) throw new Error('Unknown connection category.');
  const intake = intakeAvailability();
  return {
    ...connection,
    status: 'not_connected' as const,
    providerStatus: 'not_selected' as const,
    coverageStatus: 'not_verified' as const,
    validationStatus: 'not_performed' as const,
    healthcareClearance: intake.cmeUpload ? 'requires_independent_verification' as const : 'blocked' as const,
    fictional: true as const,
    canConnect: false as const, canReceive: false as const, canSend: false as const,
    canImport: false as const, canApprove: false as const, canEnterCredentials: false as const,
  };
}