import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { z } from 'zod';
import { CloudSun, Cpu, MessageSquareText, HandCoins, ShieldAlert, CalendarDays, Church } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import video from '@/assets/videos/1325-skywatch-briefing.mp4.asset.json';

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
    <div className="min-h-screen bg-background text-foreground">
      <Helmet><title>{'1325 SkyWatch — Community Weather Intelligence | 1325.AI'}</title>
        <meta name="description" content="1325 SkyWatch: rooftop weather stations, plain-language local guidance and paid community hosts. Proposed 90-day Maryland pilot." /></Helmet>

      <section className="mx-auto max-w-6xl px-6 pt-16 pb-10 text-center">
        <p className="text-sm tracking-widest text-primary">COMMUNITY WEATHER INTELLIGENCE · BY 1325.AI</p>
        <h1 className="mt-4 text-4xl md:text-6xl font-bold">1325 SkyWatch</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">Lifesaving local forecasts, owned by the communities that need them most.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild><a href="#host">Become an anchor host</a></Button>
          <Button asChild variant="outline"><a href="#briefing">Watch the briefing</a></Button>
        </div>
      </section>

      <section id="briefing" className="mx-auto max-w-5xl px-6 pb-16 scroll-mt-6">
        <video controls preload="metadata" playsInline className="w-full rounded-xl border border-border bg-card" src={video.url} />
        <p className="mt-3 text-center text-xs text-muted-foreground">Six-minute briefing narrated by Kayla. People shown are AI-generated; the program is proposed, not yet operating.</p>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="text-3xl font-bold">The Sky-to-Ground model</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-4">
            {steps.map(({ icon: I, t, d }, i) => (
              <div key={t} className="rounded-xl border border-border bg-background p-6">
                <I className="h-8 w-8 text-primary" />
                <p className="mt-4 text-xs text-muted-foreground">STEP {i + 1}</p>
                <h3 className="text-xl font-semibold">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="flex items-center gap-3 text-3xl font-bold"><CalendarDays className="h-7 w-7 text-primary" />The 90-day Maryland pilot</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {pilot.map(([w, d]) => <div key={w} className="border-l-2 border-primary pl-5"><p className="font-semibold">{w}</p><p className="mt-2 text-sm text-muted-foreground">{d}</p></div>)}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">Planning figures are illustrative. Funding, partners and host sites are not yet confirmed.</p>
      </section>

      <section id="host" className="border-y border-border bg-card scroll-mt-6">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-14 lg:grid-cols-2">
          <div>
            <p className="flex items-center gap-2 text-sm text-primary"><Church className="h-4 w-4" />ANCHOR HOSTS</p>
            <h2 className="mt-3 text-3xl font-bold">Host a rooftop station.</h2>
            <p className="mt-5 text-muted-foreground">Churches, schools, HBCUs, community centers and local businesses in Maryland can express interest in hosting one of the first 10 stations.</p>
            <p className="mt-5 text-sm text-muted-foreground">Expressing interest is free and non-binding. Nothing is installed until a signed host agreement and insurance are in place.</p>
          </div>
          <div>{sent ? (
            <div role="status" className="border-l-2 border-primary pl-6 py-5">
              <h3 className="text-2xl font-semibold">Almost done</h3>
              <p className="mt-2 text-sm text-muted-foreground">Your email app opened with your details. Press send there to reach the 1325.AI team at Partner@1325.AI.</p>
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
              <Button type="submit" className="w-full">Send my interest</Button>
            </form>
          )}</div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12 text-center text-xs text-muted-foreground space-y-2">
        <p className="flex items-center justify-center gap-2 font-semibold text-foreground"><ShieldAlert className="h-4 w-4 text-primary" />Not an official warning service</p>
        <p>Official storm and emergency warnings come only from the National Weather Service (NWS) and your local emergency officials. 1325 SkyWatch is a proposed program and does not provide live weather reporting today.</p>
        <p>U.S. Provisional Patent Application No. 63/969,202 — 46 claims pending.</p>
      </section>
    </div>
  );
}
