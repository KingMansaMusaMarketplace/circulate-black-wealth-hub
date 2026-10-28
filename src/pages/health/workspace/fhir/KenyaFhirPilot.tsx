import { useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import outcome from './validator-outcome.json';
import { checkFictionalRoundTrip, downloadPilotFile, exportFictionalBundle, facilityReference, manifest } from './pilot';

export default function KenyaFhirPilot() {
  const [checked, setChecked] = useState(false);
  const issues = outcome.issue;
  const errors = issues.filter(issue => issue.severity === 'error' || issue.severity === 'fatal').length;
  const warnings = issues.filter(issue => issue.severity === 'warning').length;
  return <section aria-label="Kenya FHIR fictional export pilot" className="space-y-4 border-y border-border py-5">
    <h3 className="font-semibold">Kenya FHIR fictional export pilot</h3>
    <p className="text-sm text-muted-foreground">Kenya Core {manifest.version} · FHIR {manifest.fhirVersion} · HL7 validator {manifest.validatorVersion}</p>
    <p className="text-sm">Five independent fictional resources: Patient, temperature Observation (36.8 °C), Organization, Practitioner and PractitionerRole. All patient, facility and professional identifiers are unissued test placeholders. No real care, professional registration or national connection.</p>
    <dl className="grid gap-2 text-sm sm:grid-cols-2">
      <dt className="text-muted-foreground">Published Kenya facility category</dt><dd className="break-words">GP-GENERAL-PRACTITIONER-SITE</dd>
      <dt className="text-muted-foreground">Published Kenya professional role</dt><dd className="break-words">GENERAL-PRACTITIONER · General practitioner</dd>
      <dt className="text-muted-foreground">Published Kenya specialty</dt><dd className="break-words">MEDICAL-DOCTOR · Medical Doctor</dd>
    </dl>
    <p className="text-xs text-muted-foreground">These exact codes come from the pinned guide. They classify fictional examples, not a verified person's license. Organization, Practitioner and role are marked inactive. No invented phone, address, qualification or observation performer.</p>
    <details className="text-sm"><summary className="cursor-pointer">Separate public facility reference — not fictional care</summary>
      <p className="mt-2">{facilityReference.name} · {facilityReference.codeLabel}: {facilityReference.code}</p>
      <p className="mt-2 text-muted-foreground">{facilityReference.scope} Verified public record: {facilityReference.verifiedOn}. Its registry code is not mapped to a DHA facility identifier.</p>
      <a href={facilityReference.source} target="_blank" rel="noreferrer" className="underline">Official Kenya Master Health Facility Registry record</a>
    </details>
    <p className="text-sm text-mansagold">Recorded profile validation: {errors} errors, {warnings} warnings. Terminology service disabled; code/unit verification remains incomplete. Not DHA certification.</p>
    <details className="text-sm"><summary className="cursor-pointer">Recorded validator findings</summary><ul className="mt-3 space-y-2">{issues.map((issue, index) => <li key={index} className="break-words text-muted-foreground">{issue.severity}: {issue.details.text}</li>)}</ul></details>
    <p className="text-xs text-muted-foreground">Narrative and performer warnings are retained. The guide's facility identifier slice uses a CodeSystem address different from its packaged terminology address; that unresolved warning is not silently remapped. The guide is marked notForPublication; national acceptance remains unverified. Browser checking is a fixed-fixture read-back, not a fresh HL7 run.</p>
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => { checkFictionalRoundTrip(exportFictionalBundle()); setChecked(true); }}><CheckCircle2 className="mr-2 h-4 w-4" />Check fictional read-back</Button>
      <Button variant="outline" disabled={!checked} onClick={() => downloadPilotFile(exportFictionalBundle(), '1325-fictional-kenya-fhir.json')}><Download className="mr-2 h-4 w-4" />Download fictional FHIR</Button>
      <Button variant="outline" onClick={() => downloadPilotFile(JSON.stringify({ manifest, outcome, facilityReference }, null, 2), '1325-fhir-validation-evidence.json')}><Download className="mr-2 h-4 w-4" />Download validation evidence</Button>
    </div>
    {checked && <p role="status" className="text-sm">All five fictional resources, identifiers, role codes, value, unit, timestamp and references read back unchanged.</p>}
    <a href="https://fhir.dha.go.ke/ig/core/index.html" target="_blank" rel="noreferrer" className="text-sm text-mansagold underline">Pinned guide source</a>
  </section>;
}