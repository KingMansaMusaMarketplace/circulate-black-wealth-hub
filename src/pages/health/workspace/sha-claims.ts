// Independent synthetic rehearsal, not an SHA payload, tariff or coverage decision.
export const SHA_PILOT_VERSION = '1325-sha-local-rehearsal-1.0.0';
export const SHA_CAPABILITIES = Object.freeze({ network: false, patientInput: false, persistence: false, export: false, submission: false, payment: false, approval: false });
export type ShaScenario = 'complete' | 'missing-document' | 'coverage-unknown';
export const SHA_SCENARIOS: readonly ShaScenario[] = ['complete', 'missing-document', 'coverage-unknown'];
export type ShaPacket = {
  version: string; scenario: ShaScenario; sampleMember: string; sampleFacility: string;
  serviceDate: string; service: string; currency: 'KES'; illustrativeAmount: number;
  documents: readonly string[]; simulatedCoverage: 'sample-active' | 'unknown';
};
export function shaSample(scenario: ShaScenario): ShaPacket {
  if (!SHA_SCENARIOS.includes(scenario)) throw new Error('Unknown fictional SHA scenario.');
  return { version: SHA_PILOT_VERSION, scenario, sampleMember: 'FICTIONAL-MEMBER-001',
    sampleFacility: 'FICTIONAL-FACILITY-001', serviceDate: '2026-10-28', service: 'Fictional consultation',
    currency: 'KES', illustrativeAmount: 1000,
    documents: scenario === 'missing-document' ? [] : ['FICTIONAL-SERVICE-NOTE-001'],
    simulatedCoverage: scenario === 'coverage-unknown' ? 'unknown' : 'sample-active' };
}
export function validateShaSample(packet: ShaPacket) {
  const expected = shaSample(packet.scenario);
  // Reject any changed field or extra key; this is not a real-record intake path.
  const keys = Object.keys(expected) as (keyof ShaPacket)[];
  if (Object.keys(packet).length !== keys.length || keys.some(key => JSON.stringify(packet[key]) !== JSON.stringify(expected[key]))) {
    throw new Error('Only the unchanged fixed fictional packet is allowed.');
  }
  const issues: string[] = [];
  if (!packet.documents.length) issues.push('Sample service note missing.');
  if (packet.simulatedCoverage === 'unknown') issues.push('Sample coverage unknown; do not infer eligibility.');
  return { issues, locallyComplete: issues.length === 0, officialSchemaValidated: false as const,
    shaAccepted: false as const, actualCoverage: null, paidAmount: null, transmitted: false as const };
}
export function rehearseShaReview(packet: ShaPacket, outcome: 'return' | 'pending') {
  if (!['return', 'pending'].includes(outcome)) throw new Error('Unknown rehearsal outcome.');
  const check = validateShaSample(packet);
  if (!check.locallyComplete) throw new Error('Resolve the fixed sample gaps before rehearsing review.');
  return { status: outcome === 'return' ? 'Simulated return for document review' : 'Simulated pending review',
    simulated: true as const, shaResponse: null, claimId: null, paidAmount: null, transmitted: false as const };
}