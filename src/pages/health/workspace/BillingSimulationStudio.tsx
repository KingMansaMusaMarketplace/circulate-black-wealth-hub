import { useEffect, useState } from 'react';
import { CheckCircle2, FileText, Loader2, Send, ShieldCheck, Sparkles, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { billingSimulation } from './billing-simulation';

type Step = 'idle' | 'running' | 'done';

export default function BillingSimulationStudio({ visitId }: { visitId: string }) {
  const sim = billingSimulation(visitId);
  const [coding, setCoding] = useState<Step>('idle');
  const [eligibility, setEligibility] = useState<Step>('idle');
  const [submit, setSubmit] = useState<Step>('idle');

  useEffect(() => { setCoding('idle'); setEligibility('idle'); setSubmit('idle'); }, [visitId]);

  const run = (set: (s: Step) => void, ms: number) => { set('running'); window.setTimeout(() => set('done'), ms); };
  const money = (n: number) => `$${n.toFixed(2)}`;

  return <section aria-label="Billing simulation studio" className="space-y-5 border-t border-border pt-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h3 className="text-lg font-semibold">Billing & coding simulation</h3><p className="text-sm text-muted-foreground">Rehearsal of the planned workflow · nothing is sent or saved</p></div>
      <Badge variant="outline" className="border-mansagold/40 text-mansagold">{sim.watermark}</Badge>
    </div>

    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-3 rounded-lg border border-border p-4">
        <div className="flex items-center justify-between"><h4 className="flex items-center gap-2 font-medium"><Sparkles className="h-4 w-4 text-mansagold" />1. Kayla's coding suggestions</h4>
          <Button size="sm" variant="outline" disabled={coding === 'running'} onClick={() => run(setCoding, 1200)}>{coding === 'running' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Simulate coding</Button></div>
        {coding === 'done' ? <ul className="space-y-2 text-sm">{sim.codes.map((c) => <li key={`${c.system}-${c.code ?? c.label}`} className="flex justify-between gap-3"><span><span className="font-mono text-mansagold">{c.system} {c.code ?? '—'}</span> · {c.label}</span><span className="shrink-0 text-xs text-muted-foreground">L{c.sourceLine}</span></li>)}
          <li className="pt-1 text-xs text-muted-foreground">Illustrative examples · a certified coder must review every code.</li></ul>
          : <p className="text-sm text-muted-foreground">Shows U.S. (ICD-10) and international (ICD-11) diagnosis codes plus visit codes, each linked to a transcript line.</p>}
      </div>

      <div className="space-y-3 rounded-lg border border-border p-4">
        <div className="flex items-center justify-between"><h4 className="flex items-center gap-2 font-medium"><ShieldCheck className="h-4 w-4 text-mansagold" />2. Insurance check</h4>
          <Button size="sm" variant="outline" disabled={eligibility === 'running'} onClick={() => run(setEligibility, 2000)}>{eligibility === 'running' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Simulate check</Button></div>
        {eligibility === 'done' ? <dl className="grid grid-cols-2 gap-2 text-sm"><dt className="text-muted-foreground">Plan</dt><dd>{sim.payer}</dd><dt className="text-muted-foreground">Member ID</dt><dd className="font-mono">{sim.memberId}</dd><dt className="text-muted-foreground">Status</dt><dd>{sim.eligibility.status}</dd><dt className="text-muted-foreground">Copay</dt><dd>{money(sim.eligibility.copay)}</dd><dt className="text-muted-foreground">Deductible left</dt><dd>{money(sim.eligibility.deductibleRemaining)}</dd></dl>
          : <p className="text-sm text-muted-foreground">Simulated answer in about two seconds. No real insurer is contacted.</p>}
      </div>
    </div>

    <div className="relative overflow-hidden rounded-lg border border-border p-4">
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center text-4xl font-bold uppercase tracking-widest text-mansagold/10 -rotate-12">Simulation</div>
      <h4 className="mb-3 flex items-center gap-2 font-medium"><FileText className="h-4 w-4 text-mansagold" />3. Claim form preview (CMS-1500 style)</h4>
      <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        <div><dt className="text-xs text-muted-foreground">Patient</dt><dd>{sim.patient} (fictional)</dd></div>
        <div><dt className="text-xs text-muted-foreground">Insured ID</dt><dd className="font-mono">{sim.memberId}</dd></div>
        <div><dt className="text-xs text-muted-foreground">Diagnosis (ICD-10)</dt><dd className="font-mono">{sim.codes.filter((c) => c.system === 'ICD-10-CM').map((c) => c.code).join(', ')}</dd></div>
        <div><dt className="text-xs text-muted-foreground">Services (CPT)</dt><dd className="font-mono">{sim.codes.filter((c) => c.system === 'CPT').map((c) => c.code).join(', ')}</dd></div>
        <div><dt className="text-xs text-muted-foreground">Billing provider</dt><dd>Sample Clinic (fictional)</dd></div>
        <div><dt className="text-xs text-muted-foreground">Sample total charge</dt><dd className="font-semibold">{money(sim.totalCharge)}</dd></div>
      </dl>
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-3">
        <Button size="sm" disabled={submit === 'running'} onClick={() => run(setSubmit, 1800)}>{submit === 'running' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}Simulate submission</Button>
        {submit === 'running' && <span className="text-sm text-muted-foreground">Checking claim for errors…</span>}
        {submit === 'done' && <span role="status" className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-mansagold" />Simulated: claim packet passed checks. Not sent to any insurer.</span>}
      </div>
    </div>

    <div className="rounded-lg border border-border p-4">
      <h4 className="mb-2 flex items-center gap-2 font-medium"><Target className="h-4 w-4 text-mansagold" />4. Medicare quality tracking (MIPS)</h4>
      <p className="text-sm"><span className="font-medium">{sim.mips.measure}:</span> {sim.mips.result}</p>
      <p className="mt-1 text-sm text-muted-foreground">{sim.mips.note} Real quality reporting stays locked.</p>
    </div>
  </section>;
}
