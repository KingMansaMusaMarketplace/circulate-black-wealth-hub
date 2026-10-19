import { useState } from 'react';
import { Lock, Mic, Inbox, ClipboardCheck, PenLine } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DELEGATION_CHART, DELEGATION_PATIENT, DRAFT_ORDERS, INBOX_ITEMS, LOCKED_ACTIONS, SPOKEN_REQUEST, STANDING_RULES, routedCounts } from './delegation-desk';

const ANSWER = { yes: 'Yes — found in chart', no: 'No — not on medication list', unknown: 'Unknown — not found, ask the patient' } as const;

export default function DelegationDesk() {
  const [drafted, setDrafted] = useState(false);
  const [signed, setSigned] = useState(false);
  const [source, setSource] = useState<number | null>(null);
  const counts = routedCounts();
  return <div className="space-y-8">
    <header>
      <Badge variant="outline" className="mb-2 text-mansagold">Fictional rehearsal only</Badge>
      <h2 className="text-xl font-semibold">Delegation Desk — give the doctor a team again</h2>
      <p className="mt-1 text-sm text-muted-foreground">The doctor decides; the team and Kayla prepare the clicks. Nothing is sent, booked or saved. Sample patient: {DELEGATION_PATIENT}.</p>
    </header>

    <section aria-label="Spoken order requests" className="space-y-4">
      <h3 className="flex items-center gap-2 font-semibold"><Mic className="h-4 w-4 text-mansagold" />1. Spoken order requests</h3>
      <blockquote className="border-l-2 border-mansagold pl-4 text-sm italic">“{SPOKEN_REQUEST}”</blockquote>
      <p className="text-xs text-muted-foreground">Fixed sample request. Live microphone use stays locked until healthcare clearance.</p>
      <Button onClick={() => { setDrafted(true); setSigned(false); }} disabled={drafted}><ClipboardCheck className="mr-2 h-4 w-4" />{drafted ? 'Drafts prepared' : 'Prepare draft orders'}</Button>
      {drafted && <div className="space-y-4">
        {DRAFT_ORDERS.map((order) => <div key={order.id} className="rounded-md border border-border p-4">
          <div className="flex flex-wrap items-center justify-between gap-2"><div><Badge variant="secondary" className="mr-2">{order.kind}</Badge><span className="font-medium">{order.summary}</span></div><Badge variant="outline">{signed ? 'Sample sign-off (not sent)' : 'Draft — awaiting doctor'}</Badge></div>
          <p className="mt-1 text-xs text-muted-foreground">{order.timing}</p>
          <h4 className="mt-3 text-sm font-medium">3. Order questions answered from the chart</h4>
          <ul className="mt-2 space-y-1 text-sm">{order.questions.map((q) => <li key={q.question} className="flex flex-wrap gap-2"><span className="text-muted-foreground">{q.question}</span><span className="font-medium">{ANSWER[q.answer]}</span>{q.sourceLine !== null && <Button variant="link" className="h-auto p-0 text-mansagold" onClick={() => setSource(q.sourceLine)}>Source L{q.sourceLine}</Button>}</li>)}</ul>
        </div>)}
        <Button onClick={() => setSigned(true)} disabled={signed}><PenLine className="mr-2 h-4 w-4" />{signed ? 'Batch signed in rehearsal' : 'Doctor reviews and signs all 3 (rehearsal)'}</Button>
        {signed && <p className="text-sm text-muted-foreground">Rehearsal only: no order or prescription was sent, and nothing was saved.</p>}
      </div>}
      {source !== null && <section aria-label="Chart source" className="rounded-md border border-border p-3 text-sm"><div className="mb-2 flex justify-between"><span className="font-medium">Fictional chart excerpts</span><Button variant="ghost" size="sm" onClick={() => setSource(null)}>Close source</Button></div><ol className="space-y-1">{DELEGATION_CHART.map((line, i) => <li key={i} className={`rounded p-1 ${i + 1 === source ? 'bg-mansagold/15' : ''}`}><span className="mr-2 text-mansagold">L{i + 1}</span>{line}</li>)}</ol></section>}
    </section>

    <section aria-label="Inbox sorting" className="space-y-4">
      <h3 className="flex items-center gap-2 font-semibold"><Inbox className="h-4 w-4 text-mansagold" />2. Inbox sorting by the doctor's standing rules</h3>
      <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">{STANDING_RULES.map((r) => <li key={r}>{r}</li>)}</ul>
      <p className="text-sm"><strong>{counts.staff}</strong> of {INBOX_ITEMS.length} sample items go to staff under the rules; <strong>{counts.doctor}</strong> need the doctor.</p>
      <div className="grid gap-4 md:grid-cols-2">
        {(['staff_protocol', 'doctor_judgment'] as const).map((route) => <div key={route} className="rounded-md border border-border p-4"><h4 className="mb-2 font-medium">{route === 'staff_protocol' ? 'Staff prepares — doctor signs' : 'Needs the doctor'}</h4><ul className="space-y-2 text-sm">{INBOX_ITEMS.filter((i) => i.route === route).map((i) => <li key={i.id}><span className="font-medium">{i.type}:</span> {i.text}<div className="text-xs text-muted-foreground">Why: {i.reason}</div></li>)}</ul></div>)}
      </div>
    </section>

    <div className="flex flex-wrap gap-2 border-t border-border pt-4">{LOCKED_ACTIONS.map((a) => <Button key={a} variant="outline" disabled><Lock className="mr-2 h-4 w-4" />{a}</Button>)}</div>
    <p className="text-xs text-muted-foreground">Kayla is an Agentic AI assistant, not a licensed clinician. Standing rules shown are illustrative and must be set by the practice and its advisers. No interaction screening, ordering, prescribing or patient messaging is connected.</p>
  </div>;
}
