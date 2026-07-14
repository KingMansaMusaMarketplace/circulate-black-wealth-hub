import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Lock, UserCheck, Eye, AlertTriangle, Code2, Database, BadgeDollarSign } from 'lucide-react';

const pillars = [
  {
    icon: Lock,
    title: 'No person ever holds the pool',
    body: 'Every contribution goes into a digital escrow account — not a "banker\'s" wallet or personal bank account. Funds only release when the circle\'s rules are met. Protected under U.S. Provisional Patent Application No. 63/969,202 — 27 claims pending.'
  },
  {
    icon: UserCheck,
    title: 'Verified identities only',
    body: 'Every member signs up through our authenticated account system. No anonymous strangers, no "cash app" handles. Every payout is tied to a real, verified user.'
  },
  {
    icon: Code2,
    title: 'Rules enforced by code, not people',
    body: 'Payout order, contribution amount, schedule, and member count are locked when the circle is created. Not even the organizer can quietly change the order or skip ahead.'
  },
  {
    icon: Eye,
    title: 'Full transparency for every member',
    body: 'You can always see who\'s in the circle, who has paid, who\'s next, and the projected payout date. No hidden ledger, no side deals.'
  },
  {
    icon: AlertTriangle,
    title: 'Miss-a-payment protection',
    body: 'If someone doesn\'t contribute, the system flags them and can remove them before they receive a payout — so no one can "collect and disappear."'
  },
  {
    icon: ShieldCheck,
    title: 'Platform-level fraud monitoring',
    body: 'Automated fraud-prevention actions (account restrictions, transaction blocks, review flags) run on top of every circle — a second safety net traditional Susus never had.'
  },
  {
    icon: Database,
    title: 'Locked-down data (Row-Level Security)',
    body: 'In plain English: even our own staff can\'t casually poke around in your circle\'s data. Access is enforced per user by the database itself.'
  },
  {
    icon: BadgeDollarSign,
    title: 'Transparent 1.5% platform fee',
    body: 'That small fee is exactly what pays for the escrow, fraud protection, and dispute handling — the safety infrastructure informal Susus never had.'
  }
];

const SusuSafetySection: React.FC = () => {
  return (
    <Card className="border border-mansagold/30 bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl">
      <CardHeader className="text-center pb-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-mansagold/30 to-amber-500/20 border border-mansagold/40 mx-auto mb-3">
          <ShieldCheck className="w-7 h-7 text-mansagold" />
        </div>
        <CardTitle className="text-3xl font-bold text-white">
          Is Susu Safe on 1325.AI?
        </CardTitle>
        <p className="text-slate-300 mt-3 max-w-3xl mx-auto leading-relaxed">
          You may have heard of Susu scams — those happened because <span className="text-mansagold font-semibold">one person held everyone's cash</span>.
          On 1325.AI, <span className="text-mansagold font-semibold">no person ever holds the pool</span>. It sits in patent-pending
          digital escrow, released only when the rules are met, on verified accounts, with fraud monitoring on top.
          It's a Susu with the culture intact and the risk engineered out.
        </p>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-4">
        {/* Old vs New comparison */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-5">
            <p className="text-red-300 font-semibold mb-2">❌ Traditional cash Susu</p>
            <ul className="text-slate-300 text-sm space-y-1.5 leading-relaxed">
              <li>• Cash-based, no paper trail</li>
              <li>• One "banker" personally holds everyone's money</li>
              <li>• No ID verification and no rules</li>
              <li>• No recourse if someone disappears</li>
            </ul>
          </div>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5">
            <p className="text-emerald-300 font-semibold mb-2">✅ 1325.AI Susu</p>
            <ul className="text-slate-300 text-sm space-y-1.5 leading-relaxed">
              <li>• Every dollar tracked in digital escrow</li>
              <li>• No person can touch the pool — code releases it</li>
              <li>• Verified accounts only</li>
              <li>• Fraud monitoring + platform accountability</li>
            </ul>
          </div>
        </div>

        {/* Security pillars grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="flex gap-4 p-4 rounded-xl bg-slate-900/50 border border-white/10 hover:border-mansagold/30 transition-all"
            >
              <div className="flex-shrink-0 p-2.5 rounded-lg bg-mansagold/10 h-fit">
                <p.icon className="w-5 h-5 text-mansagold" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">{p.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{p.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom trust badge */}
        <div className="mt-6 p-5 rounded-xl bg-gradient-to-r from-mansagold/10 to-amber-900/10 border border-mansagold/20">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-8 h-8 text-mansagold flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-semibold">Patent-Pending Digital Escrow</p>
              <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                Our Susu escrow technology is protected under U.S. Provisional Patent Application No. 63/969,202 — 27 claims pending.
                Your money is held by verified, auditable software — not by any single person.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SusuSafetySection;
