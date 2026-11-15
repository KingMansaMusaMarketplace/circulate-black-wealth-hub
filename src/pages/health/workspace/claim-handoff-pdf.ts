import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PDF_LOGO_DATA_URL } from '@/utils/pdfLogo';
import { HANDOFF_PARTNER, HANDOFF_PARTNER_STATUS, SAMPLE_STAMP, type HandoffPreview } from '@/lib/clinical/claim-handoff';

const RED: [number, number, number] = [200, 16, 46];
const LEGAL = 'This document contains proprietary, trade-secret, and patent-pending information of Mansa Musa Marketplace, Inc. (1325.AI) and is delivered solely to the named recipient under an obligation of confidentiality. Any reproduction, disclosure, or use — in whole or in part — without the prior written consent of the Company is strictly prohibited and may result in civil and criminal liability under applicable U.S. and international law.';

/** Local sample PDF of the CMS-1500 hand-off preview. Stamped on every page; never transmitted. */
export function buildHandoffPdf(preview: HandoffPreview, meta: { patientName: string; serviceDate: string; clinicName?: string | null }) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight(), M = 48;
  const logo = (x: number, y: number, s: number) => { try { doc.addImage(PDF_LOGO_DATA_URL, 'JPEG', x, y, s, s); } catch { /* logo optional */ } };

  doc.setFillColor(0, 51, 102); doc.rect(0, 0, W, 90, 'F');
  logo(M, 20, 50);
  doc.setTextColor(255, 179, 0); doc.setFont('helvetica', 'bold'); doc.setFontSize(17);
  doc.text('Billing Partner Hand-off Preview', M + 64, 46);
  doc.setTextColor(255); doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
  doc.text(`CMS-1500 box-by-box mapping · ${meta.patientName} · visit ${meta.serviceDate}`, M + 64, 64);

  let y = 106;
  doc.setDrawColor(...RED); doc.setLineWidth(1.5); doc.setFillColor(255, 255, 255); doc.rect(M, y, W - 2 * M, 92, 'FD');
  doc.setLineWidth(0.6); doc.rect(M + 4, y + 4, W - 2 * M - 8, 84);
  doc.setTextColor(...RED); doc.setFont('helvetica', 'bold'); doc.setFontSize(15);
  doc.text('PRIVATE & CONFIDENTIAL', W / 2, y + 24, { align: 'center' });
  doc.setFontSize(10.5); doc.text('DO NOT COPY, FORWARD, OR DISTRIBUTE', W / 2, y + 40, { align: 'center' });
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5);
  doc.text(doc.splitTextToSize(LEGAL, W - 2 * M - 40), W / 2, y + 54, { align: 'center' });
  y += 108;

  doc.setTextColor(0); doc.setFontSize(9.5);
  const intro = doc.splitTextToSize(`Made-up test patient. This sample shows how a 1325 Clinical practice claim maps to the standard CMS-1500 claim form for a billing partner such as ${HANDOFF_PARTNER} (${HANDOFF_PARTNER_STATUS}; not a current partner). It was never sent to any payer, clearinghouse or partner. 1325 does not suggest codes — the clinic typed every code.${meta.clinicName ? ` Clinic: ${meta.clinicName}.` : ''}`, W - 2 * M);
  doc.text(intro, M, y); y += intro.length * 12 + 6;

  const stamp = () => {
    doc.saveGraphicsState();
    // Light diagonal stamp across the page.
    doc.setGState(new (doc as unknown as { GState: new (o: { opacity: number }) => unknown }).GState({ opacity: 0.12 }) as never);
    doc.setTextColor(...RED); doc.setFont('helvetica', 'bold'); doc.setFontSize(46);
    const a = (35 * Math.PI) / 180; const w = doc.getTextWidth(SAMPLE_STAMP);
    doc.text(SAMPLE_STAMP, W / 2 - (Math.cos(a) * w) / 2, H / 2 + (Math.sin(a) * w) / 2, { angle: 35 });
    doc.restoreGraphicsState();
  };
  const footer = () => {
    const pages = doc.getNumberOfPages();
    for (let i = 1; i <= pages; i += 1) {
      doc.setPage(i); stamp();
      logo(M, H - 36, 16);
      doc.setFontSize(8); doc.setTextColor(110); doc.setFont('helvetica', 'normal');
      doc.text(`1325.AI · 1325 Clinical EMR / EHR · ${SAMPLE_STAMP} · fictional test data`, M + 22, H - 24);
      doc.text(`Page ${i} of ${pages}`, W - M, H - 24, { align: 'right' });
    }
  };

  autoTable(doc, {
    startY: y, margin: { left: M, right: M, bottom: 50 }, theme: 'grid',
    head: [['Box', 'What it is', 'Filled from 1325']],
    body: preview.boxes.map((b) => [b.box, b.label, b.value]),
    headStyles: { fillColor: [0, 51, 102], textColor: 255, fontSize: 9 },
    bodyStyles: { fontSize: 8.5, cellPadding: 4 },
    columnStyles: { 0: { cellWidth: 44, fontStyle: 'bold' }, 1: { cellWidth: 150 } },
  });
  const after = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? y;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(0, 51, 102);
  doc.text('Box 24 · service lines', M, after + 24);
  autoTable(doc, {
    startY: after + 32, margin: { left: M, right: M, bottom: 50 }, theme: 'grid',
    head: [['#', '24A Date', '24B Place', '24D Code', 'Mod', '24E Dx', '24F Charge', '24G Units', '24J NPI']],
    body: preview.lines.length ? preview.lines.map((l) => [l.n, l.date, l.pos, l.code, l.modifier, l.pointers, l.charge, l.units, l.npi]) : [['—', 'No service lines entered yet', '', '', '', '', '', '', '']],
    headStyles: { fillColor: [0, 51, 102], textColor: 255, fontSize: 8.5 },
    bodyStyles: { fontSize: 8.5, cellPadding: 4 },
  });
  const end = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? after;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(90);
  let noteY = end + 18;
  if (noteY > H - 64) { doc.addPage(); noteY = M; }
  doc.text(doc.splitTextToSize(`${preview.missing} item(s) are marked for the clinic or billing partner to supply (for example NPI and tax ID). They are not stored in the pilot.`, W - 2 * M), M, noteY);
  footer();
  return doc;
}
