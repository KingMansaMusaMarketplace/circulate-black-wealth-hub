import type { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, NavLink } from 'react-router-dom';
import { ArrowRight, Building2, Check, ClipboardList, FileText, Hospital, Inbox, LockKeyhole, Mic, ShieldCheck, Stethoscope, UserCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/1325-ai-logo.png';
import homeRounds from '@/assets/clinical-home-rounds.jpg';
import practiceSolution from '@/assets/clinical-solutions-practice.jpg';
import hospitalSolution from '@/assets/clinical-solutions-hospital.jpg';
import notesPhoto from '@/assets/clinical-features-notes.jpg';
import delegationPhoto from '@/assets/clinical-features-delegation.jpg';
import inboxPhoto from '@/assets/clinical-features-inbox.jpg';
import securityReview from '@/assets/clinical-security-review.jpg';
import securityPrivacy from '@/assets/clinical-security-privacy.jpg';
import hospitalTeam from '@/assets/clinical-hospital-team.jpg';
import physicianCare from '@/assets/clinical-physician-care.jpg';
import ClinicalSiteBack from './ClinicalSiteBack';
import { EvidenceDemo, ExecutiveFaq, LostTeamStory, NoRipAndReplace, PilotRoadmap, RoadToRealPatients, TimeCalculator, TraceabilityNotSafety, UnknownExample, WorkflowComparison } from './ClinicalSiteSections';
import unitClerk from '@/assets/clinical-unit-clerk.jpg';
import hospitalLeadership from '@/assets/clinical-hospital-leadership.jpg';

export type ClinicalSitePage = 'home' | 'solutions' | 'features' | 'security';

export const CLINICAL_SITE_LINKS = [
  { to: '/health/welcome', label: 'Home' },
  { to: '/health/solutions', label: 'Solutions' },
  { to: '/health/features', label: 'Features' },
  { to: '/health/security', label: 'Trust & Security' },
  { to: '/health/marketplace', label: 'Pricing & Preview' },
] as const;

const meta: Record<ClinicalSitePage, { title: string; description: string }> = {
  home: { title: '1325 Clinical EMR / EHR — Give the Doctor Their Team Back', description: 'An Agentic AI clinical workflow preview that prepares notes, orders and inbox work for physician review. Private preview · sample data only.' },
  solutions: { title: 'Solutions for Clinics & Hospitals | 1325 Clinical EMR / EHR', description: 'How 1325 Clinical EMR / EHR supports independent practices and hospital departments. Private preview · sample data only.' },
  features: { title: 'Features | 1325 Clinical EMR / EHR', description: 'Delegation Desk, evidence-linked AI note-taking and physician-supervised inbox preparation, shown with fictional data.' },
  security: { title: 'Trust & Security | 1325 Clinical EMR / EHR', description: 'Physician sign-off, fictional-data-only preview, owner-approved access and provisional patent application details.' },
};

function Section({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`mx-auto max-w-6xl px-6 py-16 ${className}`}>{children}</section>;
}

function Heading({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return <div className="max-w-2xl mb-10">
    <p className="text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
    <h2 className="mt-3 text-3xl md:text-4xl font-semibold leading-tight">{title}</h2>
    {intro && <p className="mt-4 text-muted-foreground text-lg">{intro}</p>}
  </div>;
}

function Card({ icon: Icon, title, children, photo }: { icon: typeof Mic; title: string; children: ReactNode; photo?: { src: string; alt: string } }) {
  return <div className="overflow-hidden rounded-lg border border-border bg-card">
    {photo && <img src={photo.src} alt={photo.alt} width={1536} height={1024} loading="lazy" className="aspect-[3/2] w-full object-cover" />}
    <div className="p-6">
    <Icon className="h-7 w-7 text-primary" aria-hidden />
    <h3 className="mt-4 text-lg font-semibold">{title}</h3>
    <div className="mt-2 text-muted-foreground text-sm leading-relaxed">{children}</div>
    </div>
  </div>;
}

function CallToAction() {
  return <Section>
    <div className="border-y border-primary/40 py-12 text-center">
      <h2 className="text-3xl font-semibold">See it for yourself.</h2>
      <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Request a private, owner-approved 20-minute viewing. Every preview uses sample data only.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg"><Link to="/health/marketplace#request">Request private preview <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        <Button asChild size="lg" variant="outline"><Link to="/health">Approved visitors & owner sign in</Link></Button>
      </div>
    </div>
  </Section>;
}

function SettingImage({ src, alt, title, detail }: { src: string; alt: string; title: string; detail: string }) {
  return <article className="min-w-0">
    <img src={src} alt={alt} width={1536} height={1024} loading="lazy" className="aspect-[3/2] w-full rounded-lg object-cover" />
    <h3 className="mt-5 text-2xl font-semibold">{title}</h3><p className="mt-2 text-muted-foreground">{detail}</p>
    <Button asChild variant="link" className="mt-3 px-0"><Link to="/health/solutions">Explore solutions <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
  </article>;
}

function KaylaWorkforce() {
  return <section className="border-y border-border bg-secondary/30">
    <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center">
      <div>
        <p className="text-sm font-semibold uppercase text-primary">Meet your Agentic AI team</p>
        <h2 className="mt-4 text-3xl md:text-4xl font-semibold leading-tight">Kayla.<br />One guide. A broader vision.</h2>
        <p className="mt-5 text-lg text-muted-foreground">Kayla is the Agentic AI product guide for 1325 Clinical EMR / EHR, helping doctors and nurses understand the platform, its workflows and what is available today.</p>
        <p className="mt-4 text-muted-foreground">She sits at the center of 1325.AI’s ecosystem of <strong className="text-foreground">42 Agentic AI Employees</strong> — a broader team spanning executive coordination, finance, marketing, operations, growth and community.</p>
        <Button asChild size="lg" className="mt-7"><Link to="/health/marketplace#request">Meet Kayla in a private preview <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
      </div>
      <div className="border-y border-primary/40 py-8">
        <p className="text-sm font-semibold text-primary">1325.AI ECOSYSTEM</p>
        <p className="mt-3 text-5xl font-semibold text-primary">42</p>
        <h3 className="mt-2 text-2xl font-semibold">Agentic AI Employees</h3>
        <dl className="mt-7 divide-y divide-border">
          {[['Product expertise', 'Kayla explains features, sample workflows and locked services.'], ['Evidence-led preparation', 'Clinical examples organize fictional sources into drafts for review.'], ['Physician authority', 'The doctor retains clinical judgment. No autonomous medical decisions.']].map(([title, text]) => <div key={title} className="py-4"><dt className="font-semibold">{title}</dt><dd className="mt-1 text-sm text-muted-foreground">{text}</dd></div>)}
        </dl>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">The 42 Agentic AI Employees ecosystem is a platform description, not a claim that all employees execute clinical tasks in this preview. Kayla is AI, not a doctor or licensed clinician. No patient information or medical advice.</p>
      </div>
    </div>
  </section>;
}

function Home() {
  const steps = [
    { icon: Mic, t: 'The doctor speaks', d: 'Explore fictional spoken requests and sample visit transcripts.' },
    { icon: ClipboardList, t: 'Kayla prepares drafts', d: 'Kayla, our Agentic AI assistant, turns them into drafts linked to their source.' },
    { icon: UserCheck, t: 'The doctor reviews & signs', d: 'Nothing is final until a physician approves it.' },
  ];
  return <>
    <section className="relative isolate overflow-hidden border-b border-border">
      <img src={homeRounds} alt="Illustrative physician, nurse and care coordinator walking together in a hospital" fetchPriority="high" width={1536} height={1024} className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
      <div className="clinical-site-hero-scrim absolute inset-0 -z-10" />
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-20">
        <p className="text-sm font-semibold text-primary flex items-center gap-2"><LockKeyhole className="h-4 w-4" /> Private preview · sample data only</p>
        <h1 className="mt-6 max-w-2xl text-4xl md:text-5xl font-semibold leading-tight">1325 Clinical<br />EMR / EHR</h1>
        <p className="mt-5 max-w-xl text-2xl font-medium">Give the doctor their team back.</p>
        <p className="mt-5 max-w-lg text-lg text-foreground/85">An Agentic AI workflow preview built around the physician: source-linked preparation, organized clerical work and final decisions that stay with the doctor. Guided by Kayla, part of 1325.AI's team of <strong className="text-primary">42 Agentic AI Employees</strong>.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg"><Link to="/health/marketplace#request">Request private preview <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          <Button asChild size="lg" variant="outline"><Link to="/health/features">Explore features</Link></Button>
        </div>
      </div>
    </section>
    <Section>
      <Heading eyebrow="The problem" title="Physicians have become the clerks." intro="Dr. Join Y. Luh, writing in Doximity Op-Med (October 8, 2026), describes how records systems shifted orders, prescriptions, documentation and inbox work onto doctors themselves. 1325.AI is not affiliated with or endorsed by Doximity or the author." />
      <div className="grid gap-6 md:grid-cols-3">
        <Card icon={FileText} title="Documentation">Notes compete with time in front of the patient — and spill into evenings.</Card>
        <Card icon={ClipboardList} title="Orders">Every request becomes a series of clicks the doctor enters personally.</Card>
        <Card icon={Inbox} title="Inbox">Routine messages and results crowd out the items that truly need a physician.</Card>
      </div>
    </Section>
    <Section className="border-t border-border">
      <Heading eyebrow="How it works" title="Say it once. Review it once." />
      <ol className="grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => <li key={s.t} className="rounded-lg border border-border bg-card p-6">
          <span className="text-primary font-semibold">Step {i + 1}</span>
          <s.icon className="mt-4 h-7 w-7 text-primary" aria-hidden />
          <h3 className="mt-3 text-lg font-semibold">{s.t}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
        </li>)}
      </ol>
      <p className="mt-8 text-sm text-muted-foreground">These workflows use fictional evidence. Live recording, order delivery and patient communication remain locked.</p>
    </Section>
    <KaylaWorkforce />
    <Section>
      <Heading eyebrow="Your setting. Your team." title="From private practice to hospital department." intro="One physician-controlled vision for two care settings, supporting the people who deliver care." />
      <div className="grid gap-8 md:grid-cols-2">
        <SettingImage src={physicianCare} alt="Illustrative physician speaking with an adult in a private clinic" title="Private clinics" detail="Prepare the visit. Keep the conversation human." />
        <SettingImage src={hospitalTeam} alt="Illustrative hospital physician, nurse and director collaborating" title="Hospitals & health systems" detail="Organized preparation for multidisciplinary teams." />
      </div>
      <p className="mt-5 text-xs text-muted-foreground">Illustrative AI-generated photography. Not customers, endorsements or clinical deployments.</p>
    </Section>
    <LostTeamStory photo={unitClerk} />
    <WorkflowComparison />
    <TimeCalculator />
    <ExecutiveFaq />
    <CallToAction />
  </>;
}

