import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, CloudSun, Cpu, MessageSquareText, HandCoins, ShieldAlert, CalendarDays, Church, Play, Pause, MapPin, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import video from '@/assets/videos/1325-skywatch-briefing.mp4.asset.json';
import logo from '@/assets/1325-ai-logo.png';
import rooftop from '@/assets/skywatch-maryland-rooftop.jpg';
import rooftopMotion from '@/assets/videos/skywatch-rooftop-motion-compatible.mp4.asset.json';
import rooftopMotionWebm from '@/assets/videos/skywatch-rooftop-motion.webm.asset.json';
import communityScience from '@/assets/skywatch-community-science.jpg';

const hostSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name.').max(120),
  organization: z.string().trim().min(2, 'Enter your organization.').max(160),
  type: z.enum(['Church', 'School / HBCU', 'Community center', 'Local business', 'Other'], { errorMap: () => ({ message: 'Choose a site type.' }) }),
  city: z.string().trim().min(2, 'Enter your city.').max(80),
  email: z.string().trim().email('Enter a valid email.').max(255),
});

const steps = [
  { icon: CloudSun, t: 'Sense', d: 'Low-cost weather stations on church, school and community rooftops measure heat, rain and wind block by block.' },
  { icon: Cpu, t: 'Reason', d: 'The 42 Agentic AI Employees check the readings, compare them with public forecasts and turn them into plain-language local guidance.' },
  { icon: MessageSquareText, t: 'Reach', d: 'Guidance goes out the way people already communicate: text messages, church announcements and community radio, in English and Spanish.' },
  { icon: HandCoins, t: 'Circulate', d: 'Station hosts receive stipends and HBCU students earn paid fellowships, so program dollars stay in the neighborhood.' },
];

const pilot = [
  ['Weeks 1–3', 'Pick 10 anchor host sites in Maryland, sign host agreements and record how free weather apps perform today.'],
  ['Weeks 4–9', 'Install and run the stations, send weekly local guidance and check accuracy every week.'],
  ['Weeks 10–13', 'Independent review of the results and a go / no-go decision at day 90.'],
];

