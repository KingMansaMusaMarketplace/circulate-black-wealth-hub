import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Lock, ShieldCheck, FileSearch, Mic, Stethoscope } from 'lucide-react';
import { z } from 'zod';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import logo1325 from '@/assets/1325-ai-logo.png';
import { closePrivateSession, EndPrivateSessionButton, PRIVATE_SESSION_ENDED, PrivateSessionContext } from './PrivateSession';
import ProprietaryNotice from './ProprietaryNotice';
import VisitorWatermark from './VisitorWatermark';
import { readPreviewGrant, type PreviewViewer } from './preview-access';
import { ClinicalVoiceProvider } from './ClinicalVoice';
import { ClinicalHelpConversationProvider } from './ClinicalHelpConversation';

const KEY = 'hc_preview_access';
const DEVICE_KEY = 'hc_preview_device';
const SESSION_KEY = 'hc_preview_session_end';
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
  expired: 'Your private viewing has ended or the unused link has expired. Please request fresh approval.',
  device: 'This private link is already in use on another device. Links cannot be shared — please request your own access.',
  invalid: 'This access link is no longer active. Please request access again.',
};

export default function HealthAccessGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<'checking' | 'locked' | 'open' | 'timeout' | 'ended'>('checking');
  const [reason, setReason] = useState<Reason>('none');
  const [remaining, setRemaining] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewer, setViewer] = useState<PreviewViewer | null>(null);
  const [extended, setExtended] = useState(false);
  const deadline = useRef(0);
  const serverDeadline = useRef(0);
  const terminating = useRef(false);
  const busy = useRef(false);

  const endSession = useCallback(() => {
    if (terminating.current) return;
    terminating.current = true;
    closePrivateSession(localStorage);
    setState('ended');
    const token = localStorage.getItem(KEY);
    // Lock immediately; consume this grant server-side before stopping detached media.
    if (!isAdmin && token) localStorage.setItem('hc_preview_pending_end', token);
    const consume = !isAdmin && token ? supabase.functions.invoke('health-access', {
      body: { action: 'end', token, device: deviceId() },
    }).then(({ data, error }) => { if (!error && data?.reason !== 'unavailable') { localStorage.removeItem('hc_preview_pending_end'); localStorage.removeItem(KEY); } }) : Promise.resolve();
    void Promise.race([consume, new Promise((resolve) => setTimeout(resolve, 2500))])
      .finally(() => supabase.auth.signOut({ scope: 'local' }).finally(() => window.location.reload()));
  }, [isAdmin]);

  const verify = useCallback(async (logVisit = false) => {
    if (busy.current || terminating.current) return;
    const token = localStorage.getItem(KEY);
    if (!token) { setState('locked'); return; }
    if (localStorage.getItem('hc_preview_pending_end') === token) { setState('ended'); return; }
    busy.current = true;
    const started = performance.now();
    try {
      const { data, error } = await supabase.functions.invoke('health-access', { body: {
        action: 'verify', token, device: deviceId(), ...(logVisit ? { path: window.location.pathname } : {}),
      } });
      if (terminating.current || localStorage.getItem(KEY) !== token) return;
      // Transport/server failures are not rejections: keep the token and, if already viewing,
      // let the local server-derived deadline keep enforcing time until a later check succeeds.
      if (error) { setState((s) => (s === 'open' ? s : 'locked')); return; }
      const grant = readPreviewGrant(data);
      if (grant) {
        const candidate = performance.now() + grant.remaining - (performance.now() - started);
        // Compare actual server deadlines, not network jitter, so even short extensions count.
        if (serverDeadline.current && grant.expiresAt > serverDeadline.current) { deadline.current = candidate; setExtended(true); }
        else deadline.current = deadline.current ? Math.min(deadline.current, candidate) : candidate;
        serverDeadline.current = grant.expiresAt;
        setRemaining(Math.max(0, deadline.current - performance.now()));
        setViewer(grant.viewer);
        setState('open');
      } else {
        setViewer(null);
        setReason(data?.reason === 'device' ? 'device' : data?.reason === 'expired' ? 'expired' : 'invalid');
        localStorage.removeItem(KEY);
        localStorage.removeItem(SESSION_KEY);
        setState('locked');
      }
    } catch { setState((s) => (s === 'open' ? s : 'locked')); }
    finally { busy.current = false; }
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    const fromUrl = url.searchParams.get('access');
    if (fromUrl) {
      if (fromUrl !== localStorage.getItem(KEY)) {
        localStorage.removeItem(PRIVATE_SESSION_ENDED);
        localStorage.removeItem(SESSION_KEY);
      }
      localStorage.setItem(KEY, fromUrl);
      url.searchParams.delete('access');
      // Keep emailed root links on the permanent gated route after hiding the token.
      // Reloads (including exit/cross-tab reloads) must never select the public homepage.
      if (url.pathname === '/') url.pathname = '/health';
      window.history.replaceState({}, '', url.toString());
    }
    void (async () => {
      try {
        const { data: s } = await supabase.auth.getSession();
        if (s.session) {
          const { data, error } = await supabase.functions.invoke('health-access', { body: { action: 'admin' } });
          if (!error && data?.ok === true && data.admin === true && typeof data.email === 'string' && typeof data.name === 'string') {
            // A prior visitor exit cannot override a newly verified administrator sign-in.
            localStorage.removeItem(PRIVATE_SESSION_ENDED);
            localStorage.removeItem(SESSION_KEY);
            setIsAdmin(true); setViewer({ name: data.name, email: data.email }); setState('open'); return;
          }
        }
      } catch { /* Fail closed and retain visitor restrictions when verification is unavailable. */ }
      if (localStorage.getItem(PRIVATE_SESSION_ENDED)) { setState('ended'); return; }
      await verify(true);
    })();
  }, [verify]);

  useEffect(() => {
    const consumePending = async () => {
      const token = localStorage.getItem('hc_preview_pending_end');
      if (!token) return;
      try {
        const { data, error } = await supabase.functions.invoke('health-access', { body: { action: 'end', token, device: deviceId() } });
        if (!error && data?.reason !== 'unavailable') {
          localStorage.removeItem('hc_preview_pending_end');
          if (localStorage.getItem(KEY) === token) localStorage.removeItem(KEY);
        }
      } catch { /* Retain the local lock and retry after reconnection. */ }
    };
    void consumePending();
    const timer = setInterval(() => { void consumePending(); }, 15000);
    window.addEventListener('online', consumePending);
    return () => { clearInterval(timer); window.removeEventListener('online', consumePending); };
  }, []);

  useEffect(() => {
    if (state !== 'locked' || localStorage.getItem(PRIVATE_SESSION_ENDED) || !localStorage.getItem(KEY)) return;
    const retry = () => { void verify(true); };
    const timer = setInterval(retry, 15000);
    window.addEventListener('online', retry); window.addEventListener('focus', retry);
    return () => { clearInterval(timer); window.removeEventListener('online', retry); window.removeEventListener('focus', retry); };
  }, [state, verify]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === PRIVATE_SESSION_ENDED || event.key === KEY) window.location.reload();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (state !== 'open') return;
    if (isAdmin) {
      const checkAdmin = async () => {
        const { data, error } = await supabase.functions.invoke('health-access', { body: { action: 'admin' } });
        if (error || data?.ok !== true || data.admin !== true || typeof data.name !== 'string' || typeof data.email !== 'string') { setIsAdmin(false); setViewer(null); setState('locked'); }
        else setViewer({ name: data.name, email: data.email });
      };
      const timer = setInterval(() => { void checkAdmin(); }, 15000);
      const focus = () => { void checkAdmin(); };
      window.addEventListener('focus', focus);
      return () => { clearInterval(timer); window.removeEventListener('focus', focus); };
    }
    const tick = () => {
      const left = Math.max(0, deadline.current - performance.now());
      setRemaining(left);
      if (!left) endSession();
    };
    const refresh = () => { tick(); if (!terminating.current) void verify(); };
    const visibility = () => { if (document.visibilityState === 'visible') refresh(); };
    const timer = setInterval(tick, 250);
    const heartbeat = setInterval(refresh, 15000);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      clearInterval(timer); clearInterval(heartbeat);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [state, isAdmin, verify, endSession]);

  if (state === 'open' && viewer) {
    const seconds = Math.ceil(remaining / 1000);
    return <PrivateSessionContext.Provider value={endSession}>
      <ClinicalVoiceProvider remaining={remaining} extended={extended} isAdmin={isAdmin}>
      <ClinicalHelpConversationProvider>
      {children}
      </ClinicalHelpConversationProvider>
      <VisitorWatermark viewer={viewer} />
      {extended && !isAdmin && <div role="alertdialog" aria-label="Extra time granted" className="theme-clinical dark fixed inset-0 z-[10000] grid place-items-center bg-background/70 px-6">
        <section className="max-w-sm rounded-xl border-2 border-primary bg-card p-6 text-center shadow-2xl space-y-4">
          <img src={logo1325} alt="1325.AI" className="mx-auto h-12 w-12 object-contain" />
          <h2 className="text-xl font-semibold text-primary">Thomas just granted you an extra 20 minutes!</h2>
          <p className="text-sm text-muted-foreground">Your timer has been reset. Same device and confidentiality terms apply.</p>
          <Button onClick={() => setExtended(false)}>Continue viewing</Button>
        </section>
      </div>}
      <div className="theme-clinical dark fixed bottom-3 left-3 z-[9999] rounded-md border bg-card p-1 shadow-lg md:hidden"><EndPrivateSessionButton /></div>
      <div className="theme-clinical dark fixed top-3 right-3 z-[9999] rounded-md px-3 py-1.5 text-xs font-semibold shadow-lg border text-primary bg-card" aria-live="off">
        {isAdmin ? <><ShieldCheck className="inline h-3 w-3 mr-1" />Admin access</> : <><Lock className="inline h-3 w-3 mr-1" />Private viewing · {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</>}
      </div>
      </ClinicalVoiceProvider>
    </PrivateSessionContext.Provider>;
  }
  if (state === 'ended' || state === 'timeout') return <div className="theme-clinical dark min-h-screen grid place-items-center bg-background px-6 text-foreground">
    <section className="max-w-md text-center space-y-5">
      <img src={logo1325} alt="1325.AI" className="mx-auto h-16 w-16 object-contain" />
      <Lock className="mx-auto h-8 w-8 text-primary" />
      <h1 className="text-2xl font-semibold">Your private viewing has ended</h1>
      <p className="text-muted-foreground">Private screens are locked. Each approval allows one forty-minute viewing from first entry. Please request Thomas’s approval again to return.</p>
      <Button onClick={() => { localStorage.removeItem(PRIVATE_SESSION_ENDED); localStorage.removeItem(KEY); setState('locked'); }}>Request fresh approval</Button>
    </section>
  </div>;
  if (state === 'checking') return <div className="theme-clinical min-h-screen bg-background" />;
  return <Teaser notice={reason !== 'none' ? MESSAGES[reason] : ''} />;
}