function Solutions() {
  return <>
    <Section>
      <Heading eyebrow="Solutions" title="One platform for clinics and hospitals." intro="The same physician-controlled workflow, presented for the setting you work in." />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="min-w-0">
          <img src={practiceSolution} alt="Illustrative physician and practice manager planning at a private clinic" width={1536} height={1024} loading="lazy" className="mb-7 aspect-[3/2] w-full rounded-lg object-cover" />
          <Building2 className="h-8 w-8 text-primary" aria-hidden />
          <h3 className="mt-4 text-2xl font-semibold">Independent practices & clinics</h3>
          <ul className="mt-6 space-y-3 text-muted-foreground">
            {['Transcript-cited note drafts for physician review', 'Spoken requests become draft orders for batch sign-off', 'Inbox items routed to staff or doctor with clear reasons', 'Cloud-based — no server room required'].map(x => <li key={x} className="flex gap-3"><Check className="h-5 w-5 shrink-0 text-primary" />{x}</li>)}
          </ul>
        </div>
        <div className="min-w-0">
          <img src={hospitalSolution} alt="Illustrative hospital department director meeting with a multidisciplinary team" width={1536} height={1024} loading="lazy" className="mb-7 aspect-[3/2] w-full rounded-lg object-cover" />
          <Hospital className="h-8 w-8 text-primary" aria-hidden />
          <h3 className="mt-4 text-2xl font-semibold">Hospitals & health systems</h3>
          <ul className="mt-6 space-y-3 text-muted-foreground">
            {['A proposed workflow layer alongside existing records systems', 'Department-level views shown with illustrative facilities', 'Quality and safety overviews built from source evidence', 'Integration, backup and recovery requirements prepared up front'].map(x => <li key={x} className="flex gap-3"><Check className="h-5 w-5 shrink-0 text-primary" />{x}</li>)}
          </ul>
        </div>
      </div>
      <p className="mt-8 text-sm text-muted-foreground">Photography and facility examples are illustrative, not customer endorsements. Workflow benefits are goals to evaluate, not measured outcomes. Live connections to other systems are not active in the preview.</p>
    </Section>
    <Section>
      <div className="grid items-center gap-10 md:grid-cols-2">
        <img src={globalClinic} alt="Illustrative physician using a phone and tablet in a private outpatient clinic" width={1536} height={1024} loading="lazy" className="aspect-[3/2] w-full rounded-lg object-cover" />
        <div className="min-w-0">
          <Globe2 className="h-8 w-8 text-primary" aria-hidden />
          <p className="mt-4 text-sm text-primary">FUTURE EXPANSION</p>
          <h3 className="mt-2 text-2xl font-semibold">Global clinics & diaspora networks</h3>
          <p className="mt-4 text-muted-foreground">Many private clinics worldwide work on paper or spreadsheets because large records systems are too costly. Just as mobile money let people skip traditional bank branches, a lighter cloud workflow layer could help clinics skip expensive legacy software.</p>
          <ul className="mt-6 space-y-3 text-muted-foreground">
            {['Markets under study: the English-speaking Caribbean and Anglophone West & East Africa', 'Spoken, phone-friendly Delegation Desk and note drafting', 'Regional data hosting and local legal review in each country before any real patient records', 'Country-specific pricing, to be announced by region'].map(x => <li key={x} className="flex gap-3"><Check className="h-5 w-5 shrink-0 text-primary" />{x}</li>)}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">Other countries have their own health-privacy laws (for example Nigeria's data protection law, Kenya's Data Protection Act and UK data protection rules). International use is a plan, not a current offering; the preview uses fictional data only.</p>
        </div>
      </div>
    </Section>
    <NoRipAndReplace photo={hospitalLeadership} />
    <PilotRoadmap />
    <TimeCalculator />
    <CallToAction />
  </>;
}

