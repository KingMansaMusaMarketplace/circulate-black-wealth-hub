// Stations 3–6 pilot rehearsals. Fixed sample figures only: nothing is charged, filed, saved or sent.
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const box = 'border border-primary/40 rounded-lg p-5 bg-card';
const note = 'text-xs text-primary mt-2';
const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const MENU = [
  { name: 'Fall Roast latte', price: 5.5 },
  { name: 'Drip coffee', price: 3 },
  { name: 'Sweet potato scone', price: 4.25 },
  { name: 'Bag of beans (12 oz)', price: 16 },
];
export const TAX_RATE = 0.1025; // sample Chicago-area rate
export const POINTS_PER_DOLLAR = 10;
export function orderTotals(qty: number[]) {
  const subtotal = qty.reduce((s, q, i) => s + q * MENU[i].price, 0);
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  return { subtotal, tax, total: subtotal + tax, points: Math.floor(subtotal) * POINTS_PER_DOLLAR };
}

export function CommercePilot() {
  const [qty, setQty] = useState(MENU.map(() => 0));
  const [paid, setPaid] = useState(false);
  const t = orderTotals(qty);
  const bump = (i: number, d: number) => { setPaid(false); setQty(q => q.map((v, j) => (j === i ? Math.max(0, v + d) : v))); };
  return (
    <div className={`${box} mb-8`}>
      <h3 className="font-semibold mb-3">Try it: ring up an order <span className="text-xs text-muted-foreground">(simulated)</span></h3>
      <ul className="space-y-2 mb-4">{MENU.map((m, i) => (
        <li key={m.name} className="flex items-center justify-between gap-3 text-sm">
          <span>{m.name} · {money(m.price)}</span>
          <span className="flex items-center gap-2"><Button size="sm" variant="outline" onClick={() => bump(i, -1)} aria-label={`Remove ${m.name}`}>−</Button><span className="w-6 text-center">{qty[i]}</span><Button size="sm" variant="outline" onClick={() => bump(i, 1)} aria-label={`Add ${m.name}`}>+</Button></span>
        </li>))}
      </ul>
      <p className="text-sm">Subtotal {money(t.subtotal)} · Tax {money(t.tax)} · <strong>Total {money(t.total)}</strong></p>
      <p className="text-sm text-muted-foreground">Customer earns {t.points} loyalty points</p>
      <Button size="sm" className="mt-3" disabled={t.subtotal === 0} onClick={() => setPaid(true)}>Take payment</Button>
      {paid && <p className={note}>Paid in rehearsal — no card was charged.</p>}
    </div>
  );
}

export const STARTING_CASH = 18400;
export const MONTHLY_COSTS = 31200;
export function cashForecast(monthlySales: number, months = 6) {
  const out: number[] = [];
  let cash = STARTING_CASH;
  for (let m = 0; m < months; m++) { cash += monthlySales - MONTHLY_COSTS; out.push(cash); }
  return out;
}

export function FinancePilot() {
  const [sales, setSales] = useState(34000);
  const f = cashForecast(sales);
  const low = Math.min(...f);
  const max = Math.max(...f.map(Math.abs), 1);
  return (
    <div className={`${box} mb-8`}>
      <h3 className="font-semibold mb-1">Try it: 6-month cash forecast <span className="text-xs text-muted-foreground">(sample)</span></h3>
      <p className="text-sm text-muted-foreground mb-3">Owen starts from {money(STARTING_CASH)} in the bank and {money(MONTHLY_COSTS)} monthly costs. Move the slider to change monthly sales.</p>
      <label className="text-sm block mb-4">Monthly sales: <strong>{money(sales)}</strong>
        <input type="range" min={20000} max={50000} step={500} value={sales} onChange={e => setSales(Number(e.target.value))} className="w-full mt-2 accent-primary" />
      </label>
      <div className="flex items-end gap-2 h-32 mb-2">{f.map((c, i) => (
        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
          <div className={c < 0 ? 'w-full bg-destructive rounded-t' : 'w-full bg-primary rounded-t'} style={{ height: `${Math.max(4, (Math.abs(c) / max) * 100)}%` }} />
          <span className="text-[10px] text-muted-foreground mt-1">M{i + 1}</span>
        </div>))}
      </div>
      <p className="text-sm">{low < 0 ? `Owen's alert: cash runs out by month ${f.findIndex(c => c < 0) + 1}. Consider a grant or a small loan.` : `Owen's note: cash stays positive; lowest point ${money(low)}.`}</p>
    </div>
  );
}

const DOCS = [
  { name: 'City health permit', days: 30 },
  { name: 'Business liability insurance', days: 12 },
  { name: 'Bean supplier contract', days: 75 },
  { name: 'Illinois sales tax registration', days: 210 },
];
export function OperationsPilot() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  return (
    <div className={`${box} mb-8`}>
      <h3 className="font-semibold mb-1">Try it: document vault <span className="text-xs text-muted-foreground">(sample)</span></h3>
      <p className="text-sm text-muted-foreground mb-3">Hugo watches every renewal date and prepares the paperwork.</p>
      <ul className="space-y-2">{[...DOCS].sort((a, b) => a.days - b.days).map(d => (
        <li key={d.name} className="flex flex-wrap items-center justify-between gap-3 border border-border rounded-md p-3 text-sm">
          <span>{d.name}<span className={`block text-xs ${d.days <= 30 ? 'text-destructive' : 'text-muted-foreground'}`}>Renews in {d.days} days</span></span>
          {done[d.name] ? <span className="text-xs text-primary">Renewal packet prepared (rehearsal — nothing filed)</span>
            : <Button size="sm" variant={d.days <= 30 ? 'default' : 'outline'} onClick={() => setDone(x => ({ ...x, [d.name]: true }))}>Prepare renewal</Button>}
        </li>))}
      </ul>
    </div>
  );
}

export const LOCAL_SHARE = 0.68; // sample share of spending that stays with local suppliers and staff
export function impactFor(monthlySales: number) {
  const local = Math.round(monthlySales * LOCAL_SHARE);
  return { local, yearly: local * 12 };
}
export function CommunityPilot() {
  const [sales, setSales] = useState(34000);
  const i = impactFor(sales);
  const [shared, setShared] = useState(false);
  return (
    <div className={`${box} mb-8`}>
      <h3 className="font-semibold mb-1">Try it: community impact report <span className="text-xs text-muted-foreground">(sample)</span></h3>
      <label className="text-sm block mb-3">Monthly sales: <strong>{money(sales)}</strong>
        <input type="range" min={10000} max={60000} step={1000} value={sales} onChange={e => { setSales(Number(e.target.value)); setShared(false); }} className="w-full mt-2 accent-primary" />
      </label>
      <p className="text-sm">About {Math.round(LOCAL_SHARE * 100)}% stays local (sample assumption): <strong>{money(i.local)}</strong> a month, <strong>{money(i.yearly)}</strong> a year recirculated with Black-owned suppliers and neighborhood staff.</p>
      <Button size="sm" className="mt-3" onClick={() => setShared(true)}>Create shareable badge</Button>
      {shared && <p className={note}>Badge created in rehearsal — nothing was published. Figures are illustrative.</p>}
    </div>
  );
}
