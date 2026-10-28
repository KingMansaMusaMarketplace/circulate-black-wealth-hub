import bundle from './sample-bundle.json';
import manifest from './manifest.json';

export { manifest };
export const PILOT_CAPABILITIES = Object.freeze({ exportSynthetic: true, patientInput: false, importChart: false, persist: false, governmentTransport: false });
export function exportFictionalBundle() { return JSON.stringify(bundle, null, 2) + '\n'; }
/** Exact fixed-fixture read-back, not a substitute for the HL7 profile validator. */
export function checkFictionalRoundTrip(text: string) {
  const parsed: unknown = JSON.parse(text);
  if (JSON.stringify(parsed) !== JSON.stringify(bundle)) throw new Error('Only the unchanged independent fictional fixture is allowed.');
  return { temperature: 36.8, unit: 'Cel', date: '2026-10-19T12:00:00Z', synthetic: true };
}
export function downloadPilotFile(content: string, filename: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'application/json' }));
  const link = document.createElement('a'); link.href = url; link.download = filename; link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 5000);
}