import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowRight, FileCheck2, Lock, ShieldCheck } from 'lucide-react';
import logo1325 from '@/assets/1325-ai-logo.png';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const reviewItems = [
  { title: 'Agreement & authorized parties', detail: 'Counsel must confirm the legal entities, authorized clinic signer, permitted use and the exact agreement version.' },
  { title: 'Patient-information obligations', detail: 'Counsel must define safeguards, permitted disclosures, subcontractor duties, breach reporting and patient-rights assistance.' },
  { title: 'Retention & termination', detail: 'Counsel must approve record retention, return or destruction, termination rights and obligations that continue after termination.' },
  { title: 'Exact vendor coverage', detail: 'Written coverage must match the hosting, storage, AI, document-reading, backup and support services actually handling records.' },
];

export default function HealthBaaPage() {
  return <div className="theme-clinical dark min-h-screen bg-background text-foreground">
    <Helmet><title>Clinic BAA Preparation | 1325 Clinical</title><meta name="description" content="1325 Clinical clinic Business Associate Agreement preparation. Signing and patient-data intake remain unavailable pending attorney approval and independently verified healthcare safeguards." /><meta name="robots" content="noindex" /></Helmet>
    <div className="flex items-center justify-center gap-2 bg-mansagold px-4 py-2 text-center text-xs font-semibold text-mansablue"><Lock className="h-3.5 w-3.5 shrink-0" />PATIENT DATA BLOCKED · Agreement preparation only</div>
    <header className="theme-clinical-bar border-b-2 border-mansagold px-4 py-4 sm:px-8">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
        <Link to="/health" className="flex items-center gap-3 font-semibold"><img src={logo1325} alt="1325.AI" className="h-9 w-9 object-contain" />1325 Clinical</Link>
        <Button variant="ghost" size="sm" asChild><Link to="/health/app"><ArrowLeft className="mr-2 h-4 w-4" />Clinic workspace</Link></Button>
      </div>
    </header>
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-8 sm:py-14">
      <Badge variant="outline" className="mb-4">Awaiting attorney-approved agreement</Badge>
      <h1 className="text-3xl font-semibold sm:text-4xl">Clinic Business Associate Agreement</h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">A Business Associate Agreement (BAA) defines responsibilities for handling protected patient information. No attorney-approved agreement is available for signing yet.</p>
      <section aria-label="Agreement status" className="mt-8 grid gap-6 border-y py-6 sm:grid-cols-3">
        {[['Agreement document', 'Not provided'], ['Clinic signing', 'Unavailable'], ['Patient-data access', 'Blocked']].map(([label, value]) => <div key={label}><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 flex items-center gap-2 font-semibold"><Lock className="h-4 w-4 text-mansagold" />{value}</p></div>)}
      </section>
      <section className="py-8">
        <div className="flex items-center gap-3"><FileCheck2 className="h-6 w-6 text-mansagold" /><h2 className="text-xl font-semibold">Agreement pending legal review</h2></div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">There is no agreement to accept, sign or download here. This preparation page is not a contract, legal advice, proof of vendor coverage or a certification of compliance with the Health Insurance Portability and Accountability Act (HIPAA).</p>
        <Button disabled className="mt-5"><Lock className="mr-2 h-4 w-4" />Signing unavailable</Button>
      </section>
      <section className="border-t py-8"><h2 className="text-xl font-semibold">Required before clinic signing</h2>
        <div className="mt-4 divide-y">{reviewItems.map((item, index) => <div key={item.title} className="flex gap-4 py-5"><span className="text-sm font-semibold text-mansagold">0{index + 1}</span><div><h3 className="font-medium">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.detail}</p></div></div>)}</div>
      </section>
      <section className="border-t py-8"><div className="flex items-center gap-3"><ShieldCheck className="h-6 w-6 text-mansagold" /><h2 className="text-xl font-semibold">A signature does not activate patient data</h2></div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Clinic signatures and reported coverage cannot approve this environment. Real records require independently verified attorney clearance, signed clinic and vendor agreements, dedicated approved healthcare services and verified safeguards. Patient calls require separate consent and safety approval.</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Do not send patient records, identifying case details or patient information through this page, clinic forms, Kayla, email or support. Kayla is an AI assistant—not a doctorate holder or licensed clinician.</p>
        <Button variant="outline" asChild className="mt-5"><Link to="/health/app">Open pilot readiness checklist<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
      </section>
      <footer className="border-t pt-6 text-xs text-muted-foreground">1325.AI · 1325 Clinical · Fictional records only until healthcare clearance</footer>
    </main>
  </div>;
}