function Features() {
  return <>
    <Section>
      <Heading eyebrow="Features" title="Built around physician review." intro="Every feature below can be explored in the private preview using fictional patients." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card icon={ClipboardList} title="Delegation Desk" photo={{ src: delegationPhoto, alt: 'Illustrative physician and nurse coordinating work at a hospital workstation' }}>Spoken requests become draft orders, routed tasks and chart questions — with missing facts marked “Unknown” instead of guessed.</Card>
        <Card icon={Mic} title="AI note-taking" photo={{ src: notesPhoto, alt: 'Illustrative physician reviewing documentation at a clinic laptop' }}>Visit notes drafted from the conversation, with every line linked back to what was said. The doctor signs or rejects.</Card>
        <Card icon={Inbox} title="Supervised inbox" photo={{ src: inboxPhoto, alt: 'Illustrative care coordinator and physician reviewing administrative work' }}>Physician-approved rules sort routine items to staff and flag results for the doctor’s review.</Card>
        <Card icon={FileText} title="Record review">Long records organized into source-linked summaries and timelines for physician review.</Card>
        <Card icon={Stethoscope} title="Chart preparation">Visit-ready summaries built only from exact chart excerpts.</Card>
        <Card icon={ShieldCheck} title="Prior authorization & billing checks">Draft paperwork and documentation-gap checks — never claims submission or code selection.</Card>
      </div>
      <p className="mt-5 text-xs text-muted-foreground">Illustrative AI-generated photography. Not customers, endorsements or clinical deployments.</p>
    </Section>
    <EvidenceDemo />
    <UnknownExample />
    <WorkflowComparison />
    <KaylaWorkforce />
    <CallToAction />
  </>;
}

