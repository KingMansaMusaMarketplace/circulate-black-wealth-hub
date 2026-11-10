import { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { ShieldCheck, Stethoscope, LockKeyhole } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import logo from '@/assets/1325-ai-logo.png';
import ClinicalSiteBack from './ClinicalSiteBack';
import { pilotRequestSchema, type PilotForm } from './pilot-signup';

const fields: { key: keyof PilotForm; label: string; type?: string; hint?: string }[] = [
  { key: 'full_name', label: 'Full name' },
  { key: 'work_email', label: 'Email', type: 'email' },
  { key: 'phone', label: 'Phone', type: 'tel' },
  { key: 'role', label: 'Role (e.g. Physician, Nurse Practitioner)' },
  { key: 'specialty', label: 'Specialty' },
  { key: 'organization', label: 'Practice or hospital name' },
  { key: 'practice_location', label: 'City, State / Country' },
  { key: 'npi', label: 'NPI (optional)', hint: 'Your 10-digit National Provider Identifier, if you have one.' },
];

export default function ClinicalPilotSignupPage() {
  const [form, setForm] = useState<PilotForm>({ full_name: '', work_email: '', phone: '', role: '', specialty: '', organization: '', practice_location: '', npi: '' });
  const [testOnly, setTestOnly] = useState(false);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [notificationFailed, setNotificationFailed] = useState(false);
  const pending = useRef(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (pending.current) return;
    setError('');
    const parsed = pilotRequestSchema.safeParse(form);
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Check the required fields.'); return; }
    if (!testOnly) { setError('Please agree to use made-up test patients only.'); return; }
    if (!consent) { setError('Please accept the confidentiality terms.'); return; }
    pending.current = true; setBusy(true);
    try {
      const { data, error: failure } = await supabase.functions.invoke('health-access', {
        body: { action: 'request', source: 'pilot', ...parsed.data, npi: parsed.data.npi || undefined, test_only: true, nda: true },
      });
      if (failure || data?.ok !== true) {
        const response = failure instanceof FunctionsHttpError ? await failure.context.json().catch(() => null) : data;
        throw new Error(typeof response?.error === 'string' ? response.error : 'Your request could not be confirmed. Please try again.');
      }
      setNotificationFailed(data.notification_accepted === false);
      setSent(true);
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Your request could not be confirmed. Please try again.'); }
    finally { pending.current = false; setBusy(false); }
  };

  return <div className="theme-clinical dark min-h-screen bg-background text-foreground">
    <Helmet><title>Join the 1325 Clinical Pilot | health.1325.ai</title><meta name="description" content="Doctors: request access to test 1325 Clinical EMR / EHR with made-up test patients." /></Helmet>
    <header className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-6"><img src={logo} alt="1325.AI" className="h-10 w-10 rounded" /><div><p className="font-semibold">1325 Clinical EMR / EHR</p><p className="text-xs text-muted-foreground">Private preview · sample data only</p></div></header>
    <div className="mx-auto max-w-5xl px-6"><ClinicalSiteBack /></div>
    <main className="mx-auto grid max-w-5xl gap-12 px-6 py-10 md:grid-cols-2">
      <section>
        <p className="text-sm font-semibold text-primary">PILOT PROGRAM</p>
        <h1 className="mt-3 text-4xl font-display leading-tight">Join the 1325 Clinical Pilot</h1>
        <p className="mt-4 text-lg text-muted-foreground">Help shape the Agentic AI EMR / EHR built for independent doctors. Test the full workflow in about 15 minutes.</p>
        <ul className="mt-8 space-y-4 text-sm">
          <li className="flex gap-3"><Stethoscope className="h-5 w-5 shrink-0 text-primary" />Add a test patient, dictate and sign a note, book a visit and practice billing.</li>
          <li className="flex gap-3"><LockKeyhole className="h-5 w-5 shrink-0 text-primary" /><span><strong className="text-foreground">Test patients only.</strong> Never enter real patient names, birth dates or Social Security numbers.</span></li>
          <li className="flex gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-primary" />Thomas personally reviews every request. Submitting does not grant access.</li>
        </ul>
      </section>
      <section className="min-w-0">
        {sent ? <div role="status" className="space-y-4 border-l-2 border-primary py-5 pl-6">
          <ShieldCheck className="h-10 w-10 text-primary" />
          <h2 className="text-2xl font-semibold">Thank you, Doctor</h2>
          <p>You'll get an email once Thomas approves your pilot access.</p>
          <p className="text-sm text-muted-foreground">Please check your Spam or Junk folder too.</p>
          {notificationFailed && <p role="alert" className="text-sm text-primary">Your request is saved, but the notification to Thomas was not confirmed. Please email Partner@1325.AI. Do not submit again.</p>}
        </div> : <form onSubmit={submit} className="space-y-4" noValidate>
          <h2 className="text-2xl font-semibold">Request pilot access</h2>
          {fields.map(f => <div key={f.key} className="space-y-1.5">
            <Label htmlFor={`pilot-${f.key}`}>{f.label}</Label>
            <Input id={`pilot-${f.key}`} type={f.type ?? 'text'} value={form[f.key]} maxLength={f.key === 'npi' ? 10 : 160} inputMode={f.key === 'npi' ? 'numeric' : undefined} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
            {f.hint && <p className="text-xs text-muted-foreground">{f.hint}</p>}
          </div>)}
          <label className="flex items-start gap-3 text-sm"><Checkbox checked={testOnly} onCheckedChange={v => setTestOnly(v === true)} aria-label="I will use made-up test patients only" /><span>I will use made-up test patients only.</span></label>
          <label className="flex items-start gap-3 text-sm"><Checkbox checked={consent} onCheckedChange={v => setConsent(v === true)} aria-label="I accept the confidentiality terms" /><span>I will keep the preview private and confidential and won't copy or share it.</span></label>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={busy} className="w-full">{busy ? 'Sending…' : 'Request pilot access'}</Button>
        </form>}
      </section>
    </main>
  </div>;
}
