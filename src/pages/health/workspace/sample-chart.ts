import { findVisit } from './sample-visits';
import { prepareSampleChart } from './chart-prep';

/** Fixed source inventory, not a clinical database audit or a newly completed visit. */
export function buildSamplePatientChart(visitId: string) {
  const visit = findVisit(visitId);
  if (!visit) throw new Error('Only built-in fictional charts are available.');
  const prep = prepareSampleChart(visitId);
  const quote = (line: number) => {
    const text = visit.lines[line - 1];
    if (!text) throw new Error('Chart source unavailable.');
    return { line, text };
  };
  return {
    visitId, title: visit.title, sections: prep.sections, gaps: prep.gaps,
    demographics: { dateOfBirth: null, address: null, phone: null },
    allergies: { status: 'not_documented' as const, entries: [] },
    medications: { reconciliation: 'not_completed' as const, namesAndDoses: [], excerpts: visitId === 'visit-blood-pressure-v1' ? [quote(2), quote(7)] : [] },
    results: { received: [], planned: visitId === 'visit-knee-v1' ? [quote(8)] : [] },
    documents: [{ id: visit.id, title: 'Original fictional visit transcript', date: null, lines: visit.lines }],
    sourceHistory: [{ revision: 1, kind: 'fixture_baseline' as const, actor: null, timestamp: null, sourceId: visit.id, text: 'Built-in transcript baseline. No saved chart edits or doctor decisions are represented by this entry.' }],
    clinicalDate: null, fictional: true as const, canEdit: false as const,
    canUpload: false as const, isAuditTrail: false as const, currentStatusVerified: false as const,
  };
}