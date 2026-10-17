import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Lock, ShieldCheck, FileSearch, Mic, Stethoscope } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import logo1325 from '@/assets/1325-ai-logo.png';

const KEY = 'hc_preview_access';
const DEVICE_KEY = 'hc_preview_device';
const SESSION_KEY = 'hc_preview_session_end';
const SESSION_MS = 45 * 60 * 1000;
const schema = z.object({
  full_name: z.string().trim().min(2, 'Enter your full name').max(120),
  organization: z.string().trim().min(2, 'Enter your clinic or organization').max(160),
  role: z.string().trim().min(2, 'Choose your role').max(80),
  work_email: z.string().trim().email('Enter a valid work email').max(255),
  phone: z.string().trim().min(7, 'Enter your phone number').max(40),
});

function deviceId() {
  let d = localStorage.getItem(DEVICE_KEY);
  if (!d || !/^[a-f0-9]{32}$/.test(d)) {
    d = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('');
    localStorage.setItem(DEVICE_KEY, d);
  }
  return d;
}

type Reason = 'none' | 'expired' | 'device' | 'invalid';
const MESSAGES: Record<Exclude<Reason, 'none'>, string> = {
  expired: 'Your 7-day access window has ended. Please request access again.',
  device: 'This private link is already in use on another device. Links cannot be shared — please request your own access.',
  invalid: 'This access link is no longer active. Please request access again.',
};

export default function HealthAccessGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<'checking' | 'locked' | 'open' | 'timeout'>('checking');
  const [reason, setReason] = useState<Reason>('none');
  const [endsAt, setEndsAt] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [isAdmin, setIsAdmin] = useState(false);

  const verify = (startNew: boolean) => {
    const token = localStorage.getItem(KEY);
    if (!token) { setState('locked'); return; }
    setState('checking');
    supabase.functions.invoke('health-access', { body: { action: 'verify', token, device: deviceId(), path: window.location.pathname } })
      .then(({ data }) => {
        if (data?.ok) {
          const saved = Number(localStorage.getItem(SESSION_KEY) || 0);
          const end = !startNew && saved > Date.now() ? saved : Date.now() + SESSION_MS;
          localStorage.setItem(SESSION_KEY, String(end));
          setEndsAt(end); setNow(Date.now()); setState('open');
        } else {
          localStorage.removeItem(KEY); localStorage.removeItem(SESSION_KEY);
          setReason((data?.reason as Reason) ?? 'invalid'); setState('locked');
        }
      })
      .catch(() => setState('locked'));
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const fromUrl = url.searchParams.get('access');
    if (fromUrl) {
      localStorage.setItem(KEY, fromUrl);
      url.searchParams.delete('access');
      window.history.replaceState({}, '', url.toString());
    }
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      if (s.session) {
        const { data } = await supabase.functions.invoke('health-access', { body: { action: 'admin' } });
        if (data?.ok) { setIsAdmin(true); setState('open'); return; }
      }
      const saved = Number(localStorage.getItem(SESSION_KEY) || 0);
      if (localStorage.getItem(KEY) && saved && saved <= Date.now()) { setState('timeout'); return; }
      verify(false);
    })();
  }, []);

  useEffect(() => {
    if (state !== 'open' || isAdmin) return;
    const i = setInterval(() => {
      const t = Date.now(); setNow(t);
      if (t >= endsAt) setState('timeout');
    }, 1000);
    return () => clearInterval(i);
  }, [state, endsAt, isAdmin]);

  if (state === 'open' && isAdmin) return <>{children}<div className="fixed top-3 right-3 z-[9999] rounded-full px-3 py-1.5 text-xs font-semibold shadow-lg border" style={{ background: '#001a33', color: '#FFB300', borderColor: '#FFB300' }}><ShieldCheck className="inline h-3 w-3 mr-1" />Admin access</div></>;
  if (state === 'open') {
    const left = Math.max(0, endsAt - now);
    const m = Math.floor(left / 60000), s = Math.floor((left % 60000) / 1000);
    return (
      <>
        {children}
        <div className="fixed top-3 right-3 z-[9999] rounded-full px-3 py-1.5 text-xs font-semibold shadow-lg border"
          style={{ background: '#001a33', color: left < 5 * 60000 ? '#ff8a80' : '#FFB300', borderColor: '#FFB300' }}
          aria-live="polite">
          <Lock className="inline h-3 w-3 mr-1" />Private session · {m}:{String(s).padStart(2, '0')}
        </div>
      </>
    );
  }
  if (state === 'timeout') return <SessionEnded onResume={() => verify(true)} />;
  if (state === 'checking') return <div className="min-h-screen bg-[hsl(var(--background))]" />;
  return <Teaser notice={reason !== 'none' ? MESSAGES[reason] : ''} />;
}

function SessionEnded({ onResume }: { onResume: () => void }) {
  return (
    <div className="min-h-screen grid place-items-center px-6" style={{ background: 'linear-gradient(160deg,#001a33,#003366 60%,#001a33)', color: '#fff' }}>
      <div className="max-w-md text-center rounded-2xl p-8 border" style={{ borderColor: 'rgba(255,179,0,0.4)', background: 'rgba(0,0,0,0.35)' }}>
        <Lock className="h-10 w-10 mx-auto mb-4" style={{ color: '#FFB300' }} />
        <h1 className="text-2xl font-semibold mb-2">Your 45-minute session has ended</h1>
        <p className="opacity-80 mb-6">For confidentiality, screens lock after 45 minutes. If your access is still active, you can start a new session on this device.</p>
        <Button onClick={onResume} className="font-semibold" style={{ background: '#FFB300', color: '#001a33' }}>Start a new 45-minute session</Button>
      </div>
    </div>
  );
}

