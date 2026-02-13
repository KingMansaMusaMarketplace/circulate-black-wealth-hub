import React from 'react';
import { TrendingUp, Target, ArrowRight } from 'lucide-react';

const ThreePillars: React.FC = () => {
  return (
    <section className="hidden md:block py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
          <div className="bg-slate-800/80 border border-slate-600/50 rounded-xl p-4 md:p-5 transition-all duration-300 group">
            <div className="flex items-center gap-3 md:block">
              <div className="w-10 h-10 rounded-lg bg-mansagold/20 flex items-center justify-center md:mb-3 group-hover:scale-110 transition-transform shrink-0">
                <TrendingUp className="w-5 h-5 text-mansagold" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1 md:mb-2">CMAL Engine</h3>
                <p className="text-gray-300 text-sm">Circulatory Multiplier Attribution Logic tracks every dollar's community journey.</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-600/50 rounded-xl p-4 md:p-5 transition-all duration-300 group">
            <div className="flex items-center gap-3 md:block">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center md:mb-3 group-hover:scale-110 transition-transform shrink-0">
                <Target className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1 md:mb-2">Economic Karma</h3>
                <p className="text-gray-300 text-sm">Earn rewards for every purchase—turn spending into community investment.</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-600/50 rounded-xl p-4 md:p-5 transition-all duration-300 group">
            <div className="flex items-center gap-3 md:block">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center md:mb-3 group-hover:scale-110 transition-transform shrink-0">
                <ArrowRight className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1 md:mb-2">B2B Marketplace</h3>
                <p className="text-gray-300 text-sm">Black businesses buying from Black businesses—supply chain sovereignty.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThreePillars;
