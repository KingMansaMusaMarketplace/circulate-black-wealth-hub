import { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

/** Navigation shortcut only: opens existing fictional screens and unlocks nothing. */
export const START_HERE_STEPS = [
  { k: 'doctor-day', title: "Doctor's Day", text: "See today's sample schedule." },
  { k: 'notes', title: 'Visit note', text: 'Kayla drafts; the doctor reviews and signs.' },
  { k: 'billing', title: 'Billing', text: 'See codes prepared from the sample visit.' },
] as const;

const KEY = 'clinical-start-here-hidden';

export default function StartHere({ current, onGo }: { current: string; onGo: (k: string) => void }) {
  const [hidden, setHidden] = useState(() => { try { return localStorage.getItem(KEY) === '1'; } catch { return false; } });
  const hide = () => { setHidden(true); try { localStorage.setItem(KEY, '1'); } catch { /* ignore */ } };
  if (hidden) return <Button variant="ghost" size="sm" className="mb-4" onClick={() => { setHidden(false); try { localStorage.removeItem(KEY); } catch { /* ignore */ } }}>Show "Start here"</Button>;
  return <section aria-label="Start here" className="mb-6 rounded-xl border border-mansagold/40 bg-mansagold/5 p-4">
    <div className="mb-3 flex items-center justify-between gap-2">
      <h2 className="text-lg font-semibold">Start here · 3 steps</h2>
      <Button variant="ghost" size="sm" onClick={hide}><X className="mr-1 h-4 w-4" />Skip, show all features</Button>
    </div>
    <ol className="grid gap-3 sm:grid-cols-3">
      {START_HERE_STEPS.map((s, i) => <li key={s.k}>
        <Button variant={current === s.k ? 'default' : 'outline'} onClick={() => onGo(s.k)} className="h-auto w-full flex-col items-start gap-1 whitespace-normal p-4 text-left">
          <span className="flex w-full items-center justify-between text-base font-semibold">{i + 1} · {s.title}<ArrowRight className="h-4 w-4" /></span>
          <span className="text-sm font-normal opacity-80">{s.text}</span>
        </Button>
      </li>)}
    </ol>
  </section>;
}
