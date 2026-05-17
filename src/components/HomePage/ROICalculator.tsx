import React, { useState } from 'react';
import { Calculator, DollarSign } from 'lucide-react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { Slider } from '@/components/ui/slider';

const ROICalculator = () => {
  const [monthlySpend, setMonthlySpend] = useState([2500]);
  const kaylaProCost = 299;
  const savings = monthlySpend[0] - kaylaProCost;
  const annualSavings = savings * 12;
  const multiplier = (monthlySpend[0] / kaylaProCost).toFixed(1);

  return (
    <ScrollReveal delay={0.3}>
      <div className="max-w-2xl mx-auto mt-12 p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-slate-800/80 via-slate-900/90 to-slate-800/80 border border-mansagold/20 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-mansagold/20">
            <Calculator className="w-5 h-5 text-mansagold" />
          </div>
          <h3 className="text-xl font-bold text-white">Savings Estimator</h3>
        </div>

        <p className="text-sm text-white/60 mb-6">
          How much do you currently spend per month on staff for marketing, bookkeeping, reviews, and admin?
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/70">Your current monthly cost</span>
            <span className="text-2xl font-bold text-white">${monthlySpend[0].toLocaleString()}/mo</span>
          </div>

          <Slider
            value={monthlySpend}
            onValueChange={setMonthlySpend}
            min={500}
            max={6000}
            step={50}
            className="py-4"
          />

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-2xl font-bold text-green-400">${savings.toLocaleString()}</span>
              </div>
              <span className="text-xs text-white/50">Monthly savings</span>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-mansagold">${annualSavings.toLocaleString()}</span>
              <br />
              <span className="text-xs text-white/50">Annual savings</span>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-white">{multiplier}x</span>
              <br />
              <span className="text-xs text-white/50">Value multiplier</span>
            </div>
          </div>

          <p className="text-[11px] text-white/40 italic pt-2 text-center">
            Based on your inputs. Actual results vary by business size and usage.
          </p>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default ROICalculator;
