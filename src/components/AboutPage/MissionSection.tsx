import React from 'react';

const pillars = [
  {
    title: 'Economic Rails',
    desc: 'Patent-protected infrastructure that supports intentional economic behavior.',
  },
  {
    title: 'Consumer Empowerment',
    desc: 'Turn spending into investing by rewarding loyalty to verified businesses.',
  },
  {
    title: 'Merchant Empowerment',
    desc: 'Visibility, loyalty programs, and direct new-customer pipelines for owners.',
  },
  {
    title: 'Data Ownership Moat',
    desc: 'The community owns its own economic data — a moat outside platforms cannot copy.',
  },
  {
    title: 'Legacy Engineering',
    desc: 'An educational, economic and cultural pillar built to outlast any one generation.',
  },
];

const MissionSection = () => {
  return (
    <section className="px-6 py-24 md:py-28 border-b border-zinc-900">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-mansagold mb-6">
            The Problem
          </div>
          <h2 className="text-3xl md:text-4xl font-light text-white mb-6 leading-snug">
            The Black dollar circulates for less than six hours.
          </h2>
          <p className="text-zinc-300 text-lg font-light leading-relaxed mb-6">
            In other communities it circulates for 28 days or more. Without structural
            intervention, that leakage repeats every generation.
          </p>
          <p className="text-white text-lg font-light leading-relaxed">
            Our mission: build, protect, and expand the community economic ecosystem through
            intentional consumer behavior, loyalty rewards, and strategic digital infrastructure.
          </p>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-mansagold mb-6">
            The Solution — Five Pillars
          </div>
          <ul className="divide-y divide-zinc-900 border-y border-zinc-900">
            {pillars.map((p, i) => (
              <li key={p.title} className="py-5 flex gap-5 group">
                <span className="text-zinc-600 text-sm font-mono pt-1">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-white font-medium mb-1 group-hover:text-mansagold transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
