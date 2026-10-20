import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Check, ClipboardList, FileText, Globe2, Hospital, LockKeyhole, MessageCircle, Pause, Play, ShieldCheck, Stethoscope } from 'lucide-react';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import logo from '@/assets/1325-ai-logo.png';
import team from '@/assets/clinical-marketplace-team.jpg';
import teamVideo from '@/assets/clinical-marketplace-loop.mp4.asset.json';
import { assetUrl } from '@/utils/assetUrl';
import previewMeeting from '@/assets/clinical-preview-meeting.jpg';
import { getClinicalPreviewOffer } from './preview-offer';
import ClinicalSiteBack from './ClinicalSiteBack';

const requestSchema = z.object({
  full_name: z.string().trim().min(2, 'Enter your full name.').max(120),
  organization: z.string().trim().min(2, 'Enter your clinic or hospital name.').max(160),
  role: z.string().trim().min(2, 'Choose your role.').max(80),
  work_email: z.string().trim().email('Enter a valid work email.').max(255),
  phone: z.string().trim().min(7, 'Enter your phone number.').max(40),
});
const workflows = [
  { icon: ClipboardList, title: 'Delegation Desk', problem: 'The doctor becomes the task queue.', solution: 'Explore fictional request-to-draft workflows and staff routing, with physician review kept central.' },
  { icon: FileText, title: 'Evidence-linked notes', problem: 'Documentation competes with care.', solution: 'Review notes drafted from sample transcripts, with citations back to the original source.' },
  { icon: MessageCircle, title: 'Inbox preparation', problem: 'Routine work crowds the inbox.', solution: 'See illustrative routing rules, review reasons and missing information without sending a message.' },
];