function Teaser({ notice = "" }: { notice?: string }) {
  const [form, setForm] = useState({ full_name: '', organization: '', role: '', work_email: '', phone: '' });
  const [nda, setNda] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [notificationFailed, setNotificationFailed] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError('');
    const p = schema.safeParse(form);
    if (!p.success) { setError(p.error.issues[0].message); return; }
    if (!nda) { setError('Please accept the confidentiality terms.'); return; }
    setBusy(true);
    try {
      const { data, error: err } = await supabase.functions.invoke('health-access', { body: { action: 'request', ...p.data, nda: true } });
      if (err || !data?.ok) {
        // The SDK puts non-2xx JSON in the error response, not in data.
        const failure = err instanceof FunctionsHttpError
          ? await err.context.json().catch(() => null)
          : data;
        const message = failure?.error;
        setError(typeof message === 'string' && message.trim()
          ? message
          : 'Your request could not be confirmed. Please try again.');
        return;
      }
      setNotificationFailed(data.notification_accepted === false);
      setSent(true);
    } catch { setError('Your request could not be confirmed. Please try again.'); }
    finally { setBusy(false); }
  };

  const features = [
    { icon: FileSearch, t: 'Record review co-pilot', d: 'Organizes long medical records into source-linked drafts for physician review.' },
    { icon: Mic, t: 'AI note-taking', d: 'Drafts visit notes where every line points back to what was said.' },
    { icon: Stethoscope, t: 'Doctor stays in charge', d: 'Nothing is final until a physician reviews and signs.' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg,#001a33,#003366 60%,#001a33)', color: '#fff' }}>
      <Helmet>
        <title>1325 Clinical EMR / EHR — Private Physician Preview</title>
        <meta name="description" content="1325 Clinical EMR / EHR is an invitation-only AI clinical co-pilot for record review and note-taking." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="mx-auto max-w-6xl px-6 py-12 grid gap-12 lg:grid-cols-2 items-start">
        <div>
          <img src={logo1325} alt="1325.AI" className="h-12 mb-8" />
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs mb-6" style={{ borderColor: '#FFB300', color: '#FFB300' }}>
            <Lock className="h-3 w-3" /> Private Physician Preview · By invitation only
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">1325 Clinical EMR / EHR</h1>
          <p className="-mt-2 mb-4 text-sm font-medium" style={{ color: "#FFB300" }}>Private preview · sample data only</p>
          <p className="text-lg opacity-85 mb-8">An AI-powered clinical co-pilot that helps physicians review records and document visits faster — with every finding linked to its source.</p>
          <div className="space-y-5">
            {features.map(({ icon: I, t, d }) => (
              <div key={t} className="flex gap-4">
                <I className="h-6 w-6 shrink-0" style={{ color: '#FFB300' }} />
                <div><div className="font-semibold">{t}</div><div className="text-sm opacity-75">{d}</div></div>
              </div>
            ))}
          </div>
          <ProprietaryNotice className="mt-6 opacity-70" />
          <Button asChild variant="outline" className="mt-6"><a href="/health/marketplace">Clinics & hospitals: explore the private preview</a></Button>
        </div>

        <div className="rounded-2xl p-8 border" style={{ background: 'rgba(0,0,0,0.35)', borderColor: 'rgba(255,179,0,0.4)' }}>
          {sent ? (
            <div className="text-center py-10">
              <ShieldCheck className="h-12 w-12 mx-auto mb-4" style={{ color: '#FFB300' }} />
              <h2 className="text-2xl font-semibold mb-2">Request received</h2>
              {notificationFailed && <p role="alert" className="mb-4 text-primary">Your request is saved for Thomas in the Clinical Access dashboard, but the notification email was not confirmed sent. Please contact Thomas directly; do not submit another request.</p>}
              <p className="opacity-80">Thank you. Our team will review your request personally. If approved, you'll receive a private access link by email.</p>
              <p className="mt-5 text-sm opacity-80">After approval, check your inbox and Spam/Junk for an email from <strong>Thomas@1325.ai</strong>. Mark it “Not Junk” and add the sender to your contacts.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <a href={`/auth?redirect=${encodeURIComponent(window.location.pathname)}`} className="flex items-center justify-center gap-2 w-full rounded-md border px-4 py-3 text-sm font-semibold" style={{ borderColor: '#FFB300', color: '#FFB300' }}>
                <ShieldCheck className="h-4 w-4" /> Owner or administrator? Sign in here — no timer, no request needed
              </a>
              <h2 className="text-2xl font-semibold">Request access</h2>
              <p className="text-sm opacity-75">For visitors. All fields are required. Approval allows one forty-minute viewing from first entry. Your name, email and date will appear on private screens as a confidentiality watermark.</p>
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
                <span>I agree to the Proprietary &amp; Confidential notice: 1325 Clinical EMR / EHR is licensed to me for evaluation only. I will not copy, share, record, screenshot, reverse-engineer, or use it to build a similar product, and any commercial or clinical use requires a separate written license from 1325.AI.</span>
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
