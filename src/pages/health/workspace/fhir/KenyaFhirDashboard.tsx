import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, FileCheck2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFacilityStatuses } from './facility-status';
import { facilityReference } from './pilot';

export default function KenyaFhirDashboard({ checked, downloaded }: { checked: boolean; downloaded: boolean }) {
  const [selected, setSelected] = useState<string | null>(null);
  const facilities = getFacilityStatuses(checked, downloaded);
  const active = facilities.find(f => f.id === selected);
  return <section aria-label="Kenya exchange facility dashboard" className="space-y-4">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><h4 className="flex items-center gap-2 font-semibold"><FileCheck2 className="h-4 w-4" />Facility export status</h4>
        <p className="mt-1 text-xs text-muted-foreground">Recorded sample evidence · no live facility exchange</p></div>
      <span className="flex items-center gap-2 text-sm text-mansagold"><AlertTriangle className="h-4 w-4" />1 tested fictional packet · 9 warnings</span>
    </div>
    <div className="overflow-x-auto border-y border-border">
      <table className="w-full min-w-[720px] text-left text-sm">
        <caption className="sr-only">Facility exports and recorded whole-packet validation results</caption>
        <thead className="text-xs text-muted-foreground"><tr>{['Facility', 'Export status', 'Read-back', 'Recorded validation', 'Findings'].map(title => <th key={title} scope="col" className="px-3 py-3 font-medium">{title}</th>)}</tr></thead>
        <tbody>{facilities.map(f => <tr key={f.id} className="border-t border-border align-top">
          <th scope="row" className="max-w-[250px] break-words px-3 py-4 font-medium">{f.name}<span className="mt-1 block text-xs font-normal text-muted-foreground">{f.kind}<br />{f.identifier}</span></th>
          <td className="px-3 py-4">{f.exportStatus}<span className="mt-1 block text-xs text-muted-foreground">{f.transport}</span></td>
          <td className="px-3 py-4">{f.readBack}</td>
          <td className="px-3 py-4">{f.validationDate ?? 'Not run'}<span className="mt-1 block text-xs text-muted-foreground">{f.errors === null ? 'Errors / warnings unknown' : `${f.errors} errors · ${f.warnings} warnings`}</span></td>
          <td className="px-3 py-3"><Button variant="ghost" size="sm" aria-label={`View findings for ${f.name}`} aria-expanded={selected === f.id} aria-controls="kenya-facility-findings" onClick={() => setSelected(selected === f.id ? null : f.id)}>{selected === f.id ? <ChevronUp className="mr-1 h-4 w-4" /> : <ChevronDown className="mr-1 h-4 w-4" />}Details</Button></td>
        </tr>)}</tbody>
      </table>
    </div>
    {active && <div id="kenya-facility-findings" className="space-y-3 border-l-2 border-border pl-4" aria-label={`${active.name} findings`}>
      <h5 className="font-medium">{active.name} — recorded findings</h5>
      {active.id === 'fictional' ? <>
        <p className="text-xs text-muted-foreground">Whole five-resource packet, not facility-only performance. Warnings include patient, observation, organization and professional resources. No fresh validator run or official acceptance.</p>
        <ol className="space-y-3">{active.findings.map((issue, index) => <li key={index} className="text-sm">
          <span className={issue.severity === 'warning' ? 'font-medium text-mansagold' : 'font-medium text-muted-foreground'}>{index + 1}. {issue.severity}</span>
          <p className="mt-1 break-words">{issue.details.text}</p><p className="mt-1 break-all text-xs text-muted-foreground">{issue.expression.join(' · ')}</p>
        </li>)}</ol>
      </> : <><p className="text-sm">No export or validation has been tested for this real facility. Findings are unknown—not zero.</p><p className="text-xs text-muted-foreground">{facilityReference.scope}</p><a className="text-sm text-mansagold underline" href={facilityReference.source} target="_blank" rel="noreferrer">Official registry reference</a></>}
    </div>}
  </section>;
}