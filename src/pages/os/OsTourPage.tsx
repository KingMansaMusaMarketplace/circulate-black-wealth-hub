import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { FlagshipHeader, FlagshipFooter } from '@/components/homepage/FlagshipChrome';
import { OS_STATIONS, OS_TOOL_COUNT } from './os-stations';
import '@/components/homepage/flagship.css';

const empty = { name: '', company: '', role: '', email: '', phone: '' };

export default function OsTourPage() {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const valid = form.name.trim() && form.company.trim() && /\S+@\S+\.\S+/.test(form.email.trim());

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || status === 'sending') return;
    setStatus('sending');
    const message = [`1325 OS walkthrough request`, `Company: ${form.company.trim()}`, `Role: ${form.role.trim() || '—'}`, `Phone: ${form.phone.trim() || '—'}`].join('\n');
    const { error } = await supabase.from('contact_submissions').insert([{ id: crypto.randomUUID(), name: form.name.trim(), email: form.email.trim().toLowerCase(), message, inquiry_type: 'general' }]);
    setStatus(error ? 'error' : 'sent');
  };

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="flagship font-body">
      <Helmet>
        <title>Tour the 1325 Operating System | 1325.AI</title>
        <meta name="description" content="Request a private, approved walkthrough of the 1325 Operating System: Kayla, marketing, payments, finance, legal and community tools in one place." />
      </Helmet>
      <FlagshipHeader />
      <main className="flagship-content py-16 grid gap-12 lg:grid-cols-[1.1fr_1fr]">
        <section>
          <p className="text-primary text-sm font-medium mb-4">PRIVATE WALKTHROUGH · SAMPLE BUSINESS ONLY</p>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-6">See the full 1325 Operating System.</h1>
          <p className="text-muted-foreground text-lg mb-8">{OS_TOOL_COUNT} tools across six stations, run by Kayla. Request access and our team will review your request.</p>
          <ul className="grid sm:grid-cols-2 gap-3">
            {OS_STATIONS.map((s, i) => <li key={s.id} className="border border-border rounded-lg p-4"><span className="text-primary text-xs">STATION {i + 1}</span><p className="font-medium mt-1">{s.title}</p><p className="text-muted-foreground text-sm mt-1">{s.tools.length} tools</p></li>)}
          </ul>
        </section>
        <section className="border border-border rounded-xl p-6 md:p-8 bg-card self-start">
          {status === 'sent' ? (
            <div className="text-center py-8">
              <CheckCircle2 className="mx-auto h-12 w-12 text-primary mb-4" />
              <h2 className="text-2xl font-semibold mb-3">Request received</h2>
              <p className="text-muted-foreground mb-6">Our team will review it and email you when your walkthrough is approved. Please check your Spam or Junk folder too.</p>
              <Button asChild variant="outline"><Link to="/">Back to home</Link></Button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="flex items-center gap-2 mb-2"><Lock className="h-4 w-4 text-primary" /><h2 className="text-xl font-semibold">Request access</h2></div>
              <div><Label htmlFor="os-name">Full name *</Label><Input id="os-name" value={form.name} onChange={set('name')} maxLength={100} required /></div>
              <div><Label htmlFor="os-company">Business or organization *</Label><Input id="os-company" value={form.company} onChange={set('company')} maxLength={150} required /></div>
              <div><Label htmlFor="os-role">Your role</Label><Input id="os-role" value={form.role} onChange={set('role')} maxLength={100} /></div>
              <div><Label htmlFor="os-email">Business email *</Label><Input id="os-email" type="email" value={form.email} onChange={set('email')} maxLength={255} required /></div>
              <div><Label htmlFor="os-phone">Phone</Label><Input id="os-phone" type="tel" value={form.phone} onChange={set('phone')} maxLength={30} /></div>
              {status === 'error' && <p className="text-destructive text-sm">Your request could not be sent. Please try again or call 1-312-900-6004.</p>}
              <Button type="submit" className="w-full flagship-action" disabled={!valid || status === 'sending'}>{status === 'sending' ? 'Sending…' : <>Request my walkthrough <ArrowRight /></>}</Button>
              <p className="text-xs text-muted-foreground">The walkthrough uses a sample business only. U.S. Provisional Patent Application No. 63/969,202 — 46 claims pending.</p>
            </form>
          )}
        </section>
      </main>
      <FlagshipFooter />
    </div>
  );
}
