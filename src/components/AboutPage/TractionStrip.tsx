import React from 'react';
import { useLiveBusinessCount } from '@/hooks/use-live-business-count';

const TractionStrip = () => {
  const { rounded } = useLiveBusinessCount();

  const stats = [
    { value: rounded, label: 'Verified Businesses' },
    { value: '42', label: 'Agentic AI Employees' },
    { value: '46', label: 'Patent Claims Pending' },
    { value: '$12T', label: 'Global Black Economy' },
  ];

  return (
    <section className="px-6 py-14 border-b border-zinc-900">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="text-mansagold text-3xl md:text-4xl font-bold tracking-tight">
              {s.value}
            </div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-400 mt-2">
              {s.label}
            </div>
          </div>
        ))}
      </div>
      <p className="max-w-6xl mx-auto mt-8 text-xs text-zinc-500">
        U.S. Provisional Patent Application No. 63/969,202 — 46 claims pending.
      </p>
    </section>
  );
};

export default TractionStrip;
