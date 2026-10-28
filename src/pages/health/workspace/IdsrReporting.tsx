import { useState } from 'react';
import { ClipboardCheck, Download, ExternalLink, Lock, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { IDSR_SAMPLES, IDSR_SOURCE, sampleCsv, sampleReport, type SampleId } from './idsr-reporting';

export default function IdsrReporting() {
  const [id, setId] = useState<SampleId>('cluster');
  const [checked, setChecked] = useState(false);
  const [showLabs, setShowLabs] = useState(false);
  const [error, setError] = useState('');
  const report = sampleReport(id);
  const downloadCsv = () => {
    if (!checked) return;
    try {
      const url = URL.createObjectURL(new Blob([sampleCsv(id)], { type: 'text/csv;charset=utf-8' }));
      const a = document.createElement('a'); a.href = url; a.download = `1325-SAMPLE-MOH505-${id}.csv`;
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch { setError('The sample export could not be prepared. Run the checks again.'); }
  };
  return <section aria-label="Kenya IDSR reporting" className="space-y-6">
    <div className="border-y border-mansagold/40 bg-mansagold/5 px-4 py-4">
      <p className="font-semibold text-mansagold">Built for sample testing · not certified</p>
      <p className="mt-1 text-sm text-muted-foreground">Integrated Disease Surveillance and Response (IDSR) · MOH 505 weekly report · Edition 2020, reproduced in Kenya’s May 2022 guidelines.</p>
      <p className="mt-2 text-sm">Fictional aggregate counts only. No patient charts, Kenya Health Information System (KHIS) connection, or government submission.</p>
    </div>
    <div className="flex flex-wrap items-end gap-3">
      <div className="w-full max-w-sm space-y-2"><label htmlFor="idsr-week" className="text-sm font-medium">Sample reporting week</label>
        <Select value={id} onValueChange={next => { if (next !== 'cluster' && next !== 'zero') return; setId(next); setChecked(false); setError(''); }}>
          <SelectTrigger id="idsr-week"><SelectValue /></SelectTrigger><SelectContent>{IDSR_SAMPLES.map(item => <SelectItem value={item.id} key={item.id}>{item.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <Button variant="outline" onClick={() => { try { sampleReport(id); setChecked(true); setError(''); } catch { setError('Form validation failed; exports remain unavailable.'); setChecked(false); } }}><ClipboardCheck />Check sample report</Button>
      <Button variant="ghost" aria-label="Reset reporting rehearsal" title="Reset reporting rehearsal" onClick={() => { setId('cluster'); setChecked(false); setShowLabs(false); setError(''); }}><RotateCcw /></Button>
    </div>
    <dl className="grid gap-4 border-b border-border pb-5 text-sm sm:grid-cols-2 xl:grid-cols-4">
      <div><dt className="text-muted-foreground">Health facility</dt><dd className="font-medium">{report.facility}</dd></div>
      <div><dt className="text-muted-foreground">Epi week {report.epiWeek}</dt><dd>{report.start} — {report.end}</dd></div>
      <div><dt className="text-muted-foreground">Month / year · week-ending month</dt><dd>{report.month} {report.year}</dd></div>
      <div><dt className="text-muted-foreground">Sites reported / expected</dt><dd>{report.reported} / {report.expected} · fictional</dd></div>
    </dl>
    <p className="text-xs text-muted-foreground">County and sub-county are SAMPLE placeholders. The source specifies Monday–Sunday weeks and reporting the following Monday. Epi-week numbering and month assignment require current Kenyan confirmation.</p>
    <div className="overflow-x-auto"><Table>
      <TableHeader><TableRow><TableHead className="min-w-48">Disease, condition or event</TableHead><TableHead>&lt;5 cases</TableHead><TableHead>&lt;5 deaths</TableHead><TableHead>≥5 cases</TableHead><TableHead>≥5 deaths</TableHead></TableRow></TableHeader>
      <TableBody>{report.rows.map(row => <TableRow key={row.disease}><TableCell className="font-medium">{row.disease}</TableCell>{row.counts.map((count, col) => <TableCell key={col} className={count ? 'font-semibold text-mansagold' : 'text-muted-foreground'}>{count === null ? 'N/A' : count}</TableCell>)}</TableRow>)}</TableBody>
    </Table></div>
    <p className="text-xs text-muted-foreground">N/A mirrors blocked source-form cells; zeros are explicit fictional tallies. AEFI = adverse events following immunization; AFP = acute flaccid paralysis; SARI = severe acute respiratory infection; MDR/XDR TB = drug-resistant tuberculosis; VHF = viral hemorrhagic fever.</p>
    <div className="space-y-3 border-y border-border py-4">
      <Button variant="outline" onClick={() => setShowLabs(!showLabs)} aria-expanded={showLabs}>Laboratory surveillance</Button>
      {showLabs && <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Test</TableHead><TableHead>Measure</TableHead><TableHead>Age group</TableHead><TableHead>Sample count</TableHead></TableRow></TableHeader><TableBody>{report.labs.map((row, index) => <TableRow key={index}><TableCell>{row.disease}</TableCell><TableCell>{row.measure}</TableCell><TableCell>{row.age}</TableCell><TableCell>{row.value}</TableCell></TableRow>)}</TableBody></Table></div>}
      <p className="text-xs text-muted-foreground">All laboratory counts are fictional zeros. The printed malaria rapid-test column says “&gt;5”; age-five handling needs Kenyan clarification. No confirmed diagnoses are inferred.</p>
    </div>
    {checked && <p role="status" className="text-sm text-mansagold">Sample checks passed: disease mapping, age groups, whole counts and blocked cells. Not a clinician signature or regulatory approval.</p>}
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <div className="flex flex-wrap gap-3">
      <Button disabled={!checked} onClick={downloadCsv}><Download />Download sample CSV</Button>
      {checked ? <Button variant="outline" asChild><a href={`/downloads/idsr/1325-SAMPLE-MOH505-${id}.pdf`} download><Download />Download sample form PDF</a></Button> : <Button variant="outline" disabled><Download />Download sample form PDF</Button>}
      <Button variant="outline" disabled><Lock />Government submission · locked</Button>
    </div>
    <div className="space-y-2 text-xs text-muted-foreground">
      <p>PDF: source-form layout with fictional labels. CSV: review worksheet, not an approved KHIS import. Immediate notification, live alerts, vaccination registries and government acceptance remain unimplemented/unverified.</p>
      <Button variant="link" className="h-auto whitespace-normal p-0 text-left" asChild><a href={IDSR_SOURCE} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" />Official source · Annex 2H, printed pages 187–188</a></Button>
    </div>
  </section>;
}
