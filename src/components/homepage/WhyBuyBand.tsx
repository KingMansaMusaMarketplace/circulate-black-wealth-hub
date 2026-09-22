import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, BadgeCheck, HeartHandshake, ArrowRight } from 'lucide-react';

/**
 * WhyBuyBand — the three reasons people buy, stated plainly:
 * trust (freedom from fear), standing (status), belonging (affiliation).
 * Presentational only.
 */
const DRIVERS = [
  {
    icon: ShieldCheck,
    label: 'Trust',
    body: 'We check every business before it appears. No dead links, no guesswork.',
    cta: 'Search the directory',
    to: '/directory',
  },
  {
    icon: BadgeCheck,
    label: 'Standing',
    body: 'Claim your listing and wear the verified badge. Owners get a profile customers recognise.',
    cta: 'Claim your listing',
    to: '/business-signup',
  },
  {
    icon: HeartHandshake,
    label: 'Belonging',
    body: 'Every purchase keeps the dollar in the community longer.',
    cta: 'See the impact',
    to: '/community-impact',
  },
] as const;

const WhyBuyBand: React.FC = () => (
  <section className="px-6 pb-20 -mt-4">
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-900 border border-zinc-900">
      {DRIVERS.map(({ icon: Icon, label, body, cta, to }) => (
        <div key={label} className="bg-black p-8 flex flex-col group hover:bg-zinc-950 transition-colors">
          <Icon className="w-6 h-6 text-mansagold mb-4" aria-hidden="true" />
          <h3 className="text-xl font-medium mb-3 text-white">{label}</h3>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-1">{body}</p>
          <Link
            to={to}
            className="inline-flex items-center gap-2 text-mansagold text-xs font-bold uppercase tracking-[0.15em] hover:gap-3 transition-all"
          >
            {cta}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      ))}
    </div>
  </section>
);

export default WhyBuyBand;