function Security() {
  const yes = ['Physician sign-off required before anything is final', 'Every AI statement links to its source', 'Owner-approved, watermarked, time-limited preview access', 'Missing information stays “Unknown” — never invented'];
  const no = ['No real patient records in the preview', 'No prescriptions, orders or messages are sent', 'No medical advice or diagnosis from Kayla', 'Not a certified or complete records system yet'];
  return <>
    <Section>
      <Heading eyebrow="Trust & Security" title="Honest about what it does — and doesn’t." intro="1325 Clinical EMR / EHR is in development. Real patient records will only be used after legal agreements, vendor coverage and safeguards are confirmed." />
      <div className="mb-10 grid gap-6 md:grid-cols-2">
        <figure><img src={securityReview} alt="Illustrative physician and technology professional reviewing a privacy checklist" width={1536} height={1024} loading="lazy" className="aspect-[3/2] w-full rounded-lg object-cover" /><figcaption className="mt-3 text-sm text-muted-foreground">Careful review before real-world use.</figcaption></figure>
        <figure><img src={securityPrivacy} alt="Illustrative clinician closing a consultation-room privacy door" width={1536} height={1024} loading="lazy" className="aspect-[3/2] w-full rounded-lg object-cover" /><figcaption className="mt-3 text-sm text-muted-foreground">Privacy belongs at the center of care.</figcaption></figure>
      </div>
      <p className="mb-6 text-xs text-muted-foreground">Illustrative AI-generated photography, not evidence of certification or a deployed healthcare environment.</p>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-8"><h3 className="text-xl font-semibold">Preview safeguards</h3><ul className="mt-5 space-y-3 text-muted-foreground">{yes.map(x => <li key={x} className="flex gap-3"><Check className="h-5 w-5 shrink-0 text-primary" />{x}</li>)}</ul></div>
        <div className="rounded-lg border border-border bg-card p-8"><h3 className="text-xl font-semibold">What stays locked</h3><ul className="mt-5 space-y-3 text-muted-foreground">{no.map(x => <li key={x} className="flex gap-3"><X className="h-5 w-5 shrink-0 text-muted-foreground" />{x}</li>)}</ul></div>
      </div>
      <div className="mt-10 rounded-lg border border-border bg-card p-8">
        <h3 className="text-xl font-semibold">Intellectual property</h3>
        <p className="mt-3 text-muted-foreground">Related technology is the subject of U.S. Provisional Patent Application No. 63/969,202 — 46 claims pending. The preview is licensed for evaluation only.</p>
      </div>
    </Section>
    <TraceabilityNotSafety />
    <RoadToRealPatients />
    <ExecutiveFaq />
    <CallToAction />
  </>;
}

