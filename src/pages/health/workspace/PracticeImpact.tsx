import { useState } from 'react';
import { Calculator, Clock3, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { calculatePracticeImpact, PracticeInputs } from './practice-impact';

const fields: { key: keyof PracticeInputs; label: string; step: string; min: number; max?: number }[] = [
  { key: 'providers', label: 'Number of clinicians', step: '1', min: 1 },
  { key: 'daysPerMonth', label: 'Workdays per month, per clinician', step: '1', min: 0, max: 31 },
  { key: 'minutesPerDay', label: 'Estimated minutes freed per day, per clinician', step: 'any', min: 0, max: 1440 },
  { key: 'hourlyValue', label: 'Your value of a clinician hour (USD)', step: 'any', min: 0 },
  { key: 'monthlyCost', label: 'Total monthly scenario cost (USD)', step: 'any', min: 0 },
];
const blank = { providers: '', daysPerMonth: '', minutesPerDay: '', hourlyValue: '', monthlyCost: '' };
const number = (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 2 });
const money = (value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

export default function PracticeImpact() {
  const [values, setValues] = useState(blank);
  const [result, setResult] = useState<ReturnType<typeof calculatePracticeImpact> | null>(null);
  const [error, setError] = useState('');
  const reset = () => { setValues(blank); setResult(null); setError(''); };
  return <div className="space-y-6">
    <header className="flex flex-wrap items-start justify-between gap-4 border-b pb-5">
      <div><Badge variant="outline" className="mb-2 border-mansagold/40 text-mansagold">Your estimates · not measured results</Badge>
        <h2 className="text-xl font-semibold">Practice impact calculator</h2>
        <p className="mt-1 text-sm text-muted-foreground">Time capacity and modeled value · USD · no patient information</p>
      </div>
      <Button variant="ghost" size="icon" title="Reset calculator" aria-label="Reset calculator" onClick={reset}><RotateCcw className="h-4 w-4" /></Button>
    </header>
    <div className="grid items-start gap-8 xl:grid-cols-2">
      <form className="min-w-0 space-y-5" onSubmit={(event) => {
        event.preventDefault(); setResult(null); setError('');
        if (Object.values(values).some((value) => value.trim() === '')) { setError('Enter every estimate, including zero where appropriate.'); return; }
        try { setResult(calculatePracticeImpact({ providers: Number(values.providers), daysPerMonth: Number(values.daysPerMonth), minutesPerDay: Number(values.minutesPerDay), hourlyValue: Number(values.hourlyValue), monthlyCost: Number(values.monthlyCost) })); }
        catch (failure) { setError(failure instanceof Error ? failure.message : 'Check your estimates.'); }
      }}>
        {fields.map((field) => <div key={field.key} className="space-y-2"><Label htmlFor={`impact-${field.key}`}>{field.label}</Label>
          <Input id={`impact-${field.key}`} type="number" inputMode="decimal" required min={field.min} max={field.max} step={field.step} value={values[field.key]} onChange={(event) => { setValues((prev) => ({ ...prev, [field.key]: event.target.value })); setResult(null); setError(''); }} />
        </div>)}
        <p className="text-xs text-muted-foreground">Use your own expected time reduction and total monthly costs, including implementation or review costs you choose to include. This is not a 1325 Clinical price quote.</p>
        <Button type="submit"><Calculator className="mr-2 h-4 w-4" />Calculate scenario</Button>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      </form>
      <section aria-label="Practice impact results" className="min-w-0 space-y-5 border-t pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
        <h3 className="flex items-center gap-2 font-semibold"><Clock3 className="h-4 w-4 text-mansagold" />Monthly scenario</h3>
        {!result ? <p className="text-sm text-muted-foreground">No scenario calculated.</p> : <div role="status" className="space-y-5">
          <div className="border-b pb-5"><p className="text-sm text-muted-foreground">Estimated hours freed across the practice</p><p className="mt-2 break-words text-3xl font-semibold text-mansagold">{number(result.hoursPerMonth)} hours</p><p className="mt-1 text-xs text-muted-foreground">{number(result.hoursPerClinician)} hours per clinician per month</p></div>
          <dl className="space-y-4 text-sm">
            {[
              ['Modeled time-capacity value', money(result.capacityValue)],
              ['Your total monthly cost', money(Number(values.monthlyCost))],
              ['Modeled value minus cost', money(result.netModeledValue)],
              ['Modeled value / monthly cost', result.costCoverage === null ? 'Not applicable — zero cost entered' : `${number(result.costCoverage)}×`],
            ].map(([label, value]) => <div key={label} className="flex flex-wrap justify-between gap-2 border-b pb-3"><dt className="text-muted-foreground">{label}</dt><dd className="min-w-0 break-words font-semibold">{value}</dd></div>)}
          </dl>
          <p className="text-xs text-muted-foreground">Hours = clinicians × workdays × daily minutes ÷ 60. Capacity value = hours × your hourly value. Net modeled value = capacity value − your monthly cost.</p>
        </div>}
        <div className="border-l-2 border-mansagold pl-3 text-sm text-muted-foreground">Freed time is not automatically cash savings, billable revenue or additional visits. This scenario assumes your time estimate applies equally to every clinician and workday. Validate it in a properly approved pilot; real patient records remain locked.</div>
      </section>
    </div>
  </div>;
}