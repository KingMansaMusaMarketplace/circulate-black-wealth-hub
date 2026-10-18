import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useRows } from './hc';
import DataLoadErrors from './DataLoadErrors';
import { PILOT_FIELDS, type PilotChecklist } from '../../../../supabase/functions/health-kayla-review/pilot-policy';

const requirements: Record<typeof PILOT_FIELDS[number], { title: string; detail: string }> = {
  clinic_baa_reported: { title: 'Signed clinic agreement', detail: 'An attorney-reviewed Business Associate Agreement (BAA) with the clinic is signed.' },
  vendor_baas_reported: { title: 'Vendor agreement coverage', detail: 'The exact hosting, storage, AI, document-reading, backup and support services handling records have confirmed BAA coverage.' },
  attorney_review_reported: { title: 'Healthcare attorney clearance', detail: 'The attorney has reviewed the pilot’s scope, permitted record use, agreements and privacy obligations.' },
  safeguards_reported: { title: 'Verified healthcare safeguards', detail: 'Dedicated healthcare services, risk assessment, access controls, encryption, activity records, retention, incident response and tested recovery are ready for independent review.' },
  doctor_assigned_reported: { title: 'Doctor assigned to review', detail: 'A licensed doctor will check source-linked drafts, reconcile gaps and make all medical and legal conclusions.' },
};
const emptyChecklist = () => Object.fromEntries(PILOT_FIELDS.map(key => [key, false])) as PilotChecklist;

export default function PilotReadiness({ clinicId, clinicRole }: { clinicId: string; clinicRole: string }) {
  const requests = useRows('hc_pilot_requests', clinicId);
  const saved = requests.rows[0];
  const [checklist, setChecklist] = useState<PilotChecklist | null>(null);
  const values = checklist ?? (saved ? Object.fromEntries(PILOT_FIELDS.map(key => [key, saved[key] === true])) as PilotChecklist : emptyChecklist());
  const [saving, setSaving] = useState(false);
  const pending = useRef(false);
  const canSubmit = clinicRole === 'doctor' || clinicRole === 'owner';
  const save = async () => {
    if (pending.current || requests.error) return;
    pending.current = true;
    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke('health-kayla-review', { body: { action: 'pilot_request', clinic_id: clinicId, checklist: values } });
      if (error || data?.error) throw new Error(data?.error ?? error?.message ?? 'Could not submit readiness request');
      await requests.reload();
      toast.success('Readiness request saved. Patient data remains blocked.');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Request could not be saved'); }
    finally { pending.current = false; setSaving(false); }
  };
  return <section aria-label="Real-record pilot readiness" className="space-y-5 border-t pt-6">
    <DataLoadErrors sources={[requests]} />
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><h3 className="flex items-center gap-2 text-lg font-semibold"><ClipboardCheck className="h-5 w-5 text-mansagold" />Real-record pilot readiness</h3>
        <p className="mt-1 text-sm text-muted-foreground">Clinic readiness reports · Independent verification required</p></div>
      <Badge variant="outline">{saved ? 'Awaiting independent verification' : 'Not submitted'}</Badge>
    </div>
    <div className="flex gap-3 rounded-md border border-mansagold/30 bg-mansagold/5 p-4 text-sm">
      <Lock className="h-4 w-4 shrink-0 text-mansagold" /><div><p className="font-medium">Patient uploads remain locked—even with a signed clinic BAA.</p>
        <p className="mt-1 text-muted-foreground">Checking these items reports readiness only. It cannot approve this environment or enable records, processing or patient calls. Do not enter patient information or upload agreements here.</p></div>
    </div>
    <Button variant="outline" size="sm" asChild><Link to="/health/baa">Clinic BAA · Agreement preparation</Link></Button>
    <div className="divide-y">
      {PILOT_FIELDS.map(key => <label key={key} className="flex cursor-pointer items-start gap-3 py-4">
        <Checkbox aria-label={requirements[key].title} checked={values[key]} disabled={!canSubmit || saving || requests.loading} onCheckedChange={checked => setChecklist({ ...values, [key]: checked === true })} />
        <span className="min-w-0"><span className="block text-sm font-medium">{requirements[key].title}</span><span className="mt-1 block text-sm text-muted-foreground">{requirements[key].detail}</span></span>
      </label>)}
    </div>
    {canSubmit ? <Button variant="outline" disabled={saving || requests.loading} onClick={save}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{saved ? 'Update readiness request' : 'Submit readiness request'}</Button> : <p className="text-sm text-muted-foreground">Only a clinic doctor or owner can submit a readiness request.</p>}
    {saved && <p className="text-xs text-muted-foreground">Last reported {new Date(saved.updated_at).toLocaleString()} · Not an approval or compliance certification</p>}
    <div className="border-t pt-4"><h4 className="text-sm font-semibold">Pilot sequence after clearance</h4>
      <ol className="mt-3 grid gap-3 text-sm text-muted-foreground sm:grid-cols-4">
        <li><b className="block text-foreground">1 · Authorized intake</b>Case access and permitted use checked before secure intake.</li>
        <li><b className="block text-foreground">2 · Organize sources</b>Page-indexed records and treatment timeline.</li>
        <li><b className="block text-foreground">3 · Draft & flag gaps</b>Exact source links, missing records and conflicting entries.</li>
        <li><b className="block text-foreground">4 · Doctor review</b>Doctor verifies sources and requests changes before final conclusions.</li>
      </ol><p className="mt-4 text-xs text-muted-foreground">Planned real-record sequence; currently available only with the fictional case. Kayla is an AI assistant, not a doctorate holder or licensed clinician.</p>
    </div>
  </section>;
}