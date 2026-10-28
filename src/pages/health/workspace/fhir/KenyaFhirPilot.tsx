import { useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import outcome from './validator-outcome.json';
import originalBundle from './sample-bundle-original.json';
import { originalOutcome, WARNING_REVIEW } from './warning-review';
import KenyaFhirDashboard from './KenyaFhirDashboard';
import { prepareFacilityReExport } from './facility-status';
import { checkFictionalRoundTrip, downloadPilotFile, exportFictionalBundle, facilityReference, manifest } from './pilot';

export default function KenyaFhirPilot() {
  const [checked, setChecked] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const issues = outcome.issue;
  const errors = issues.filter(issue => issue.severity === 'error' || issue.severity === 'fatal').length;
  const warnings = issues.filter(issue => issue.severity === 'warning').length;
  const reExport = (facilityId: string) => {
    const packet = prepareFacilityReExport(facilityId, checked);
    downloadPilotFile(packet.content, packet.filename);
    setDownloaded(true);
  };
  return <section aria-label="Kenya FHIR fictional export pilot" className="space-y-4 border-y border-border py-5">
    <h3 className="font-semibold">Kenya FHIR fictional export pilot</h3>
    <p className="text-sm text-muted-foreground">Kenya Core {manifest.version} · FHIR {manifest.fhirVersion} · HL7 validator {manifest.validatorVersion}</p>
    <KenyaFhirDashboard checked={checked} downloaded={downloaded} onReExport={reExport} />
    <p className="text-sm">Five independent fictional resources: Patient, temperature Observation (36.8 °C), Organization, Practitioner and PractitionerRole. All patient, facility and professional identifiers are unissued test placeholders. No real care, professional registration or national connection.</p>
    <dl className="grid gap-2 text-sm sm:grid-cols-2">
      <dt className="text-muted-foreground">Published Kenya facility category</dt><dd className="break-words">GP-GENERAL-PRACTITIONER-SITE</dd>
      <dt className="text-muted-foreground">Published Kenya professional role</dt><dd className="break-words">GENERAL-PRACTITIONER · General practitioner</dd>
      <dt className="text-muted-foreground">Published Kenya specialty</dt><dd className="break-words">MEDICAL-DOCTOR · Medical Doctor</dd>
    </dl>
    <p className="text-xs text-muted-foreground">These exact codes come from the pinned guide. They classify fictional examples, not a verified person's license. Organization, Practitioner and role are inactive. The observation performer is explicitly fictional; no actual measurement or professional service occurred. No real phone, address or qualification added.</p>
    <details className="text-sm"><summary className="cursor-pointer">Separate public facility reference — not fictional care</summary>
      <p className="mt-2">{facilityReference.name} · {facilityReference.codeLabel}: {facilityReference.code}</p>
      <p className="mt-2 text-muted-foreground">{facilityReference.scope} Verified public record: {facilityReference.verifiedOn}. Its registry code is not mapped to a DHA facility identifier.</p>
      <a href={facilityReference.source} target="_blank" rel="noreferrer" className="underline">Official Kenya Master Health Facility Registry record</a>
    </details>
    <p className="text-sm text-mansagold">Recorded profile validation: {errors} errors, {warnings} warnings. Terminology-enabled rerun on {manifest.validatedOn}; two facility identifier findings remain. Not DHA certification.</p>
    <details className="text-sm"><summary className="cursor-pointer">Nine-warning correction walkthrough — 7 resolved, 2 open</summary><ol className="mt-3 space-y-3">{WARNING_REVIEW.map(item => <li key={item.number}><p className="font-medium">{item.number}. {item.area} — {item.status}</p><p className="mt-1 text-muted-foreground">{item.action}</p></li>)}</ol><p className="mt-3 text-xs text-muted-foreground">Original: 0 errors / 9 warnings, terminology disabled. Current: 0 errors / 2 warnings, terminology enabled. Original fingerprint difference was escaped versus literal Unicode formatting, not different clinical content; both fingerprints retained.</p></details>
    <details className="text-sm"><summary className="cursor-pointer">Recorded validator findings</summary><ul className="mt-3 space-y-2">{issues.map((issue, index) => <li key={index} className="break-words text-muted-foreground">{issue.severity}: {issue.details.text}</li>)}</ul></details>
    <p className="text-xs text-muted-foreground">The guide's facility identifier slice conflicts with its packaged terminology address and standard identifier binding. Both warnings remain visible pending publisher clarification. No conflicting standard coding or invented alias retained. The guide is marked notForPublication; national acceptance remains unverified. Browser checking is fixed-fixture read-back, not a fresh HL7 run. Public terminology checking is not a Kenya exchange connection.</p>
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => { checkFictionalRoundTrip(exportFictionalBundle()); setChecked(true); }}><CheckCircle2 className="mr-2 h-4 w-4" />Check fictional read-back</Button>
      <Button variant="outline" disabled={!checked} onClick={() => reExport('fictional')}><Download className="mr-2 h-4 w-4" />Download fictional FHIR</Button>
      <Button variant="outline" onClick={() => downloadPilotFile(JSON.stringify({ manifest, outcome, originalOutcome, originalBundle, warningReview: WARNING_REVIEW, facilityReference }, null, 2), '1325-fhir-validation-evidence.json')}><Download className="mr-2 h-4 w-4" />Download validation evidence</Button>
    </div>
    {checked && <p role="status" className="text-sm">All five fictional resources, identifiers, role codes, value, unit, timestamp and references read back unchanged.</p>}
    <a href="https://fhir.dha.go.ke/ig/core/index.html" target="_blank" rel="noreferrer" className="text-sm text-mansagold underline">Pinned guide source</a>
  </section>;
}