export default function ClinicalSite({ page }: { page: ClinicalSitePage }) {
  const m = meta[page];
  return <div className="theme-clinical dark min-h-screen bg-background text-foreground">
    <Helmet>
      <title>{m.title}</title>
      <meta name="description" content={m.description} />
      <meta property="og:title" content={m.title} />
      <meta property="og:description" content={m.description} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
    </Helmet>
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3">
        <Link to="/health/welcome" className="flex items-center gap-3">
          <img src={logo} alt="1325.AI" width={40} height={40} className="h-10 w-10 object-contain" />
          <span className="font-semibold leading-tight">1325 Clinical EMR / EHR<span className="block text-xs font-normal text-primary">Private preview · sample data only</span></span>
        </Link>
        <nav aria-label="1325 Clinical" className="flex flex-wrap items-center gap-1 text-sm">
          {CLINICAL_SITE_LINKS.map(l => <NavLink key={l.to} to={l.to} className={({ isActive }) => `rounded-md px-3 py-2 ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>{l.label}</NavLink>)}
          <Button asChild variant="outline" size="sm"><Link to="/health">Sign in</Link></Button>
          <Button asChild size="sm"><Link to="/health/marketplace#request">Request preview</Link></Button>
        </nav>
      </div>
    </header>
    <main>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3"><ClinicalSiteBack /><span className="text-xs text-muted-foreground">1325.AI / Clinical / {page === 'home' ? 'Overview' : meta[page].title.split(' |')[0]}</span></div>
      {page === 'home' && <Home />}
      {page === 'solutions' && <Solutions />}
      {page === 'features' && <Features />}
      {page === 'security' && <Security />}
    </main>
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-muted-foreground grid gap-4 md:grid-cols-2">
        <div><p>© 2026 1325.AI · 1325 Clinical EMR / EHR · Private preview · sample data only. Contact <a className="text-primary" href="mailto:Thomas@1325.ai">Thomas@1325.ai</a></p>
        <address className="mt-3 not-italic">Headquarters: 1000 E. 111th St., Suite 1100, Chicago, Illinois 60628 · <a className="text-primary" href="tel:+13129006004">1-312-900-6004</a></address></div>
        <p className="md:text-right">Proprietary & confidential. Not for clinical use. U.S. Provisional Patent Application No. 63/969,202 — 46 claims pending.</p>
      </div>
    </footer>
  </div>;
}