export default function SkyWatchPage() {
  const heroRef = useRef<HTMLElement>(null);
  const motionRef = useRef<HTMLVideoElement>(null);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [motionVisible, setMotionVisible] = useState(true);
  const [motionPaused, setMotionPaused] = useState(false);
  const [motionFailed, setMotionFailed] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setMotionAllowed(!preference.matches && !document.hidden);
    update();
    preference.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    const observer = new IntersectionObserver(([entry]) => setMotionVisible(entry?.isIntersecting ?? false));
    if (heroRef.current) observer.observe(heroRef.current);
    return () => {
      preference.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    const player = motionRef.current;
    if (!player) return;
    if (motionAllowed && motionVisible && !motionPaused && !motionFailed) {
      void player.play().catch((error: unknown) => {
        // A visibility pause can interrupt pending playback without breaking the media.
        if (error instanceof DOMException && error.name === 'AbortError') return;
        if (player.error) setMotionFailed(true);
        else setMotionPaused(true);
      });
    } else player.pause();
  }, [motionAllowed, motionVisible, motionPaused, motionFailed]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [f, setF] = useState({ name: '', organization: '', type: '', city: '', email: '' });
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof f, v: string) => setF(p => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    const r = hostSchema.safeParse(f);
    if (!r.success) { setError(r.error.issues[0]?.message ?? 'Check the fields.'); return; }
    const d = r.data;
    const body = `Name: ${d.name}\nOrganization: ${d.organization}\nSite type: ${d.type}\nCity: ${d.city}\nEmail: ${d.email}\n\nWe are interested in hosting a 1325 SkyWatch rooftop station.`;
    window.location.href = `mailto:Partner@1325.AI?subject=${encodeURIComponent('1325 SkyWatch anchor host interest')}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const field = (k: 'name' | 'organization' | 'city' | 'email', label: string, type = 'text') => (
    <div className="space-y-2"><Label htmlFor={`sw-${k}`}>{label}</Label>
      <Input id={`sw-${k}`} type={type} required maxLength={k === 'email' ? 255 : 160} value={f[k]} onChange={e => set(k, e.target.value)} /></div>
  );

  return (
    <div className="theme-clinical min-h-screen bg-background text-foreground pb-16 md:pb-0">
      <Helmet><title>{'1325 SkyWatch — Community Weather Intelligence | 1325.AI'}</title>
        <meta name="description" content="1325 SkyWatch: rooftop weather stations, plain-language local guidance and paid community hosts. Proposed 90-day Maryland pilot." />
        <meta property="og:title" content="1325 SkyWatch | Community Weather Intelligence" />
        <meta property="og:description" content="A proposed 90-day Maryland pilot connecting neighborhood weather sensing, Agentic AI support and community preparedness." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link to="/" aria-label="1325.AI home" className="flex shrink-0 items-center gap-3">
            <img src={logo} alt="1325.AI" width={64} height={64} className="h-12 w-12 object-contain" />
            <span className="border-l border-border pl-3 text-sm font-semibold">SkyWatch</span>
          </Link>
          <nav aria-label="SkyWatch navigation" className="hidden items-center gap-6 text-sm md:flex">
            <a href="#model" className="text-muted-foreground transition-colors hover:text-primary">How it works</a>
            <a href="#pilot" className="text-muted-foreground transition-colors hover:text-primary">The pilot</a>
            <a href="#briefing" className="text-muted-foreground transition-colors hover:text-primary">Kayla briefing</a>
            <Button asChild><a href="#host">Become an anchor host <ArrowRight className="h-4 w-4" /></a></Button>
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="skywatch-mobile-nav" onClick={() => setMenuOpen(p => !p)}>{menuOpen ? <X /> : <Menu />}</Button>
        </div>
        {menuOpen && <nav id="skywatch-mobile-nav" aria-label="SkyWatch mobile navigation" className="grid gap-4 border-t border-border px-6 py-5 md:hidden">
          {[['#model', 'How it works'], ['#pilot', 'The pilot'], ['#briefing', 'Kayla briefing'], ['#host', 'Become an anchor host']].map(([href, label]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="text-sm hover:text-primary">{label}</a>)}
        </nav>}
      </header>

      <section ref={heroRef} className="relative isolate overflow-hidden border-b border-border">
        <img src={rooftop} alt="Illustrative rooftop weather station overlooking a Maryland community" width={1920} height={1088} fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover object-right" />
        {motionAllowed && !motionFailed && <video ref={motionRef} poster={rooftop} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" onError={() => setMotionFailed(true)} className="absolute inset-0 -z-20 h-full w-full object-cover object-right">
          <source src={rooftopMotionWebm.url} type="video/webm" />
          <source src={rooftopMotion.url} type="video/mp4" />
        </video>}
        <div className="clinical-site-hero-scrim absolute inset-0 -z-10" />
        {motionAllowed && !motionFailed && <Button variant="outline" size="icon" className="absolute bottom-3 right-3 bg-background/60" aria-label={motionPaused ? 'Play background motion' : 'Pause background motion'} title={motionPaused ? 'Play background motion' : 'Pause background motion'} onClick={() => setMotionPaused(p => !p)}>{motionPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}</Button>}
        <div className="mx-auto max-w-6xl px-6 py-8 md:py-20">
          <Button asChild variant="link" className="mb-5 h-auto p-0 text-muted-foreground md:mb-8"><Link to="/"><ArrowLeft className="h-4 w-4" />Back to 1325.AI</Link></Button>
          <p className="text-sm font-semibold uppercase text-primary">Community Weather Intelligence</p>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">1325 SkyWatch</h1>
          <p className="mt-5 max-w-lg text-2xl font-medium leading-snug md:text-3xl">Local insight.<br />Stronger communities.</p>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-foreground/85 md:text-lg">Neighborhood weather stations. Kayla and <strong className="text-primary">42 Agentic AI Employees</strong>. A community-led plan to help people prepare—and keep opportunity close to home.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><a href="#host">Become an anchor host <ArrowRight className="h-4 w-4" /></a></Button>
            <Button asChild size="lg" variant="outline" className="bg-background/60"><a href="#briefing"><Play className="h-4 w-4" />Watch the briefing</a></Button>
          </div>
          <p className="mt-7 flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4 shrink-0 text-primary" />Proposed 90-day Maryland pilot · Not live weather reporting</p>
        </div>
      </section>

      <section id="briefing" className="mx-auto max-w-6xl px-6 py-16 scroll-mt-6">
        <p className="text-sm font-semibold uppercase text-primary">Executive briefing · About 6 minutes</p>
        <div className="mb-8 mt-3 flex flex-wrap items-end justify-between gap-5">
          <h2 className="max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">Watch Kayla explain<br className="hidden sm:block" /> the SkyWatch vision.</h2>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">From rooftop readings to local preparedness. A proposal prepared for Dr. M. Brandon Jones.</p>
        </div>
        <video aria-label="1325 SkyWatch Kayla briefing" controls preload="metadata" playsInline poster={rooftop} className="aspect-video w-full rounded-lg border border-border bg-card" src={video.url} />
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Narrated by Kayla. People shown are AI-generated; the program is proposed, not yet operating. Website photography is illustrative—not installed stations or participating hosts.</p>
      </section>

      <section id="model" className="border-y border-border bg-secondary/30 scroll-mt-6">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-sm font-semibold uppercase text-primary">How it would work</p>
          <h2 className="mt-3 text-3xl font-semibold md:text-4xl">The Sky-to-Ground model.</h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">A proposed network that connects local observations with people, preparation and community opportunity.</p>
          <div className="mt-8 grid gap-6 md:grid-cols-4">
            {steps.map(({ icon: I, t, d }, i) => (
              <div key={t} className="rounded-lg border border-border bg-card p-6">
                <I className="h-8 w-8 text-primary" />
                <p className="mt-6 text-xs font-semibold text-primary">STEP 0{i + 1}</p>
                <h3 className="mt-2 text-xl font-semibold">{t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pilot" className="mx-auto max-w-6xl px-6 py-16 scroll-mt-6">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase text-primary"><CalendarDays className="h-4 w-4" />Start local. Measure carefully.</p>
        <h2 className="mt-3 text-3xl font-semibold md:text-4xl">The 90-day Maryland pilot.</h2>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">A focused test in one region—not a nationwide rollout. The goal is to learn what helps, verify the evidence and decide what comes next.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {pilot.map(([w, d]) => <div key={w} className="border-l-2 border-primary pl-5"><p className="font-semibold text-primary">{w}</p><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d}</p></div>)}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">Planning figures are illustrative. Funding, partners and host sites are not yet confirmed.</p>
      </section>

      <section id="host" className="border-y border-border bg-secondary/30 scroll-mt-6">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-2">
          <div>
            <img src={communityScience} alt="Illustrative community science mentor and students inspecting a rooftop weather station" width={1536} height={1024} loading="lazy" className="mb-8 aspect-[3/2] w-full rounded-lg object-cover" />
            <p className="flex items-center gap-2 text-sm text-primary"><Church className="h-4 w-4" />ANCHOR HOSTS</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Host a rooftop station.</h2>
            <p className="mt-5 text-muted-foreground">Churches, schools, HBCUs, community centers and local businesses in Maryland can express interest in hosting one of the first 10 stations.</p>
            <p className="mt-5 text-sm text-muted-foreground">Expressing interest is free and non-binding. Nothing is installed until a signed host agreement and insurance are in place.</p>
          </div>
          <div className="lg:pt-4"><p className="text-sm font-semibold uppercase text-primary">Express your interest</p><h3 className="mt-3 mb-7 text-2xl font-semibold">Your community could be part of it.</h3>{sent ? (
            <div role="status" className="border-l-2 border-primary pl-6 py-5">
              <h3 className="text-2xl font-semibold">Almost done</h3>
              <p className="mt-2 text-sm text-muted-foreground">If your email app opened, press send there to reach the 1325.AI team at Partner@1325.AI. Nothing has been submitted through this website.</p>
              <Button variant="outline" className="mt-5" onClick={() => setSent(false)}>Return to form</Button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              {field('name', 'Your name')}
              {field('organization', 'Organization')}
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="sw-type">Site type</Label>
                  <select id="sw-type" required value={f.type} onChange={e => set('type', e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    <option value="">Select</option>{hostSchema.shape.type.options.map(o => <option key={o}>{o}</option>)}
                  </select></div>
                {field('city', 'City')}
              </div>
              {field('email', 'Email', 'email')}
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              <Button type="submit" size="lg" className="w-full">Send my interest <ArrowRight className="h-4 w-4" /></Button>
              <p className="text-xs leading-relaxed text-muted-foreground">Opens your email app with your details. Send the email there to contact our team; this website does not save your application.</p>
            </form>
          )}</div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-start gap-4 border-y border-primary/30 py-7">
          <ShieldAlert className="mt-1 h-6 w-6 shrink-0 text-primary" />
          <div><h2 className="text-lg font-semibold">Preparedness support. Not an official warning service.</h2>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-muted-foreground">Official storm and emergency warnings come from the National Weather Service (NWS) and your local emergency officials. 1325 SkyWatch is a proposed program and does not provide live weather reporting today. Scientific review, funding and host agreements are still required.</p></div>
        </div>
      </section>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-8">
          <Link to="/" className="flex items-center gap-3"><img src={logo} alt="1325.AI" width={48} height={48} className="h-10 w-10 object-contain" /><span className="text-sm font-semibold">1325 SkyWatch<span className="mt-1 block text-xs font-normal text-muted-foreground">Community Weather Intelligence</span></span></Link>
          <div className="text-xs leading-relaxed text-muted-foreground"><p>U.S. Provisional Patent Application No. 63/969,202 — 46 claims pending.</p><Link to="/" className="mt-2 inline-flex items-center gap-2 hover:text-primary">Explore 1325.AI <ArrowRight className="h-3 w-3" /></Link></div>
        </div>
      </footer>
    </div>
  );
}