function Teaser({ notice = "" }: { notice?: string }) {
  const [form, setForm] = useState({ full_name: '', organization: '', role: '', work_email: '', phone: '' });
  const [nda, setNda] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const p = schema.safeParse(form);
    if (!p.success) { setError(p.error.issues[0].message); return; }
    if (!nda) { setError('Please accept the confidentiality terms.'); return; }
    setBusy(true);
    const { data, error: err } = await supabase.functions.invoke('health-access', { body: { action: 'request', ...p.data, nda: true } });
    setBusy(false);
    if (err || !data?.ok) { setError(data?.error ?? 'Something went wrong. Please try again.'); return; }
    setSent(true);
  };

  const features = [
    { icon: FileSearch, t: 'Record review co-pilot', d: 'Organizes long medical records into source-linked drafts for physician review.' },
    { icon: Mic, t: 'AI note-taking', d: 'Drafts visit notes where every line points back to what was said.' },
    { icon: Stethoscope, t: 'Doctor stays in charge', d: 'Nothing is final until a physician reviews and signs.' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg,#001a33,#003366 60%,#001a33)', color: '#fff' }}>
      <Helmet>
        <title>1325 Clinical — Private Physician Preview</title>
        <meta name="description" content="1325 Clinical is an invitation-only AI clinical co-pilot for record review and note-taking." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="mx-auto max-w-6xl px-6 py-12 grid gap-12 lg:grid-cols-2 items-start">
        <div>
          <img src={logo1325} alt="1325.AI" className="h-12 mb-8" />
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs mb-6" style={{ borderColor: '#FFB300', color: '#FFB300' }}>
            <Lock className="h-3 w-3" /> Private Physician Preview · By invitation only
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">1325 Clinical</h1>
          <p className="text-lg opacity-85 mb-8">An AI-powered clinical co-pilot that helps physicians review records and document visits faster — with every finding linked to its source.</p>
          <div className="space-y-5">
            {features.map(({ icon: I, t, d }) => (
              <div key={t} className="flex gap-4">
                <I className="h-6 w-6 shrink-0" style={{ color: '#FFB300' }} />
                <div><div className="font-semibold">{t}</div><div className="text-sm opacity-75">{d}</div></div>
              </div>
            ))}
          </div>
          <a href={`/auth?redirect=${encodeURIComponent(window.location.pathname)}`} className="mt-8 inline-block text-xs underline opacity-70">Admin sign in</a>
          <p className="mt-6 text-xs opacity-60">U.S. Provisional Patent Application No. 63/969,202 — 46 claims pending. Preview uses fictional sample data only.</p>
        </div>

        <div className="rounded-2xl p-8 border" style={{ background: 'rgba(0,0,0,0.35)', borderColor: 'rgba(255,179,0,0.4)' }}>
          {sent ? (
            <div className="text-center py-10">
              <ShieldCheck className="h-12 w-12 mx-auto mb-4" style={{ color: '#FFB300' }} />
              <h2 className="text-2xl font-semibold mb-2">Request received</h2>
              <p className="opacity-80">Thank you. Our team will review your request personally. If approved, you'll receive a private access link by email.</p>
              <p className="mt-5 text-sm opacity-80">After approval, check your inbox and Spam/Junk for an email from <strong>Partner@1325.AI</strong>. Mark it “Not Junk” and add the sender to your contacts.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <h2 className="text-2xl font-semibold">Request access</h2>
              <p className="text-sm opacity-75">All fields are required. Each request is reviewed personally.</p>
              {notice && <p className="text-sm rounded-md p-3" style={{ background: "rgba(255,179,0,0.15)", color: "#FFB300" }}>{notice}</p>}
              <Input required placeholder="Full name *" value={form.full_name} onChange={set('full_name')} maxLength={120} className="bg-white text-black" />
              <Input required placeholder="Clinic / hospital / organization *" value={form.organization} onChange={set('organization')} maxLength={160} className="bg-white text-black" />
              <select required value={form.role} onChange={set('role')} className="w-full h-10 rounded-md px-3 bg-white text-black text-sm">
                <option value="">Your role… *</option>
                {['Physician (MD/DO)', 'Nurse Practitioner / PA', 'Practice Manager', 'Healthcare Attorney', 'Investor', 'Other'].map((r) => <option key={r}>{r}</option>)}
              </select>
              <Input type="email" required placeholder="Work email *" value={form.work_email} onChange={set('work_email')} maxLength={255} className="bg-white text-black" />
              <Input type="tel" required placeholder="Phone *" value={form.phone} onChange={set('phone')} maxLength={40} className="bg-white text-black" />
              <label className="flex gap-3 text-xs opacity-85 items-start">
                <input type="checkbox" checked={nda} onChange={(e) => setNda(e.target.checked)} className="mt-0.5" />
                <span>I agree that all materials, screens and workflows shown in 1325 Clinical are proprietary and confidential to 1325.AI, and I will not copy, share, or reproduce them.</span>
              </label>
              {error && <p className="text-sm" style={{ color: '#ff8a80' }}>{error}</p>}
              <Button type="submit" disabled={busy} className="w-full font-semibold" style={{ background: '#FFB300', color: '#001a33' }}>
                {busy ? 'Sending…' : 'Request private access'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
