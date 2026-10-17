import { useState } from 'react';
import { Archive, ArrowRightLeft, ListChecks, Lock, RotateCcw } from 'lucide-react';
import logo1325 from '@/assets/1325-ai-logo.png';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { enterpriseReliability } from './enterprise-reliability';

export default function EnterpriseReliability() {
  const [area, setArea] = useState('backup');
  const state = enterpriseReliability();
  return <div className="space-y-6">
    <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5"><div><Badge variant="outline" className="mb-2 border-mansagold/40 text-mansagold">Preparation only · unverified operations</Badge><h2 className="text-xl font-semibold">Backup, recovery &amp; clinic migration</h2><p className="mt-1 text-sm text-muted-foreground">Independent evidence required before live clinical use</p></div><img src={logo1325} alt="1325.AI" className="h-12 w-12 object-contain" /></header>
    <div role="note" className="flex gap-3 border-l-2 border-mansagold bg-mansagold/5 p-4 text-sm"><Lock className="h-5 w-5 shrink-0 text-mansagold" /><div><p className="font-medium">Real records and transfer tools remain locked</p><p className="mt-1 text-muted-foreground">These requirements are not proof of working backups, tested recovery or approved migration. Clinic access, signed agreements and doctor note signatures do not activate these services.</p></div></div>
    <dl className="grid gap-4 border-y border-border py-4 text-sm sm:grid-cols-3">{state.areas.map((item) => <div key={item.id}><dt className="text-muted-foreground">{item.title}</dt><dd className="mt-1 font-medium">{item.status}</dd></div>)}</dl>
    <Tabs value={area} onValueChange={setArea}>
      <TabsList className="grid h-auto w-full grid-cols-3">{state.areas.map((item) => <TabsTrigger key={item.id} value={item.id} className="whitespace-normal">{item.title}</TabsTrigger>)}</TabsList>
      {state.areas.map((item) => <TabsContent key={item.id} value={item.id} className="pt-5"><div className="grid items-start gap-8 xl:grid-cols-2">
        <section aria-label={`${item.title} requirements`} className="min-w-0 space-y-4"><h3 className="flex items-center gap-2 font-semibold"><ListChecks className="h-4 w-4 text-mansagold" />Requirements for independent review</h3><ul className="list-disc space-y-3 pl-5 text-sm text-muted-foreground">{item.requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}</ul><dl className="grid gap-4 border-t border-border pt-4 text-sm sm:grid-cols-2">{item.evidence.map((label) => <div key={label}><dt className="text-muted-foreground">{label}</dt><dd className="mt-1">Not supplied or verified</dd></div>)}</dl></section>
        <section aria-label={`${item.title} planned sequence`} className="min-w-0 space-y-4 border-t border-border pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0"><h3 className="font-semibold">Planned sequence — not executed</h3><ol className="space-y-3">{item.steps.map((step, index) => <li key={step} className="flex gap-3 border-b border-border pb-3 text-sm"><span className="shrink-0 font-medium text-mansagold">{index + 1}.</span><div><p>{step}</p><p className="mt-1 text-xs text-muted-foreground">Not performed or approved</p></div></li>)}</ol><p className="text-xs text-muted-foreground">No uptime promise, recovery-time target, data-loss target or successful transfer is asserted.</p></section>
      </div></TabsContent>)}
    </Tabs>
    <div className="flex flex-wrap gap-2 border-t border-border pt-4"><Button variant="outline" disabled={!state.canBackUp}><Archive className="mr-2 h-4 w-4" />Run backup</Button><Button variant="outline" disabled={!state.canRestore}><RotateCcw className="mr-2 h-4 w-4" />Restore records</Button><Button variant="outline" disabled={!state.canImport}><ArrowRightLeft className="mr-2 h-4 w-4" />Import clinic records</Button><Button variant="outline" disabled={!state.canApprove}><Lock className="mr-2 h-4 w-4" />Approve cutover</Button></div>
  </div>;
}