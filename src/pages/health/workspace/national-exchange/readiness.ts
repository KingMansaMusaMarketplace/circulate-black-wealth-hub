import outcome from '../fhir/validator-outcome.json';
import { manifest } from '../fhir/pilot';

export type Status = 'Sample evidence only' | 'Open findings' | 'Unverified';
export type ReadinessItem = { id: string; area: string; status: Status; evidence: string; gap: string; next: string; source?: string };
export const EXCHANGE_BOUNDARY = Object.freeze({ realData: false, transport: false, credentials: false, imports: false, persistence: false, certification: false });
export const READINESS: readonly ReadinessItem[] = [
  { id: 'profiles', area: 'Exchange format & profiles', status: 'Sample evidence only', evidence: `Five-resource fictional fixture; Kenya Core ${manifest.version}, FHIR ${manifest.fhirVersion}; validator ${manifest.validatorVersion} recorded on ${manifest.validatedOn}.`, gap: 'Guide marked notForPublication. Sample testing is not receiving-system acceptance.', next: 'Confirm the applicable national exchange contract and release with DHA.', source: 'https://fhir.dha.go.ke/ig/core/index.html' },
  { id: 'terminology', area: 'Terminology & validator findings', status: 'Open findings', evidence: `${outcome.issue.filter(i => i.severity === 'error' || i.severity === 'fatal').length} errors; ${outcome.issue.filter(i => i.severity === 'warning').length} warnings in the recorded fictional packet run.`, gap: 'Terminology service disabled; facility identifier namespace mismatch and other warnings remain unresolved.', next: 'Review warnings and run authorized terminology-backed validation.', source: 'https://fhir.dha.go.ke/ig/core/index.html' },
  { id: 'identity', area: 'Patient, facility & professional identity', status: 'Unverified', evidence: 'Unissued fictional care identifiers; public facility reference kept separate.', gap: 'No identity lookup, license verification or participating facility agreement tested.', next: 'Obtain authorized identity contracts and synthetic sandbox identities.' },
  { id: 'consent', area: 'Consent & permitted use', status: 'Unverified', evidence: 'No real patient data accepted by this module.', gap: 'Kenya-specific consent, lawful-use and retention arrangements not independently verified.', next: 'Request review by qualified Kenyan counsel and clinical partners.' },
  { id: 'security', area: 'Security & hosting', status: 'Unverified', evidence: 'No credentials or transport accepted in this rehearsal.', gap: 'Exchange authentication, hosting suitability and security assessment evidence not verified.', next: 'Confirm approved infrastructure, written vendor coverage and security requirements.' },
  { id: 'sandbox', area: 'Authorized receiving-system tests', status: 'Unverified', evidence: 'Local fixed-fixture read-back only; no national receiver connected.', gap: 'No authorized sandbox, acknowledgements or end-to-end acceptance evidence.', next: 'Request official sandbox onboarding and witnessed synthetic exchange tests.' },
  { id: 'operations', area: 'Delivery, audit & recovery', status: 'Unverified', evidence: 'Local downloads are not delivery; no live retry queue or exchange audit exists.', gap: 'Duplicates, acknowledgements, failure recovery and audit retention untested.', next: 'Agree receiver rules and document synthetic recovery test cases.' },
  { id: 'approval', area: 'Certification & activation', status: 'Unverified', evidence: 'Private preview only; no DHA certification or national participation claimed.', gap: 'Certification and permission to activate real-data exchange not verified.', next: 'Confirm current certification requirements and obtain written approvals before live connection.', source: 'https://certification.dha.go.ke/regulatory-guide' },
];
export function readinessSummary(items: readonly ReadinessItem[] = READINESS) {
  return { total: items.length, sampleEvidence: items.filter(i => i.status === 'Sample evidence only').length,
    openFindings: items.filter(i => i.status === 'Open findings').length, unverified: items.filter(i => i.status === 'Unverified').length,
    liveReady: false, readinessPercent: null };
}
export function filterReadiness(status: Status | 'All') { return status === 'All' ? READINESS : READINESS.filter(item => item.status === status); }