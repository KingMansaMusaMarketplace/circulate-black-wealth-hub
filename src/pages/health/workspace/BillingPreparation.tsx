import { useState } from 'react';
import { FileSearch, Lock, Receipt, Send, ShieldCheck } from 'lucide-react';
import logo1325 from '@/assets/1325-ai-logo.png';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SAMPLE_VISITS } from './sample-visits';
import { billingPreparation } from './billing-preparation';

export default function BillingPreparation() {
  const [visitId, setVisitId] = useState<string>(SAMPLE_VISITS[0].id);
  const [stage, setStage] = useState('eligibility');
  const [source, setSource] = useState<number | null>(null);
  const state = billingPreparation(visitId);
  const showSource = (line: number) => {
    setSource(line);
    document.getElementById(`billing-source-${line}`)?.scrollIntoView({ block: 'nearest', behavior: 'auto' });
  };
  return <div className="space-y-6">
    <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5"><div><Badge variant="outline" className="mb-2 border-mansagold/40 text-mansagold">Fictional preparation only</Badge><h2 className="text-xl font-semibold">Billing preparation</h2><p className="mt-1 text-sm text-muted-foreground">Documentation evidence · no coverage or payment approval</p></div><img src={logo1325} alt="1325.AI" className="h-12 w-12 object-contain" /></header>
    <div role="note" className="flex gap-3 border-l-2 border-mansagold bg-mansagold/5 p-4 text-sm"><Lock className="h-5 w-5 shrink-0 text-mansagold" /><div><p className="font-medium">Insurance, claims and payments remain locked</p><p className="mt-1 text-muted-foreground">Live use requires healthcare clearance, approved providers and qualified billing review. A doctor’s note signature does not verify coverage, authorize a claim or guarantee payment.</p></div></div>
    <fieldset><legend className="mb-3 text-sm font-medium">Fictional visit</legend><div className="flex flex-wrap gap-2">{SAMPLE_VISITS.map((visit) => <Button key={visit.id} variant={visitId === visit.id ? 'default' : 'outline'} aria-pressed={visitId === visit.id} className="h-auto whitespace-normal text-left" onClick={() => { setVisitId(visit.id); setStage('eligibility'); setSource(null); }}>{visit.title}</Button>)}</div></fieldset>
    <dl className="grid gap-4 border-y border-border py-4 text-sm sm:grid-cols-3">{state.stages.map((item) => <div key={item.id}><dt className="text-muted-foreground">{item.title}</dt><dd className="mt-1 font-medium">{item.status}</dd></div>)}</dl>
    <div className="grid items-start gap-8 xl:grid-cols-2">
      <section aria-label="Billing preparation review" className="min-w-0 space-y-5">
        <Tabs value={stage} onValueChange={(next) => { setStage(next); setSource(null); }}><TabsList className="grid h-auto w-full grid-cols-3">{state.stages.map((item) => <TabsTrigger key={item.id} value={item.id} className="whitespace-normal">{item.title}</TabsTrigger>)}</TabsList>{state.stages.map((item) => <TabsContent key={item.id} value={item.id} className="space-y-4 pt-3"><h3 className="font-semibold">{item.title} — {item.status.toLowerCase()}</h3><ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">{item.requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}</ul>{item.id === 'claim' && <><div className="space-y-2 border-t border-border pt-4"><h4 className="font-semibold">Source evidence for review</h4>{state.documentation.found.map((finding) => <Button key={finding.line} variant="ghost" className="h-auto w-full justify-between gap-3 whitespace-normal text-left text-sm font-normal" aria-label={`View source L${finding.line}: ${finding.label}`} onClick={() => showSource(finding.line)}><span>{finding.label}</span><span className="shrink-0 text-xs text-mansagold">L{finding.line}</span></Button>)}</div><h4 className="font-semibold">Documentation gaps — not payer requirements</h4><ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">{state.documentation.missing.map((gap) => <li key={gap.code}>{gap.label}</li>)}</ul><p className="text-xs text-muted-foreground">No diagnosis codes, procedure codes, visit levels or claim amounts proposed. Findings remain unapproved.</p></>}{item.id === 'payment' && <dl className="grid grid-cols-2 gap-3 text-sm">{['Charges', 'Paid amount', 'Patient responsibility', 'Claim identifier'].map((label) => <div key={label}><dt className="text-muted-foreground">{label}</dt><dd>Not supplied</dd></div>)}</dl>}</TabsContent>)}</Tabs>
        <div className="flex flex-wrap gap-2 border-t border-border pt-4"><Button variant="outline" disabled><ShieldCheck className="mr-2 h-4 w-4" />Check insurance</Button><Button variant="outline" disabled><Send className="mr-2 h-4 w-4" />Submit claim</Button><Button variant="outline" disabled><Receipt className="mr-2 h-4 w-4" />Collect payment</Button><Button variant="outline" disabled><Lock className="mr-2 h-4 w-4" />Export claim</Button></div>
      </section>
      <section aria-label="Billing source transcript" className="min-w-0 space-y-3 border-t border-border pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0"><h3 className="flex items-center gap-2 font-semibold"><FileSearch className="h-4 w-4 text-mansagold" />Original fictional transcript</h3><p className="text-xs text-muted-foreground">Undated sample · no insurer response or payment record</p><ol className="space-y-2 text-sm">{state.visit.lines.map((line, index) => <li key={`${visitId}:${index}`} id={`billing-source-${index + 1}`} aria-current={source === index + 1 ? 'true' : undefined} className={`rounded-md border-l-2 px-3 py-2 ${source === index + 1 ? 'border-mansagold bg-mansagold/10' : 'border-transparent'}`}><span className="mr-2 text-xs text-muted-foreground">L{index + 1}</span>{line}</li>)}</ol></section>
    </div>
  </div>;
}