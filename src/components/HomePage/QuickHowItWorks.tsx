import React from 'react';
import { Search, ShoppingBag, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Discover',
    description: 'Find verified businesses near you in the largest Black-owned business directory.',
  },
  {
    icon: ShoppingBag,
    title: 'Support',
    description: 'Shop, scan QR codes, and earn loyalty points with every purchase.',
  },
  {
    icon: TrendingUp,
    title: 'Circulate',
    description: 'Watch your dollars build community wealth and track your economic impact.',
  },
];

const QuickHowItWorks: React.FC = () => {
  return (
    <section className="py-8 md:py-16 bg-gradient-to-b from-[#030712] via-[#050a18] to-[#000000]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold text-mansagold uppercase tracking-wider">How It Works</span>
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-2">
            Three Steps to <span className="text-mansagold">Economic Power</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative group bg-slate-900/60 border border-white/10 rounded-2xl p-6 text-center hover:border-mansagold/40 transition-all duration-300"
            >
              {/* Step number */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-mansagold text-mansablue-dark text-xs font-bold flex items-center justify-center shadow-lg">
                {i + 1}
              </div>

              <div className="w-12 h-12 rounded-xl bg-mansagold/10 border border-mansagold/20 flex items-center justify-center mx-auto mt-2 mb-4">
                <step.icon className="w-6 h-6 text-mansagold" />
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickHowItWorks;
