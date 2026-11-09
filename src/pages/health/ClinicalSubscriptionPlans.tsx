import { Check, LockKeyhole, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clinicalMonthlyTotal, clinicalSubscriptionPlans, clinicalSubscriptionPolicy } from './subscription-plans';

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default function ClinicalSubscriptionPlans() {
  return <section id="subscriptions" aria-labelledby="subscriptions-title" className="border-y border-border bg-card scroll-mt-6">
    <div className="mx-auto max-w-6xl px-6 py-14">
      <p className="text-sm font-medium text-primary">PLANNED SUBSCRIPTIONS · U.S. PRICING</p>
      <h2 id="subscriptions-title" className="mt-3 text-3xl font-display">A plan for your clinical team.</h2>
      <p className="mt-4 max-w-2xl text-muted-foreground">Future plans—not yet available. Activation requires legal, vendor and healthcare clearance, plus owner-approved country-specific pricing. No launch date is promised.</p>
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {clinicalSubscriptionPlans.map(plan => {
          const fiveClinicians = clinicalMonthlyTotal(plan.id, 5);
          return <article key={plan.id} className="flex min-w-0 flex-col rounded-lg border border-border bg-background p-6">
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <p className="mt-2 min-h-10 text-sm text-muted-foreground">{plan.description}</p>
            <div className="mt-6 min-h-32">
              {plan.listMonthlyPerClinician === null || plan.monthlyPerClinician === null ? <>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Enterprise agreement</p>
                <p className="mt-2 text-3xl font-semibold">Custom quote</p>
                <p className="mt-2 text-sm text-muted-foreground">Scope and terms agreed in writing</p>
              </> : <>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Standard enterprise list price</p>
                <p className="mt-1 text-lg text-muted-foreground"><s aria-label={`List price ${usd.format(plan.listMonthlyPerClinician)} per clinician per month`}>{usd.format(plan.listMonthlyPerClinician)}</s><span className="text-sm"> / month</span></p>
                <p className="mt-3 text-xs font-medium uppercase tracking-wide text-primary">Founding Clinic Cohort rate</p>
                <p className="mt-1 text-3xl font-semibold">{usd.format(plan.monthlyPerClinician)}</p>
                <p className="mt-1 text-sm text-muted-foreground">per clinician / month · USD</p>
                <p className="mt-3 inline-flex rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{clinicalSubscriptionPolicy.foundingRateLockYears}-year rate lock · Founding Cohort</p>
              </>}
            </div>
            <div className="mt-4 min-h-16 border-y border-border py-3 text-sm">
              {fiveClinicians === null ? <p>Connections, migration and training priced to scope.</p> : <><p className="text-muted-foreground">For five clinicians</p><p className="mt-1 font-semibold">{usd.format(fiveClinicians)} / month</p></>}
            </div>
            <p className="mt-6 text-xs font-medium text-primary">PLANNED FEATURES</p>
            <ul className="mb-8 mt-4 flex-1 space-y-4 text-sm">{plan.features.map(feature => <li key={feature} className="flex gap-3"><Check aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" /><span>{feature}</span></li>)}</ul>
            <Button disabled={!clinicalSubscriptionPolicy.checkoutEnabled} variant="outline" className="w-full"><LockKeyhole aria-hidden="true" />Not yet available</Button>
          </article>;
        })}
      </div>
      <div className="mt-8 grid gap-6 border-b border-border pb-6 md:grid-cols-2">
        <div><h3 className="flex items-center gap-2 font-semibold"><Users aria-hidden="true" className="h-5 w-5 shrink-0 text-primary" />Administrative staff included</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Ordinary receptionist and administrative assistant accounts are included—no separate per-person charge.</p></div>
        <div><h3 className="font-semibold">42 Agentic AI Employees ecosystem</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Planned access with defined usage and available workflows—not unlimited labor or 42 clinically validated workers.</p></div>
      </div>
      <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">Country-specific prices remain to be announced. Complex connections, migration and training are quoted separately before signing. Clinical subscriptions are separate from 1325.AI business plans, with overlapping access addressed in the agreement. The Founding Clinic Cohort rate is a planned early-adopter grant for pilot practices, locked for {clinicalSubscriptionPolicy.foundingRateLockYears} years from a signed agreement; nothing is charged today. The Founding Clinic list stays free and non-binding.</p>
    </div>
  </section>;
}