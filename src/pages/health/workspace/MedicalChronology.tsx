import { useState } from 'react';
import { AlertTriangle, Calendar, FileText, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SAMPLE_CASE_ID } from '../../../../supabase/functions/health-kayla-review/sample-case';
import { buildSampleChronology, EventKind, filterChronology } from './chronology';

const FILTERS: { key: EventKind | 'all'; label: string }[] = [
  { key: 'all', label: 'All records' }, { key: 'history', label: 'History' },
  { key: 'incident', label: 'Incident' }, { key: 'imaging', label: 'Imaging' },
  { key: 'therapy', label: 'Therapy' }, { key: 'follow_up', label: 'Follow-up' },
  { key: 'index', label: 'Undated index' },
];

export default function MedicalChronology() {
  const [chronology] = useState(() => buildSampleChronology(SAMPLE_CASE_ID));
  const [kind, setKind] = useState<EventKind | 'all'>('all');
  const [sourcePage, setSourcePage] = useState<number | null>(null);
  const [quote, setQuote] = useState('');
  const source = chronology.events.find((event) => event.page === sourcePage);
  const events = filterChronology(chronology.events, kind);
  const openSource = (page: number, excerpt = '') => {
    setSourcePage(page); setQuote(excerpt);
    requestAnimationFrame(() => document.getElementById('chronology-source')?.scrollIntoView({ block: 'nearest', behavior: 'auto' }));
  };
  return <div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-5">
      <div><Badge variant="outline" className="mb-2 border-mansagold/40 text-mansagold">Fictional case · Jordan Sample</Badge>
        <h2 className="text-xl font-semibold">Medical chronology</h2>
        <p className="mt-1 text-sm text-muted-foreground">Draft for doctor review · Fixed record excerpts · Not an AI medical opinion</p>
      </div>
      <Button variant="outline" disabled><Lock className="mr-2 h-4 w-4" />Import real records</Button>
    </div>
    <dl className="grid gap-4 border-b pb-5 text-sm sm:grid-cols-3">
      <div><dt className="text-muted-foreground">Dated records</dt><dd className="mt-1 font-semibold">5 · January 10 – May 20, 2025</dd></div>
      <div><dt className="text-muted-foreground">Undated records</dt><dd className="mt-1 font-semibold">1 bundle index</dd></div>
      <div><dt className="text-muted-foreground">Review status</dt><dd className="mt-1 font-semibold text-mansagold">Awaiting physician review · Not saved</dd></div>
    </dl>
    <Tabs value={kind} onValueChange={(value) => { const filter = FILTERS.find((item) => item.key === value); if (filter) setKind(filter.key); }}>
      <TabsList aria-label="Record type" className="flex h-auto flex-wrap justify-start gap-1">{FILTERS.map((filter) => <TabsTrigger key={filter.key} value={filter.key}>{filter.label}</TabsTrigger>)}</TabsList>
    </Tabs>
    <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <section aria-label="Medical event timeline" className="min-w-0">
        <h3 className="mb-4 flex items-center gap-2 font-semibold"><Calendar className="h-4 w-4 text-mansagold" />Record timeline</h3>
        <ol className="space-y-5 border-l-2 border-mansagold/40 pl-5">{events.map((event) => <li key={event.page} className="space-y-2 border-b pb-5">
          <p className="text-sm font-semibold text-mansagold">{event.date ?? 'Date not stated · outside dated timeline'}</p>
          <h4 className="font-semibold">{event.title}</h4>
          <p className="text-sm leading-relaxed">{event.text}</p>
          <Button variant="link" className="h-auto px-0" onClick={() => openSource(event.page)}><FileText className="mr-2 h-4 w-4" />Source · page {event.page}</Button>
        </li>)}</ol>
        <p className="mt-4 text-xs text-muted-foreground">Dates describe the included records only. No causation, disability or legal conclusion is supplied.</p>
      </section>
      <div className="min-w-0 space-y-6">
        {source && <section id="chronology-source" aria-label="Chronology source page" className="scroll-mt-4 rounded-md border border-mansagold/40 bg-muted/30 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-semibold">Page {source.page} · {source.file}</h3><Button variant="ghost" size="sm" onClick={() => { setSourcePage(null); setQuote(''); }}>Close source</Button></div>
          <p className="mb-3 text-xs text-muted-foreground">Record date: {source.date ?? 'Not stated'} · Fictional</p>
          {quote && <blockquote className="mb-3 border-l-2 border-mansagold pl-3 text-sm font-medium">{quote}</blockquote>}
          <p className="break-words text-sm leading-relaxed">{source.text}</p>
        </section>}
        <section aria-label="Chronology review flags" className="space-y-4">
          <h3 className="flex items-center gap-2 font-semibold"><AlertTriangle className="h-4 w-4 text-mansagold" />Gaps & differences to reconcile</h3>
          {chronology.flags.map((flag) => <div key={flag.title} className="space-y-2 border-b pb-4">
            <h4 className="text-sm font-semibold">{flag.title}</h4><p className="text-sm text-muted-foreground">{flag.detail}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">{flag.sources.map((citation, index) => <Button key={index} size="sm" variant="link" className="h-auto px-0" aria-label={`${flag.title}: source page ${citation.page}, excerpt ${index + 1}`} onClick={() => openSource(citation.page, citation.quote)}>Page {citation.page} · excerpt {index + 1}</Button>)}</div>
          </div>)}
        </section>
      </div>
    </div>
  </div>;
}