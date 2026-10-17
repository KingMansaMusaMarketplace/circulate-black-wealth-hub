import { useState } from 'react';
import { Calendar, FileText, Lock, MessageSquare, Send, UserPlus } from 'lucide-react';
import logo1325 from '@/assets/1325-ai-logo.png';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SAMPLE_VISITS } from './sample-visits';
import { GuideLanguage } from './care-guide';
import { patientCommunication } from './patient-communication';

export default function PatientCommunication() {
  const [visitId, setVisitId] = useState<string>(SAMPLE_VISITS[0].id);
  const [language, setLanguage] = useState<GuideLanguage>('en');
  const [tab, setTab] = useState('message');
  const [source, setSource] = useState<number | null>(null);
  const state = patientCommunication(visitId, language);
  const showSource = (line: number) => {
    setSource(line);
    document.getElementById(`communication-source-${line}`)?.scrollIntoView({ block: 'nearest', behavior: 'auto' });
  };
  return <div className="space-y-6">
    <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
      <div><Badge variant="outline" className="mb-2 border-mansagold/40 text-mansagold">Fictional preview · not a live patient portal</Badge><h2 className="text-xl font-semibold">Patient communication</h2><p className="mt-1 text-sm text-muted-foreground">Source-linked drafts · no patient account connected</p></div>
      <img src={logo1325} alt="1325.AI" className="h-12 w-12 object-contain" />
    </header>
    <div role="note" className="flex gap-3 border-l-2 border-mansagold bg-mansagold/5 p-4 text-sm"><Lock className="h-5 w-5 shrink-0 text-mansagold" /><div><p className="font-medium">Live communication remains locked</p><p className="mt-1 text-muted-foreground">Attorney-approved agreements, written vendor coverage, verified healthcare safeguards and consent review are required. Doctor note signatures do not approve these drafts or unlock delivery.</p></div></div>
    <fieldset><legend className="mb-3 text-sm font-medium">Fictional visit</legend><div className="flex flex-wrap gap-2">{SAMPLE_VISITS.map((visit) => <Button key={visit.id} variant={visitId === visit.id ? 'default' : 'outline'} aria-pressed={visitId === visit.id} className="h-auto whitespace-normal text-left" onClick={() => { setVisitId(visit.id); setLanguage('en'); setSource(null); setTab('message'); }}>{visit.title}</Button>)}</div></fieldset>
    <dl className="grid gap-4 border-y border-border py-4 text-sm sm:grid-cols-3">{[['Doctor review', 'Unapproved'], ['Patient consent', 'Not verified'], ['Delivery', 'Not sent']].map(([label, value]) => <div key={label}><dt className="text-muted-foreground">{label}</dt><dd className="mt-1 font-medium">{value}</dd></div>)}</dl>
    <div className="grid items-start gap-8 xl:grid-cols-2">
      <section aria-label="Fictional communication preview" className="min-w-0 space-y-5">
        <Tabs value={tab} onValueChange={(value) => { setTab(value); setSource(null); }}>
          <TabsList className="grid h-auto w-full grid-cols-3"><TabsTrigger value="message" className="whitespace-normal"><MessageSquare className="mr-1 h-4 w-4 shrink-0" />Message</TabsTrigger><TabsTrigger value="guide" className="whitespace-normal"><FileText className="mr-1 h-4 w-4 shrink-0" />Care guide</TabsTrigger><TabsTrigger value="reminder" className="whitespace-normal"><Calendar className="mr-1 h-4 w-4 shrink-0" />Follow-up</TabsTrigger></TabsList>
          <TabsContent value="message" className="space-y-4 pt-3"><h3 className="font-semibold">Patient’s words from the sample visit</h3><p className="text-xs text-muted-foreground">Transcript excerpt — not a received portal message</p><blockquote className="border-l-2 border-mansagold pl-4 text-sm">{state.message.quote}</blockquote><Button variant="outline" size="sm" onClick={() => showSource(state.message.line)}>View source L{state.message.line}</Button><p className="text-sm text-muted-foreground">No reply prepared. Care-team assignment, urgency review and response procedures are not validated.</p></TabsContent>
          <TabsContent value="guide" className="space-y-4 pt-3"><h3 className="font-semibold">Care guide draft — not for patient use</h3><div className="flex gap-2"><Button variant={language === 'en' ? 'default' : 'outline'} aria-pressed={language === 'en'} onClick={() => { setLanguage('en'); setSource(null); }}>English</Button><Button variant={language === 'es' ? 'default' : 'outline'} aria-pressed={language === 'es'} onClick={() => { setLanguage('es'); setSource(null); }}>Español</Button></div><div lang={language} className="space-y-3">{[state.guide.summary, ...state.guide.plan].map((item) => <Button key={item.line} variant="ghost" className="h-auto w-full justify-between gap-3 whitespace-normal text-left text-sm font-normal" onClick={() => showSource(item.line)}><span>{item.text}</span><span className="shrink-0 text-xs text-mansagold">L{item.line}</span></Button>)}<ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">{state.guide.gaps.map((gap) => <li key={gap.code}>{gap.text}</li>)}</ul></div>{language === 'es' && <p className="text-xs text-muted-foreground">Sample translation requires qualified bilingual clinical review.</p>}</TabsContent>
          <TabsContent value="reminder" className="space-y-4 pt-3"><h3 className="font-semibold">Follow-up preparation — not scheduled</h3>{state.followUp.length ? state.followUp.map((item) => <div key={item.line} className="space-y-3"><p className="text-sm">{item.text}</p><Button size="sm" variant="outline" onClick={() => showSource(item.line)}>View source L{item.line}</Button></div>) : <p className="text-sm text-muted-foreground">No follow-up timing is supplied in this transcript.</p>}<p className="text-sm text-muted-foreground">Visit date, appointment date, recipient and communication preferences are not supplied. No reminder has been scheduled.</p></TabsContent>
        </Tabs>
        <div className="flex flex-wrap gap-2 border-t border-border pt-4"><Button variant="outline" disabled><Send className="mr-2 h-4 w-4" />Send message</Button><Button variant="outline" disabled><Calendar className="mr-2 h-4 w-4" />Schedule reminder</Button><Button variant="outline" disabled><UserPlus className="mr-2 h-4 w-4" />Invite patient</Button></div>
      </section>
      <section aria-label="Communication source transcript" className="min-w-0 space-y-3 border-t border-border pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0"><h3 className="font-semibold">Original fictional transcript</h3><p className="text-xs text-muted-foreground">Undated sample · no portal messages received</p><ol className="space-y-2 text-sm">{state.visit.lines.map((line, index) => <li key={`${visitId}:${index}`} id={`communication-source-${index + 1}`} aria-current={source === index + 1 ? 'true' : undefined} className={`rounded-md border-l-2 px-3 py-2 ${source === index + 1 ? 'border-mansagold bg-mansagold/10' : 'border-transparent'}`}><span className="mr-2 text-xs text-muted-foreground">L{index + 1}</span>{line}</li>)}</ol></section>
    </div>
  </div>;
}