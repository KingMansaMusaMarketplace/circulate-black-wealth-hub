import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Compass, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EXECUTIVE_TOUR_STEPS, ExecutiveTourTab } from './executive-tour';
import ClinicalVoiceGuide from './ClinicalVoice';

type Props = { onStep: (tab: ExecutiveTourTab, step: number) => void; onEnd: () => void };

/** Navigation only: never generates, signs, sends, or saves a clinical record. */
export default function ExecutiveWalkthrough({ onStep, onEnd }: Props) {
  const [index, setIndex] = useState<number | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const step = index === null ? undefined : EXECUTIVE_TOUR_STEPS[index];
  useEffect(() => { if (index !== null) heading.current?.focus({ preventScroll: true }); }, [index]);
  const go = (next: number) => {
    const target = EXECUTIVE_TOUR_STEPS[next];
    if (!target) return;
    setIndex(next); onStep(target.tab, next);
  };
  const end = () => { setIndex(null); onEnd(); trigger.current?.focus({ preventScroll: true }); };
  return <section aria-label="Executive walkthrough" className="mb-6 border-y border-mansagold/30 py-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3"><Compass aria-hidden="true" className="h-5 w-5 shrink-0 text-mansagold" /><div><p className="font-semibold">Executive walkthrough</p><p className="text-xs text-muted-foreground">About 2 minutes · fictional visits only</p></div></div>
      <Button ref={trigger} className={`h-auto whitespace-normal bg-mansagold py-2 text-mansablue hover:bg-mansagold-dark ${step ? 'hidden' : ''}`} onClick={() => go(0)}><Compass />Start 2-minute walkthrough</Button>
      {step && <Button variant="ghost" size="icon" title="Exit walkthrough" aria-label="Exit walkthrough" onClick={end}><X /></Button>}
    </div>
    {step && index !== null && <div className="mt-4 space-y-4" onKeyDown={(event) => { if (event.key === 'Escape') { event.stopPropagation(); end(); } }}>
      <nav aria-label="Walkthrough steps" className="grid grid-cols-2 gap-2 lg:grid-cols-4">{EXECUTIVE_TOUR_STEPS.map((item, number) => <Button key={item.id} variant="ghost" aria-current={number === index ? 'step' : undefined} onClick={() => go(number)} className={`h-auto justify-start whitespace-normal border-l-2 py-2 text-left ${number === index ? 'border-mansagold bg-mansagold/10 text-mansagold' : 'border-border text-muted-foreground'}`}><span className="shrink-0">{number + 1}.</span>{item.label}</Button>)}</nav>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 flex-1"><p className="text-xs text-mansagold">Step {index + 1} of 4 · suggested {step.seconds} seconds</p><h2 ref={heading} tabIndex={-1} className="mt-1 text-lg font-semibold focus:outline-none">{step.title}</h2><p className="mt-1 text-sm text-muted-foreground">{step.detail}</p></div>
        <div className="flex shrink-0 gap-2"><Button variant="outline" size="icon" disabled={index === 0} title="Previous step" aria-label="Previous step" onClick={() => go(index - 1)}><ArrowLeft /></Button><Button onClick={() => index === EXECUTIVE_TOUR_STEPS.length - 1 ? end() : go(index + 1)}>{index === EXECUTIVE_TOUR_STEPS.length - 1 ? <><Check />Finish walkthrough</> : <>Next step<ArrowRight /></>}</Button></div>
      </div>
    </div>}
    <ClinicalVoiceGuide tourId={step?.id} />
  </section>;
}