export default function ClinicalMarketplacePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setMotionAllowed(!preference.matches);
    updateMotion();
    preference.addEventListener('change', updateMotion);
    return () => preference.removeEventListener('change', updateMotion);
  }, []);
  useEffect(() => {
    const updatePlayback = () => {
      const video = videoRef.current;
      if (!video) return;
      if (document.hidden || videoPaused) video.pause();
      else void video.play().catch(() => setVideoPaused(true));
    };
    updatePlayback();
    document.addEventListener('visibilitychange', updatePlayback);
    return () => document.removeEventListener('visibilitychange', updatePlayback);
  }, [motionAllowed, videoPaused, videoFailed]);
  const [setting, setSetting] = useState<'clinic' | 'hospital'>('clinic');
  const [form, setForm] = useState({ full_name: '', organization: '', role: '', work_email: '', phone: '' });
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [notificationFailed, setNotificationFailed] = useState(false);
  const offer = getClinicalPreviewOffer();
  const update = (key: keyof typeof form, value: string) => setForm(previous => ({ ...previous, [key]: value }));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (pending.current) return;
    setError('');
    const parsed = requestSchema.safeParse(form);
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Check the required fields.'); return; }
    if (!consent) { setError('Please accept the confidentiality terms.'); return; }
    pending.current = true; setBusy(true);
    try {
      const { data, error: failure } = await supabase.functions.invoke('health-access', { body: { action: 'request', ...parsed.data, nda: true } });
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
    <Helmet>
      <title>Clinical Preview for Clinics & Hospitals | 1325.AI</title>
      <meta name="description" content="Request an owner-approved, fictional-data preview of 1325 Clinical EMR / EHR. Explore evidence-linked notes, delegation and physician-controlled review. Country-specific pricing to be announced." />
      <meta property="og:title" content="1325 Clinical EMR / EHR — Clinic & Hospital Preview" />
      <meta property="og:description" content="Give the doctor their team back. Private preview · sample data only. Pricing to be announced." />
      <meta property="og:type" content="website" /><meta name="twitter:card" content="summary" />
    </Helmet>
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <Link to="/" className="flex items-center gap-3"><img src={logo} alt="" width={44} height={44} className="h-11 w-11 object-contain" /><span className="font-semibold text-lg">1325.AI <span className="block text-xs font-normal text-muted-foreground">Clinical preview marketplace</span></span></Link>
        <nav className="flex items-center gap-2" aria-label="Clinical marketplace"><Button asChild variant="ghost" size="sm"><Link to="/health">Approved visitor access</Link></Button><Button asChild variant="outline" size="sm"><a href="/auth?redirect=%2Fhealth">Owner sign in</a></Button></nav>
      </div>
    </header>
    <main>
      {sent && notificationFailed && <p role="alert" className="mx-auto max-w-6xl px-6 py-4 text-primary">Your request is saved in Thomas’s Clinical Access dashboard, but the notification email was not confirmed sent. Please contact Thomas directly; do not submit another request.</p>}
      <div className="mx-auto max-w-6xl px-6 py-3"><ClinicalSiteBack /></div>
      <section className="relative isolate overflow-hidden border-b border-border">
        <img src={team} alt="Illustrative image of a physician and clinic manager reviewing a laptop together" width={1536} height={1024} className="absolute inset-0 -z-20 h-full w-full object-cover object-right" />
        {motionAllowed && !videoFailed && <video ref={videoRef} src={assetUrl(teamVideo.url)} poster={team} muted loop playsInline preload="metadata" aria-hidden="true" onError={() => setVideoFailed(true)} className="absolute inset-0 -z-20 h-full w-full object-cover object-right" />}
        <div className="absolute inset-0 -z-10 bg-background/80" />
        {motionAllowed && !videoFailed && <Button variant="outline" size="icon" className="absolute bottom-4 right-4 bg-background/80" aria-label={videoPaused ? 'Play background video' : 'Pause background video'} title={videoPaused ? 'Play background video' : 'Pause background video'} onClick={() => setVideoPaused(previous => !previous)}>{videoPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}</Button>}
        <div className="mx-auto max-w-6xl px-6 py-8 md:py-20">
          <p className="mb-5 flex items-center gap-2 text-sm font-medium text-primary"><LockKeyhole className="h-4 w-4" /> For private clinics & hospital leaders</p>
          <h1 className="max-w-2xl text-3xl font-semibold leading-tight md:text-5xl">1325 Clinical EMR / EHR</h1>
          <p className="mt-3 text-sm font-semibold text-primary">Private preview · sample data only</p>
          <h2 className="mt-8 max-w-xl font-display text-3xl leading-tight md:text-4xl">Give the doctor<br />their team back.</h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed">Explore a different approach to clinical work: prepare the notes, organize the evidence and rehearse delegation — while the physician stays in control.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Button asChild size="lg" className="px-6"><a href="#request">Request a private preview <ArrowRight /></a></Button><Button asChild variant="outline" size="lg" className="px-6"><a href="#workflows">Explore the approach</a></Button></div>
          <p className="mt-5 text-xs text-muted-foreground">In development. Not a complete or certified clinical system.</p>
        </div>
      </section>
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-7 md:grid-cols-3">
          {['Doctor decides', 'Team prepares', 'Doctor reviews'].map((text, index) => <div key={text} className="flex items-center gap-4"><span className="text-2xl font-display text-primary">0{index + 1}</span><div><h3 className="font-semibold">{text}</h3><p className="mt-1 text-xs text-muted-foreground">{['Clinical judgment stays with the physician.', 'Preview drafts from fictional evidence.', 'AI preparation is not clinical clearance.'][index]}</p></div></div>)}
        </div>
      </section>
      <section id="workflows" className="mx-auto max-w-6xl px-6 py-14 scroll-mt-6">
        <p className="text-sm text-primary">THE APPROACH</p><h2 className="mt-3 text-3xl font-display">Less clerical friction. More physician control.</h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">The sales dossier starts with a practical question: what happens when electronic records make the doctor do everything? These sample workflows explore another way.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{workflows.map(({ icon: Icon, title, problem, solution }) => <article key={title} className="rounded-lg border border-border bg-card p-6"><Icon className="mb-6 h-6 w-6 text-primary" /><h3 className="text-xl font-semibold">{title}</h3><p className="mt-3 text-sm font-medium">{problem}</p><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{solution}</p><p className="mt-5 text-xs text-primary">Fictional-data preview</p></article>)}</div>
        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">Reference: Dr. Join Y. Luh, “EHRs Now Make Physicians Do Everything Themselves,” Doximity Op-Med, October 8, 2026. <a className="text-primary underline" href="https://opmed.doximity.com/articles/ehrs-now-make-physicians-do-everything-themselves" target="_blank" rel="noopener noreferrer">Read the article</a>. No author or publisher endorsement is implied.</p>
      </section>
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-wrap items-center justify-between gap-6"><div><h2 className="text-3xl font-display">One platform. Two perspectives.</h2><p className="mt-3 text-muted-foreground">Choose the setting you want to explore.</p></div><div className="flex gap-2" role="group" aria-label="Practice setting"><Button variant={setting === 'clinic' ? 'default' : 'outline'} aria-pressed={setting === 'clinic'} onClick={() => setSetting('clinic')}><Stethoscope />Private clinic</Button><Button variant={setting === 'hospital' ? 'default' : 'outline'} aria-pressed={setting === 'hospital'} onClick={() => setSetting('hospital')}><Hospital />Hospital</Button></div></div>
          <div className="mt-8 grid gap-8 md:grid-cols-2"><div><h3 className="flex items-center gap-2 text-xl font-semibold"><Building2 className="h-5 w-5 text-primary" />{setting === 'clinic' ? 'A clearer day for the practice' : 'A shared view for hospital leadership'}</h3><p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">{setting === 'clinic' ? 'Follow a fictional visit from source-linked chart preparation to draft notes and physician review. Explore the Delegation Desk and ask Kayla, the Agentic AI product guide, about the platform.' : 'Explore illustrative facility context, executive quality preparation and readiness requirements. These examples are not working hospital integrations or evidence of live multi-facility deployment.'}</p></div><ul className="space-y-4 text-sm">{(setting === 'clinic' ? ['Evidence-linked chart and note preparation', 'Sample inbox and delegation workflows', 'Kayla product questions, with no saved chat history'] : ['Illustrative hospital and facility perspectives', 'Read-only safety and readiness preparation', 'Unknown performance results — no invented quality scores']).map(text => <li key={text} className="flex gap-3"><Check className="h-4 w-4 shrink-0 text-primary" />{text}</li>)}</ul></div>
        </div>
      </section>
      <section id="request" className="mx-auto grid max-w-6xl gap-12 px-6 py-14 lg:grid-cols-2 scroll-mt-6">
        <figure className="lg:col-span-2"><img src={previewMeeting} alt="Illustrative hospital executive, physician and administrator in a product evaluation meeting" width={1536} height={1024} loading="lazy" className="aspect-[3/2] w-full rounded-lg object-cover sm:aspect-[16/7]" /><figcaption className="mt-3 text-xs text-muted-foreground">Explore together before committing. Illustrative AI-generated photography, not customers or endorsements.</figcaption></figure>
        <div><p className="text-sm text-primary">PRIVATE PREVIEW</p><h2 className="mt-3 text-3xl font-display">Begin with a conversation.<br />Then explore privately.</h2><div className="mt-8 border-y border-border py-6"><p className="flex items-center gap-2 text-sm text-muted-foreground"><Globe2 className="h-4 w-4" />Country-specific preview pricing</p><p className="mt-3 text-3xl font-semibold">To be announced</p><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Fees are still being developed and will depend on the country. No payment is collected today. Paid preview checkout will be introduced only after pricing is confirmed, and only after your request is approved.</p><div className="mt-6 border-t border-border pt-6"><h3 className="flex items-center gap-2 text-xl font-semibold"><Globe2 className="h-5 w-5 shrink-0 text-primary" />Global Access Commitment</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Our country-by-country pricing approach aims to give independent private clinics in the Caribbean, Africa, the UK and Latin America equitable access to the broader 1325.AI ecosystem of <strong className="text-foreground">42 Agentic AI Employees</strong>, without imposing inflated U.S. enterprise rates.</p><p className="mt-3 text-xs leading-relaxed text-muted-foreground">Regional prices are to be announced. The 42 Agentic AI Employees describe the broader platform ecosystem, not 42 clinically validated workers in this preview. Real clinical use remains subject to local legal review, vendor coverage and verified regional data residency safeguards.</p></div><Button disabled={ !offer.checkoutEnabled } variant="outline" className="mt-5"><LockKeyhole />Checkout not yet available</Button></div><ul className="mt-7 space-y-4 text-sm"><li className="flex gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-primary" />Thomas personally approves private access.</li><li className="flex gap-3"><LockKeyhole className="h-5 w-5 shrink-0 text-primary" />One twenty-minute viewing from first entry, on one approved device.</li><li className="flex gap-3"><FileText className="h-5 w-5 shrink-0 text-primary" />Private screens carry the approved viewer’s name, email and date.</li></ul><p className="mt-8 text-sm leading-relaxed text-muted-foreground">Real patient records, prescribing, live orders and patient communications remain locked. A preview is not a commercial or clinical license; local legal and vendor review is required before real clinical use in any country.</p></div>
        <div className="min-w-0">{sent ? <div role="status" className="space-y-5 border-l-2 border-primary pl-6 py-5"><ShieldCheck className="h-10 w-10 text-primary" /><h2 className="text-2xl font-semibold">Request received</h2><p>Thomas will review your request personally. Submission does not grant private access.</p><p className="text-sm text-muted-foreground">If approved, look for the invitation from Thomas@1325.ai. Check Spam/Junk too. No payment has been taken.</p><Button asChild variant="outline"><Link to="/health">Return to private access</Link></Button></div> : <form onSubmit={submit} className="space-y-5"><h2 className="text-2xl font-semibold">Request your private preview</h2><p className="text-sm text-muted-foreground">Clinic and hospital representatives welcome. All fields are required. Do not include patient information.</p>{([{ key: 'full_name', label: 'Full name', max: 120 }, { key: 'organization', label: 'Clinic / hospital / organization', max: 160 }] as const).map(field => <div key={field.key} className="space-y-2"><Label htmlFor={`preview-${field.key}`}>{field.label}</Label><Input id={`preview-${field.key}`} required maxLength={field.max} value={form[field.key]} onChange={e => update(field.key, e.target.value)} disabled={busy} /></div>)}<div className="space-y-2"><Label htmlFor="preview-role">Your role</Label><select id="preview-role" required value={form.role} disabled={busy} onChange={e => update('role', e.target.value)} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="">Select your role</option>{['Physician (MD/DO)', 'Nurse', 'Nurse Practitioner / PA', 'Practice Manager', 'Hospital Leadership', 'Healthcare Attorney', 'Investor', 'Other'].map(role => <option key={role}>{role}</option>)}</select></div><div className="grid gap-5 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="preview-email">Work email</Label><Input id="preview-email" type="email" autoComplete="email" required maxLength={255} value={form.work_email} onChange={e => update('work_email', e.target.value)} disabled={busy} /></div><div className="space-y-2"><Label htmlFor="preview-phone">Phone</Label><Input id="preview-phone" type="tel" autoComplete="tel" required maxLength={40} value={form.phone} onChange={e => update('phone', e.target.value)} disabled={busy} /></div></div><div className="flex items-start gap-3"><Checkbox id="preview-consent" checked={consent} onCheckedChange={value => setConsent(value === true)} disabled={busy} className="mt-1 shrink-0" /><Label htmlFor="preview-consent" className="text-xs font-normal leading-relaxed text-muted-foreground">I agree to the Proprietary & Confidential notice: this preview is for evaluation only. I will not copy, share, record, screenshot, reverse-engineer or use it to build a similar product, except where applicable law permits. Commercial or clinical use requires a separate written license from 1325.AI.</Label></div>{error && <p role="alert" className="text-sm text-destructive-foreground">{error}</p>}<Button type="submit" disabled={busy} className="w-full">{busy ? 'Sending…' : 'Request private preview'}<ArrowRight /></Button><p className="text-xs text-muted-foreground">Existing approval controls apply. This request is not a purchase or a clinic account registration.</p></form>}</div>
      </section>
    </main>
    <footer className="border-t border-border bg-card"><div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4 px-6 py-6 text-xs text-muted-foreground"><p>1325.AI · 1325 Clinical EMR / EHR<br />Private preview · sample data only</p><p className="sm:text-right">Headquarters: 1000 E. 111th St., Suite 1100, Chicago, Illinois 60628<br /><a href="tel:+13129006004" className="text-primary">1-312-900-6004</a> · <a href="mailto:Thomas@1325.ai" className="text-primary">Thomas@1325.ai</a></p></div></footer>
  </div>;
}