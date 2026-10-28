/** Kenya MOH 505 Edition 2020, Annex 2H in May 2022 IDSR guidelines. Independent synthetic data only. */
export const IDSR_SOURCE = 'https://nphi.go.ke/sites/default/files/2024-02/IDSR%20Technical%20Guidelines%20for%20Kenya%2011.05.2022_9am.pdf';
export const IDSR_CAPABILITIES = Object.freeze({ sampleExport: true, patientInput: false, persist: false, governmentSubmission: false, immediateNotification: false });
export const IDSR_DISEASES = ['AEFI', 'Acute Jaundice', 'Acute Malnutrition', 'AFP (Poliomyelitis)', 'Anthrax', 'Cholera', 'Dengue', 'Dysentery (Bacillary)', 'Guinea Worm Disease', 'Measles', 'Suspected Malaria', 'Deaths due to Malaria', 'Maternal deaths', 'Meningococcal Meningitis', 'Neonatal deaths', 'Neonatal Tetanus', 'Plague', 'Rabies', 'Rift Valley Fever', 'SARI (Cluster ≥3 cases)', 'Suspected MDR/XDR TB', 'Typhoid', 'VHF', 'Yellow Fever', 'Others (Specify)'] as const;
export type Disease = typeof IDSR_DISEASES[number];
export type Counts = [number | null, number | null, number | null, number | null];
export type SurveillanceRow = { disease: Disease; counts: Counts };
const blocked = (d: Disease, col: number) => (d === 'Deaths due to Malaria' && (col === 0 || col === 2)) || (d === 'Maternal deaths' && col !== 3) || (d === 'Neonatal deaths' && col !== 1) || (d === 'Neonatal Tetanus' && col >= 2);
export function validateCounts(rows: readonly SurveillanceRow[]) {
  if (rows.length !== IDSR_DISEASES.length) throw new Error('Incomplete form inventory');
  rows.forEach((row, index) => {
    if (row.disease !== IDSR_DISEASES[index] || row.counts.length !== 4) throw new Error('Incorrect form mapping');
    row.counts.forEach((value, col) => {
      if (blocked(row.disease, col)) { if (value !== null) throw new Error('Blocked form cell'); }
      else if (value === null || !Number.isSafeInteger(value) || value < 0) throw new Error('Invalid tally');
    });
  });
}
type Tally = { disease: Disease; ageYears: number; kind: 'case' | 'death'; count: number };
export function aggregateSampleTallies(tallies: readonly Tally[]): SurveillanceRow[] {
  const rows: SurveillanceRow[] = IDSR_DISEASES.map(disease => ({ disease, counts: [0, 1, 2, 3].map(col => blocked(disease, col) ? null : 0) as Counts }));
  for (const t of tallies) {
    if (!Number.isFinite(t.ageYears) || t.ageYears < 0 || !Number.isSafeInteger(t.count) || t.count < 0 || !['case', 'death'].includes(t.kind)) throw new Error('Invalid tally');
    const row = rows.find(item => item.disease === t.disease);
    if (!row) throw new Error('Unmapped disease');
    const col = (t.ageYears < 5 ? 0 : 2) + (t.kind === 'death' ? 1 : 0), current = row.counts[col];
    if (current === null || current === undefined) throw new Error('Blocked cell');
    row.counts[col] = current + t.count;
  }
  validateCounts(rows); return rows;
}
export const IDSR_LAB_FIELDS: readonly (readonly [string, string, string])[] = [
  ...['Tested', 'Positive'].flatMap(measure => ['<5 years', '≥5 years', 'Total'].map(age => ['Malaria microscopy', measure, age] as const)),
  ...['Tested', 'Positive'].flatMap(measure => ['<5 years', '>5 years (printed form)'].map(age => ['Malaria mRDT', measure, age] as const)),
  ...['No CSF', 'No contaminated', 'No Tested', '+ve Nm', '+ve S.Pneum', '+ve Hib', 'Other pathogens'].map(measure => ['Bacterial Meningitis', measure, 'All'] as const),
  ...['+ve Nm A', '+ve Nm B', '+ve Nm C', '+ve Nm W', '+ve Nm X', '+ve Nm Y', 'Other Nm Ind.'].map(measure => ['No of CSF Sub-Typed', measure, 'All'] as const),
  ...['Dysentery', 'Tuberculosis (MDR/XDR)', 'Typhoid'].flatMap(disease => ['Tested', disease === 'Dysentery' ? 'Positive (S. dysenteriae)' : 'Positive'].flatMap(measure => ['<5 years', '≥5 years'].map(age => [disease, measure, age] as const))),
];
export const IDSR_SAMPLES = [
  { id: 'cluster', label: 'Fictional surveillance week', start: '2026-10-19', end: '2026-10-25', epiWeek: 43, month: 'October', year: 2026, reportDate: '2026-10-26', rows: aggregateSampleTallies([
    { disease: 'Cholera', ageYears: 3, kind: 'case', count: 2 }, { disease: 'Cholera', ageYears: 5, kind: 'case', count: 3 }, { disease: 'Cholera', ageYears: 34, kind: 'death', count: 1 }, { disease: 'Measles', ageYears: 4, kind: 'case', count: 1 }, { disease: 'Suspected Malaria', ageYears: 3, kind: 'case', count: 4 }, { disease: 'Suspected Malaria', ageYears: 21, kind: 'case', count: 6 }]) },
  { id: 'zero', label: 'Fictional zero-report week', start: '2026-10-26', end: '2026-11-01', epiWeek: 44, month: 'November', year: 2026, reportDate: '2026-11-02', rows: aggregateSampleTallies([]) },
] as const;
export type SampleId = typeof IDSR_SAMPLES[number]['id'];
export function sampleReport(id: SampleId) {
  const sample = IDSR_SAMPLES.find(item => item.id === id);
  if (!sample) throw new Error('Only fixed fictional samples may be exported');
  validateCounts(sample.rows);
  return { ...sample, county: 'SAMPLE — not a real county', subCounty: 'SAMPLE — not a real sub-county', facility: '1325 Fictional Training Facility', reported: 1, expected: 1, reportedBy: 'SAMPLE — no actual reporter', designation: 'Training fixture', signature: 'UNSIGNED — NOT FOR SUBMISSION', labs: IDSR_LAB_FIELDS.map(([disease, measure, age]) => ({ disease, measure, age, value: 0 })) };
}
export function sampleCsv(id: SampleId) {
  const r = sampleReport(id), quote = (value: unknown) => `"${String(value).replaceAll('"', '""')}"`;
  const lines: unknown[][] = [['FICTIONAL SAMPLE — NOT FOR GOVERNMENT SUBMISSION'], ['MOH 505 Edition 2020 / May 2022 guidelines Annex 2H'], ['Reference', IDSR_SOURCE],
    ['County', r.county], ['Sub County', r.subCounty], ['Health Facility', r.facility], ['Epi Week', r.epiWeek], ['Week ending', r.end], ['Month', r.month], ['Year', r.year],
    ['No. of Health Facilities/Sites that reported', r.reported], ['No. of Health Facilities/Sites expected to report', r.expected],
    ['Diseases, Conditions or Events', '<5 years Cases', '<5 years Deaths', '≥5 years Cases', '≥5 years Deaths'], ...r.rows.map(row => [row.disease, ...row.counts.map(value => value === null ? 'N/A' : value)]),
    ['Laboratory Surveillance', 'Measure', 'Age group', 'Count'], ...r.labs.map(row => [row.disease, row.measure, row.age, row.value]),
    ['Reported by', r.reportedBy], ['Designation', r.designation], ['Sign', r.signature], ['Date', r.reportDate],
    ['Limitations', 'Review worksheet only, not a verified KHIS import. Confirm current form, epi-week numbering and mRDT >5 age handling with Kenya. No immediate notification or outbreak detection.']];
  return '\uFEFF' + lines.map(row => row.map(quote).join(',')).join('\r\n');
}
