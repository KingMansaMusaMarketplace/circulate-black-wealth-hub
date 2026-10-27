// Interactive pilot rehearsals for the 1325 OS walkthrough. Fixed sample scenarios only:
// nothing is sent, posted, saved or charged. Timers simulate activity locally.
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Pause, Play, RotateCcw } from 'lucide-react';

type Task = { agent: string; dept: string; action: string; needsOk?: boolean };

export const DISPATCH_SCRIPT: Task[] = [
  { agent: 'Kayla', dept: 'Command', action: 'Read overnight sales: 212 orders (sample) and prepared the 7:00 AM briefing.' },
  { agent: 'Maya', dept: 'Customer Success', action: 'Drafted a reply to a 2-star review about slow Saturday service.', needsOk: true },
  { agent: 'Aria', dept: 'Marketing', action: 'Drafted 4 weekend posts for the new Fall Roast.', needsOk: true },
  { agent: 'Owen', dept: 'Finance', action: 'Flagged that oat-milk costs rose 9% this month (sample).' },
  { agent: 'Theo', dept: 'Sales', action: 'Found 3 nearby offices that could order catering.', needsOk: true },
  { agent: 'Hugo', dept: 'Legal', action: 'Reminded you the health permit renews in 30 days.' },
  { agent: 'Tess', dept: 'Engineering', action: 'Checked the online menu: all 18 items load correctly.' },
  { agent: 'Vera', dept: 'Operations', action: 'Suggested adding one barista 8–11 AM Saturdays.', needsOk: true },
];

export function DispatchBoard() {
  const [shown, setShown] = useState(2);
  const [running, setRunning] = useState(true);
  const [approved, setApproved] = useState<Record<number, 'yes' | 'no'>>({});
  useEffect(() => {
    if (!running || shown >= DISPATCH_SCRIPT.length) return;
    const t = setTimeout(() => setShown(n => n + 1), 3500);
    return () => clearTimeout(t);
  }, [running, shown]);
  const waiting = DISPATCH_SCRIPT.slice(0, shown).filter((x, i) => x.needsOk && !approved[i]).length;
  return (
    <div className="border border-primary/40 rounded-lg p-5 bg-card mb-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-semibold">Live dispatch board <span className="text-xs text-muted-foreground">(simulated)</span></h3>
          <p className="text-sm text-muted-foreground">{shown} tasks handled · {waiting} waiting for your OK</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setRunning(r => !r)}>{running ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}{running ? 'Pause' : 'Play'}</Button>
          <Button size="sm" variant="ghost" onClick={() => { setShown(2); setApproved({}); setRunning(true); }}><RotateCcw className="h-4 w-4 mr-1" />Restart</Button>
        </div>
      </div>
      <ol className="space-y-2">
        {DISPATCH_SCRIPT.slice(0, shown).map((t, i) => (
          <li key={i} className="flagship-rise flex flex-wrap items-center gap-3 border border-border rounded-md p-3">
            <span className="text-sm font-medium w-36 shrink-0">{t.agent} <span className="block text-xs text-muted-foreground">{t.dept}</span></span>
            <span className="text-sm flex-1 min-w-[12rem]">{t.action}</span>
            {t.needsOk && (approved[i]
              ? <span className="text-xs text-primary">{approved[i] === 'yes' ? 'Approved (rehearsal — nothing sent)' : 'Declined'}</span>
              : <span className="flex gap-2"><Button size="sm" onClick={() => setApproved(a => ({ ...a, [i]: 'yes' }))}><Check className="h-4 w-4 mr-1" />Approve</Button><Button size="sm" variant="outline" onClick={() => setApproved(a => ({ ...a, [i]: 'no' }))}>Decline</Button></span>)}
          </li>
        ))}
      </ol>
    </div>
  );
}

const REVIEWS = [
  { stars: 2, text: 'Coffee was great but we waited 20 minutes on Saturday.', reply: { warm: 'Thank you for the kind words about our coffee, and we’re truly sorry about the Saturday wait. We’re adding a barista on weekend mornings — next cup is on us.', formal: 'Thank you for your feedback. We apologize for the delay on Saturday and have added weekend staffing to improve service times.' } },
  { stars: 5, text: 'Best Fall Roast in Chicago. Friendly staff!', reply: { warm: 'This made our whole team smile! So glad you love the Fall Roast — see you soon in Bronzeville.', formal: 'Thank you for your review. We are pleased you enjoyed the Fall Roast and our service.' } },
];
const POSTS = {
  Instagram: '☕ Fall Roast is here. Notes of cinnamon, dark cocoa and Bronzeville pride. #ChicagoCoffee #BuyBlack',
  LinkedIn: 'Proud to launch our Fall Roast, sourced through Black-owned growers. Office catering available for South Side teams.',
  Email: 'Subject: Your first sip of fall is waiting — Fall Roast is back this week with 10% off for members.',
};

export function MarketingSandbox() {
  const [r, setR] = useState(0);
  const [tone, setTone] = useState<'warm' | 'formal'>('warm');
  const [channel, setChannel] = useState<keyof typeof POSTS>('Instagram');
  const [ok, setOk] = useState<string | null>(null);
  return (
    <div className="grid gap-4 md:grid-cols-2 mb-8">
      <div className="border border-primary/40 rounded-lg p-5 bg-card">
        <h3 className="font-semibold mb-3">Try it: reply to a review</h3>
        <div className="flex gap-2 mb-3">{REVIEWS.map((x, i) => <Button key={i} size="sm" variant={i === r ? 'default' : 'outline'} onClick={() => { setR(i); setOk(null); }}>{x.stars}★ review</Button>)}</div>
        <p className="text-sm italic text-muted-foreground mb-3">“{REVIEWS[r].text}”</p>
        <div className="flex gap-2 mb-3">{(['warm', 'formal'] as const).map(t => <Button key={t} size="sm" variant={t === tone ? 'secondary' : 'ghost'} onClick={() => { setTone(t); setOk(null); }}>{t === 'warm' ? 'Warm tone' : 'Formal tone'}</Button>)}</div>
        <p className="text-sm border border-border rounded-md p-3 mb-3">Maya’s draft: {REVIEWS[r].reply[tone]}</p>
        <Button size="sm" onClick={() => setOk('review')}>Approve reply</Button>
        {ok === 'review' && <p className="text-xs text-primary mt-2">Approved in rehearsal — nothing was posted.</p>}
      </div>
      <div className="border border-primary/40 rounded-lg p-5 bg-card">
        <h3 className="font-semibold mb-3">Try it: launch a campaign</h3>
        <div className="flex flex-wrap gap-2 mb-3">{(Object.keys(POSTS) as (keyof typeof POSTS)[]).map(c => <Button key={c} size="sm" variant={c === channel ? 'default' : 'outline'} onClick={() => { setChannel(c); setOk(null); }}>{c}</Button>)}</div>
        <p className="text-sm border border-border rounded-md p-3 mb-3">Aria’s draft: {POSTS[channel]}</p>
        <Button size="sm" onClick={() => setOk('post')}>Schedule post</Button>
        {ok === 'post' && <p className="text-xs text-primary mt-2">Scheduled in rehearsal — nothing was sent.</p>}
      </div>
    </div>
  );
}
