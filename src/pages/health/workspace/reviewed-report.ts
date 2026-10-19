import { jsPDF } from 'jspdf';

type Item = { text: string; lines: number[] };
type Note = Partial<Record<'subjective' | 'objective' | 'assessment' | 'plan' | 'flags', Item[]>>;
export type ReportInput = { visitTitle: string; transcript: readonly string[]; note: Note; decision?: string; signedAt?: string; signerName?: string; clinicName?: string };

const SECTIONS = [['subjective', 'Patient story'], ['objective', 'Exam findings'], ['assessment', 'Assessment'], ['plan', 'Plan']] as const;

/** Only doctor-signed notes can be exported; rejected or unsigned drafts never become reports. */
export function assertExportable(input: ReportInput) {
  if (input.decision !== 'signed' || !input.signedAt || !Number.isFinite(Date.parse(input.signedAt))) throw new Error('Only sample-signed notes with a valid saved date can be exported');
  for (const [k] of SECTIONS) for (const it of input.note[k] ?? []) for (const n of it.lines) {
    if (!Number.isInteger(n) || n < 1 || n > input.transcript.length) throw new Error('Note cites a missing transcript line');
  }
}

export function buildReviewedReport(input: ReportInput, logo?: HTMLImageElement) {
  assertExportable(input);
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight(), M = 48;
  let y = 0;
  const footer = () => {
    doc.setFontSize(8); doc.setTextColor(110);
    doc.text('1325.AI · 1325 Clinical EMR / EHR · FICTIONAL SAMPLE — NOT A REAL PATIENT RECORD', M, H - 24);
    doc.text(`Page ${doc.getNumberOfPages()}`, W - M, H - 24, { align: 'right' });
  };
  const ensure = (h: number) => { if (y + h > H - 50) { footer(); doc.addPage(); y = M; } };
  doc.setFillColor(0, 51, 102); doc.rect(0, 0, W, 90, 'F');
  if (logo) try { doc.addImage(logo, 'PNG', M, 20, 50, 50); } catch { /* logo optional */ }
  doc.setTextColor(255, 179, 0); doc.setFont('helvetica', 'bold'); doc.setFontSize(18);
  doc.text('Doctor-Reviewed Visit Note', M + 64, 48);
  doc.setTextColor(255); doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
  doc.text(input.visitTitle, M + 64, 66);
  y = 108;
  doc.setDrawColor(200, 0, 0); doc.setFillColor(255, 240, 240); doc.rect(M, y, W - 2 * M, 34, 'FD');
  doc.setTextColor(200, 0, 0); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
  doc.text('PRIVATE & CONFIDENTIAL — DO NOT COPY, FORWARD, OR DISTRIBUTE', W / 2, y + 21, { align: 'center' });
  y += 50;
  doc.setTextColor(0); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
  const when = new Date(input.signedAt ?? '').toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  { const sig = doc.splitTextToSize(`Reviewed and signed by ${input.signerName ?? "a clinic doctor"} on ${when} via 1325 Clinical EMR / EHR${input.clinicName ? ` (${input.clinicName})` : ''}`, W - 2 * M); doc.text(sig, M, y); y += (sig.length - 1) * 13; }
  y += 14; doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(90);
  doc.text('Fictional sample visit. Drafted by Kayla (AI assistant); reviewed by a clinician. Not for patient care, billing, or legal use.', M, y);
  y += 24;
  const para = (t: string, size = 10, indent = 0) => {
    doc.setFontSize(size); const lines = doc.splitTextToSize(t, W - 2 * M - indent);
    ensure(lines.length * (size + 3)); doc.text(lines, M + indent, y); y += lines.length * (size + 3);
  };
  para('Sample-role attestation only. Entered signer names and clinic roles do not independently verify physician identity, qualifications or licensure.', 9);
  for (const [k, label] of SECTIONS) {
    ensure(30); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 51, 102); para(label, 12);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(0);
    const items = input.note[k] ?? [];
    if (!items.length) para('Not stated in the visit.', 10, 10);
    for (const it of items) para(`• ${it.text}  [transcript line${it.lines.length > 1 ? 's' : ''} ${it.lines.join(', ')}]`, 10, 10);
    y += 8;
  }
  if (input.note.flags?.length) {
    doc.setFont('helvetica', 'bold'); doc.setTextColor(150, 100, 0); para('Flagged for physician review', 12);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(0);
    for (const f of input.note.flags) para(`• ${f.text}`, 10, 10);
    y += 8;
  }
  doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 51, 102); para('Source transcript (fictional)', 12);
  doc.setFont('helvetica', 'normal'); doc.setTextColor(60);
  input.transcript.forEach((l, i) => para(`L${i + 1}  ${l}`, 9, 10));
  footer();
  return doc;
}
