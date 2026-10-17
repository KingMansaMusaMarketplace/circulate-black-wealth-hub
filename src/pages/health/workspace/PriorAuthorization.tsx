import { useState } from 'react';
import { ClipboardCheck, FileSearch, Lock, RotateCcw, TriangleAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { findVisit } from './sample-visits';
import { AUTHORIZATION_VISIT_ID, AuthorizationPacket, prepareAuthorizationPacket } from './prior-authorization';

export default function PriorAuthorization() {
  const [packet, setPacket] = useState<AuthorizationPacket | null>(null);
  const [sourceLine, setSourceLine] = useState<number | null>(null);
  const [checked, setChecked] = useState<string[]>([]);
  const [error, setError] = useState('');
  const visit = findVisit(AUTHORIZATION_VISIT_ID);
  if (!visit) return <p role="alert">Fictional authorization sample unavailable.</p>;
  const reset = () => { setPacket(null); setChecked([]); setSourceLine(null); setError(''); };
  const prepare = () => {
    reset();
    try { setPacket(prepareAuthorizationPacket(AUTHORIZATION_VISIT_ID)); }
    catch { setError('The source could not be verified. No draft was prepared.'); }
  };
  const showSource = (line: number) => {
    setSourceLine(line);
    document.getElementById(`auth-source-${line}`)?.scrollIntoView({ block: 'nearest', behavior: 'auto' });
  };
  return <div className="space-y-6">
    <header className="flex flex-wrap items-start justify-between gap-4 border-b pb-5">
      <div className="min-w-0"><Badge variant="outline" className="mb-2 border-mansagold/40 text-mansagold">Fictional records only</Badge>
        <h2 className="text-xl font-semibold">Prior authorization packet</h2>
        <p className="mt-1 text-sm text-muted-foreground">Riley Demo · right-knee imaging · source-linked preparation draft</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" disabled><Lock className="mr-2 h-4 w-4" />Export packet</Button>
        <Button variant="outline" disabled><Lock className="mr-2 h-4 w-4" />Send to insurer</Button>
      </div>
    </header>
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={prepare}><ClipboardCheck className="mr-2 h-4 w-4" />Prepare fictional packet</Button>
      {packet && <Button variant="ghost" size="icon" aria-label="Clear packet" title="Clear packet" onClick={reset}><RotateCcw className="h-4 w-4" /></Button>}
    </div>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <div className="grid items-start gap-8 xl:grid-cols-2">
      <section aria-label="Authorization draft" className="min-w-0 space-y-6">
        {!packet ? <p className="text-sm text-muted-foreground">No draft prepared for this fictional visit.</p> : <>
          <div role="status" className="space-y-2 border-l-2 border-mansagold pl-3 text-sm">
            <p className="font-semibold">Draft — doctor review required</p>
            <p className="text-muted-foreground">Prepared from a fixed fictional transcript, not an AI medical-necessity decision. No insurer rules checked, no coverage or payment promised. Nothing is saved or sent.</p>
          </div>
          <section className="space-y-3"><h3 className="font-semibold">Supporting source excerpts</h3>
            {packet.evidence.map((item) => <div key={item.line} className="border-b pb-3">
              <div className="flex items-center justify-between gap-3"><h4 className="text-sm font-medium">{item.label}</h4>
                <Button variant="ghost" size="sm" className="shrink-0 text-mansagold" aria-label={`View source line ${item.line}`} onClick={() => showSource(item.line)}>L{item.line}<FileSearch className="ml-2 h-4 w-4" /></Button>
              </div><blockquote className="text-sm text-muted-foreground">{item.quote}</blockquote>
            </div>)}
          </section>
          <section className="space-y-3"><h3 className="flex items-center gap-2 font-semibold"><TriangleAlert className="h-4 w-4 text-mansagold" />Outstanding information</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">{packet.gaps.map((gap) => <li key={gap.id}>{gap.label}</li>)}</ul>
          </section>
          <fieldset className="space-y-3 border-t pt-4"><legend className="text-sm font-semibold">Review rehearsal — not a signature</legend>
            {[
              { id: 'sources', label: 'I compared the draft with the fictional source excerpts.' },
              { id: 'uncertainty', label: 'I checked that the suspected injury remains unconfirmed.' },
              { id: 'gaps', label: 'I reviewed the outstanding information.' },
            ].map((item) => <label key={item.id} className="flex items-start gap-3 text-sm"><input type="checkbox" className="mt-1 h-4 w-4 accent-primary" checked={checked.includes(item.id)} onChange={(event) => setChecked((prev) => event.target.checked ? [...prev, item.id] : prev.filter((id) => id !== item.id))} /><span>{item.label}</span></label>)}
            <p className="text-xs text-muted-foreground">{checked.length}/3 reviewed in this screen only. These checks do not sign, approve or unlock the packet.</p>
            <Button variant="outline" disabled><Lock className="mr-2 h-4 w-4" />Doctor signature unavailable</Button>
          </fieldset>
        </>}
      </section>
      <section aria-label="Authorization source" className="min-w-0 space-y-3 border-t pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
        <h3 className="flex items-center gap-2 font-semibold"><FileSearch className="h-4 w-4 text-mansagold" />Original fictional transcript</h3>
        <ol className="space-y-2 text-sm">{visit.lines.map((line, i) => <li key={i} id={`auth-source-${i + 1}`} aria-current={sourceLine === i + 1 ? 'true' : undefined} className={`scroll-mt-6 rounded-md border-l-2 px-3 py-2 ${sourceLine === i + 1 ? 'border-mansagold bg-mansagold/10' : 'border-transparent'}`}><span className="mr-2 text-xs text-muted-foreground">L{i + 1}</span>{line}</li>)}</ol>
      </section>
    </div>
  </div>;
}