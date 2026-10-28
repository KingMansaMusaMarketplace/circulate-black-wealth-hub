import { useState } from 'react';
import { FileCheck2, Lock, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SHA_PILOT_VERSION, shaSample, validateShaSample, rehearseShaReview, type ShaScenario } from './sha-claims';

export default function ShaClaimsPilot() {
  const [scenario, setScenario] = useState<ShaScenario>('complete');
  const [check, setCheck] = useState<ReturnType<typeof validateShaSample> | null>(null);
  const [review, setReview] = useState<ReturnType<typeof rehearseShaReview> | null>(null);
  const packet = shaSample(scenario);
  const reset = () => { setCheck(null); setReview(null); };
  const options: { id: ShaScenario; label: string }[] = [
    { id: 'complete', label: 'Complete sample' }, { id: 'missing-document', label: 'Missing document' },
    { id: 'coverage-unknown', label: 'Unknown coverage' },
  ];
  return <section aria-label="Kenya SHA claims pilot" className="space-y-5 border-t border-border pt-6">
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div><h3 className="text-lg font-semibold">Kenya Social Health Authority claims</h3><p className="text-sm text-muted-foreground">Separate claims rehearsal · not national health exchange validation</p></div>
      <Badge variant="outline">Fictional local pilot</Badge>
    </header>
    <div role="note" className="border-l-2 border-mansagold bg-mansagold/5 p-4 text-sm">
      <p className="font-medium">No SHA connection, verified coverage or payment</p>
      <p className="mt-1 text-muted-foreground">Fixed invented examples only. These fields are our local rehearsal format, not an official SHA claim form. KES 1,000 is an illustrative amount, not an SHA tariff. Official schema validation and authorized SHA testing remain outstanding.</p>
    </div>
    <fieldset><legend className="mb-3 text-sm font-medium">Fictional claims scenario</legend><div className="flex flex-wrap gap-2">{options.map(option => <Button key={option.id} variant={scenario === option.id ? 'default' : 'outline'} aria-pressed={scenario === option.id} onClick={() => { setScenario(option.id); reset(); }}>{option.label}</Button>)}</div></fieldset>
    <dl className="grid gap-4 border-y border-border py-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
      {Object.entries({ 'Sample member': packet.sampleMember, 'Sample facility': packet.sampleFacility, 'Sample service date': packet.serviceDate, 'Sample service': packet.service, 'Illustrative charge': 'KES 1,000 · not a tariff', 'Sample document': packet.documents[0] ?? 'Missing', 'Actual eligibility': 'Not checked', 'Actual claim status': 'Not submitted', 'Actual payment': 'Unknown · no payment record' }).map(([label, value]) => <div key={label} className="min-w-0"><dt className="text-muted-foreground">{label}</dt><dd className="mt-1 break-words font-medium">{value}</dd></div>)}
    </dl>
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => { setCheck(validateShaSample(packet)); setReview(null); }}><FileCheck2 className="mr-2 h-4 w-4" />Check fictional packet</Button>
      <Button variant="outline" disabled={!check?.locallyComplete} onClick={() => setReview(rehearseShaReview(packet, 'pending'))}>Rehearse pending review</Button>
      <Button variant="outline" disabled={!check?.locallyComplete} onClick={() => setReview(rehearseShaReview(packet, 'return'))}>Rehearse returned packet</Button>
      <Button variant="ghost" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" />Reset claims rehearsal</Button>
    </div>
    {check && <div role="status" className="space-y-2 text-sm"><p className="font-medium">{check.locallyComplete ? 'Local sample checks passed — not SHA validation' : 'Local sample blocked'}</p>{check.issues.map(issue => <p key={issue}>{issue}</p>)}<p className="text-muted-foreground">Official schema: unverified · SHA acceptance: untested · Nothing sent or saved.</p></div>}
    {review && <p role="status" className="border-l-2 border-mansagold pl-3 text-sm">{review.status} · scripted example, not a response from SHA.</p>}
    <div className="flex flex-wrap gap-2 border-t border-border pt-4"><Button variant="outline" disabled><Lock className="mr-2 h-4 w-4" />Send to SHA</Button><Button variant="outline" disabled>Export SHA claim</Button><Button variant="outline" disabled>Record reimbursement</Button></div>
    <p className="text-xs text-muted-foreground">Local fixture {SHA_PILOT_VERSION} · No patient entry, uploads, storage or government transport.</p>
    <section aria-label="Published SHA integration checklist" className="space-y-3 border-t border-border pt-4">
      <h4 className="font-semibold">Official integration work still required</h4>
      <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground"><li>Authorized test tenant, facility and synthetic beneficiary identifiers; eligibility and benefit checks.</li><li>Patient consent and authorization testing. No actual consent, one-time code or biometric is collected here.</li><li>Approved intervention codes, benefit rules, pricing and preauthorization where applicable.</li><li>Claim dispatch, payer adjudication and remittance testing. Pending is not paid.</li></ul>
      <p className="text-sm text-muted-foreground">Published start-visit fields include <code>patient_id</code>, <code>service_type</code>, <code>intervention_codes</code> and <code>otp</code>. Authorization uses <code>interventions</code> instead. These endpoint-specific contracts are not validated by our local packet checks.</p>
      <div className="flex flex-wrap gap-4 text-xs"><a className="underline" href="https://hie-docs.dha.go.ke/docs/claims/getting-started/introduction" target="_blank" rel="noreferrer">Official claims workflow</a><a className="underline" href="https://hie-docs.dha.go.ke/eclaims/start-visit-consent" target="_blank" rel="noreferrer">Start-visit contract</a><a className="underline" href="https://hie-docs.dha.go.ke/eclaims/authorizations" target="_blank" rel="noreferrer">Authorization contract</a></div>
    </section>
    <p className="text-xs text-muted-foreground">Certification requirement: <a className="underline" href="https://certification.dha.go.ke/faq" target="_blank" rel="noreferrer">DHA certification FAQ</a>. Claims integration must be tested separately from national exchange connectivity.</p>
  </section>;
}