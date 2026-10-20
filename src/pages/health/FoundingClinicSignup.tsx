import { useState } from 'react';
import { z } from 'zod';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export const foundingClinicSchema = z.object({
  clinic_name: z.string().trim().min(2, 'Enter your clinic name.').max(160),
  country: z.string().trim().min(2, 'Enter your country.').max(80),
  contact_name: z.string().trim().min(2, 'Enter your name.').max(120),
  email: z.string().trim().email('Enter a valid email.').max(255),
  practice_type: z.enum(['independent_practice', 'hospital_department', 'global_clinic'], { errorMap: () => ({ message: 'Choose a practice type.' }) }),
  clinician_count: z.coerce.number().int().min(1, 'Enter how many clinicians.').max(100000),
  letter_of_intent: z.boolean(),
});

const types = [['independent_practice', 'Independent practice'], ['hospital_department', 'Hospital department'], ['global_clinic', 'Global clinic / diaspora network']] as const;

export default function FoundingClinicSignup() {
  const [f, setF] = useState({ clinic_name: '', country: '', contact_name: '', email: '', practice_type: '', clinician_count: '' });
  const [loi, setLoi] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof f, v: string) => setF(p => ({ ...p, [k]: v }));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); if (busy) return; setError('');
    const parsed = foundingClinicSchema.safeParse({ ...f, letter_of_intent: loi });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Check the fields.'); return; }
    setBusy(true);
    const { error: failure } = await supabase.from('hc_founding_clinics' as never).insert(parsed.data as never);
    setBusy(false);
    if (failure) setError('We could not save your request. Please try again.'); else setSent(true);
  };
  const field = (k: 'clinic_name' | 'country' | 'contact_name' | 'email', label: string, type = 'text') => <div className="space-y-2"><Label htmlFor={`fc-${k}`}>{label}</Label><Input id={`fc-${k}`} type={type} required maxLength={k === 'email' ? 255 : 160} value={f[k]} onChange={e => set(k, e.target.value)} disabled={busy} /></div>;
  return <section id="founding" className="border-y border-border bg-card scroll-mt-6">
    <div className="mx-auto grid max-w-6xl gap-12 px-6 py-14 lg:grid-cols-2">
      <div>
        <p className="flex items-center gap-2 text-sm text-primary"><Sparkles className="h-4 w-4" />FOUNDING CLINICS</p>
        <h2 className="mt-3 text-3xl font-display">Become a Founding Clinic.</h2>
        <ul className="mt-7 space-y-4 text-sm">
          <li className="flex gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-primary" />Early access when 1325 Clinical opens.</li>
          <li className="flex gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-primary" />A voice in what we build next.</li>
          <li className="flex gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-primary" />Special founding pricing once country prices are announced.</li>
        </ul>
        <p className="mt-8 text-sm text-muted-foreground">Joining is free and non-binding. No payment is collected. No launch date is promised.</p>
      </div>
      <div className="min-w-0">{sent ? <div role="status" className="space-y-4 border-l-2 border-primary pl-6 py-5"><ShieldCheck className="h-10 w-10 text-primary" /><h3 className="text-2xl font-semibold">You're on the Founding Clinic list</h3><p className="text-sm text-muted-foreground">Thomas will be in touch. No payment has been taken.</p></div> :
        <form onSubmit={submit} className="space-y-5">
          <h3 className="text-2xl font-semibold">Join the Founding Clinic list</h3>
          <p className="text-sm text-muted-foreground">Clinic details only. Do not include patient information.</p>
          {field('clinic_name', 'Clinic name')}
          <div className="grid gap-5 sm:grid-cols-2">{field('country', 'Country')}{field('contact_name', 'Your name')}</div>
          {field('email', 'Work email', 'email')}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="fc-type">Practice type</Label><select id="fc-type" required value={f.practice_type} disabled={busy} onChange={e => set('practice_type', e.target.value)} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="">Select</option>{types.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
            <div className="space-y-2"><Label htmlFor="fc-count">Number of clinicians</Label><Input id="fc-count" type="number" min={1} max={100000} required value={f.clinician_count} onChange={e => set('clinician_count', e.target.value)} disabled={busy} /></div>
          </div>
          <div className="flex items-start gap-3"><Checkbox id="fc-loi" checked={loi} onCheckedChange={v => setLoi(v === true)} disabled={busy} className="mt-1 shrink-0" /><Label htmlFor="fc-loi" className="text-xs font-normal leading-relaxed text-muted-foreground">We intend to use 1325 Clinical at launch (non-binding letter of intent). This is not a purchase or a contract.</Label></div>
          {error && <p role="alert" className="text-sm text-destructive-foreground">{error}</p>}
          <Button type="submit" disabled={busy} className="w-full">{busy ? 'Sending…' : 'Join as a Founding Clinic'}</Button>
        </form>}
      </div>
    </div>
  </section>;
}
