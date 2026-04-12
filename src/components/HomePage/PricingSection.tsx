
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Crown, Building2, ArrowRight, Star, Calculator, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { Slider } from '@/components/ui/slider';

const ROICalculator = () => {
  const [monthlySpend, setMonthlySpend] = useState([2500]);
  const kaylaProCost = 149;
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
          <h3 className="text-xl font-bold text-white">ROI Calculator</h3>
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
        </div>
      </div>
    </ScrollReveal>
  );
};

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const navigate = useNavigate();

  const tiers = [
    {
      name: 'Essentials',
      icon: Star,
      monthlyPrice: 19,
      annualPrice: 190,
      description: 'Perfect for businesses just getting started with AI',
      highlight: false,
      trialText: '30-day free trial',
      features: [
        'Enhanced directory listing',
        'Kayla AI chat assistant',
        'Community marketplace access',
        'Up to 5 QR codes',
        'Email support',
      ],
      cta: 'Start Free Trial',
    },
    {
      name: 'Starter',
      icon: Zap,
      monthlyPrice: 49,
      annualPrice: 490,
      description: 'AI-powered records management & business tools',
      highlight: false,
      trialText: '30-day free trial',
      features: [
        'Everything in Essentials',
        'AI-powered records management',
        'Document vault & OCR extraction',
        'Expiration alerts & reminders',
        'Up to 25 QR codes',
        'Monthly impact reports',
      ],
      cta: 'Get Started',
    },
    {
      name: 'Pro',
      icon: Crown,
      monthlyPrice: 149,
      annualPrice: 1490,
      description: 'Full suite of 28 AI-powered services',
      highlight: true,
      badge: 'Most Popular',
      trialText: '14-day free trial',
      features: [
        'Everything in Starter',
        'Full Kayla AI concierge suite',
        'B2B matchmaking & connections',
        'Advanced analytics dashboard',
        'Priority support',
        'Marketing automation tools',
        'Custom branding options',
      ],
      cta: 'Start Pro Trial',
      footnote: 'Recommended for teams up to ~20 employees or a single location.',
    },
    {
      name: 'Enterprise',
      icon: Building2,
      monthlyPrice: 420,
      annualPrice: null,
      description: 'Multi-location support, white-labeling, and advanced integrations',
      highlight: false,
      trialText: '14-day free trial',
      pricePrefix: 'From ',
      priceSuffix: '+ $30/user/mo',
      footnote: 'Example: 30 users ≈ $1,320/month (about $15,840/year).',
      features: [
        'Everything in Pro',
        'Multi-location management',
        'White-label solutions',
        'Dedicated account manager',
        'Custom API integrations',
        'Enterprise SLA guarantee',
        'Team collaboration tools',
      ],
      cta: 'Contact Sales',
    },
  ];

  return (
    <section className="py-12 md:py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal>
          <div className="flex justify-center mb-8">
            <button
              onClick={() => navigate('/business-signup')}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-mansagold text-black font-bold text-base md:text-lg shadow-lg shadow-mansagold/20 hover:shadow-xl hover:shadow-mansagold/30 hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              Press to See How Kayla Saves You Money
            </button>
          </div>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mansagold/10 border border-mansagold/30 mb-6">
              <Sparkles className="w-4 h-4 text-mansagold" />
              <span className="text-sm font-medium text-mansagold">Simple, Transparent Pricing</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Power Your Business with <span className="text-mansagold">Kayla AI</span>
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
              Replace ~$12,100/mo in overhead with Kayla's 28 AI employees covering ~4 roles. 
              Choose the plan that fits your growth stage.
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center gap-3 p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  !isAnnual ? 'bg-mansagold text-slate-900' : 'text-white/60 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  isAnnual ? 'bg-mansagold text-slate-900' : 'text-white/60 hover:text-white'
                }`}
              >
                Annual
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isAnnual ? 'bg-slate-900/20 text-slate-900' : 'bg-green-500/20 text-green-400'
                }`}>
                  Save 17%
                </span>
              </button>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {tiers.map((tier, index) => (
            <ScrollReveal key={tier.name} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.3 }}
                className={`relative rounded-2xl p-[1px] h-full ${
                  tier.highlight
                    ? 'bg-gradient-to-b from-mansagold via-amber-500/50 to-mansagold/20'
                    : 'bg-white/10'
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="px-4 py-1 rounded-full bg-mansagold text-slate-900 text-xs font-bold uppercase tracking-wider">
                      {tier.badge}
                    </span>
                  </div>
                )}
                
                <div className={`rounded-2xl p-5 lg:p-6 h-full flex flex-col ${
                  tier.highlight
                    ? 'bg-gradient-to-b from-slate-900 via-slate-800/95 to-slate-900'
                    : 'bg-slate-900/80 backdrop-blur-xl'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${
                      tier.highlight ? 'bg-mansagold/20' : 'bg-white/10'
                    }`}>
                      <tier.icon className={`w-5 h-5 ${
                        tier.highlight ? 'text-mansagold' : 'text-white/70'
                      }`} />
                    </div>
                    <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                  </div>

                  <p className="text-xs text-white/60 mb-4">{tier.description}</p>

                  <div className="mb-5">
                    <div className="flex items-baseline gap-1">
                      {tier.pricePrefix && <span className="text-sm text-white/50">{tier.pricePrefix}</span>}
                      <span className="text-3xl font-bold text-white">
                        ${tier.monthlyPrice}
                      </span>
                      <span className="text-white/50 text-sm">/mo</span>
                    </div>
                    {tier.priceSuffix && (
                      <p className="text-xs text-white/50 mt-0.5">{tier.priceSuffix}</p>
                    )}
                    {isAnnual && tier.annualPrice && (
                      <p className="text-xs text-mansagold mt-1">
                        ${tier.annualPrice}/year — save ${tier.monthlyPrice * 12 - tier.annualPrice}
                      </p>
                    )}
                    {tier.name === 'Enterprise' && (
                      <p className="text-xs text-white/40 mt-1">Custom annual pricing available</p>
                    )}
                    {tier.footnote && (
                      <p className="text-[11px] text-white/40 mt-1 italic">{tier.footnote}</p>
                    )}
                    <p className="text-xs text-emerald-400 mt-1">{tier.trialText}</p>
                  </div>

                  <ul className="space-y-2.5 mb-6 flex-1">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                          tier.highlight ? 'text-mansagold' : 'text-green-400'
                        }`} />
                        <span className="text-xs text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => navigate(tier.name === 'Enterprise' ? '/contact' : '/business-signup')}
                    className={`w-full group ${
                      tier.highlight
                        ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 hover:from-amber-500 hover:via-yellow-500 hover:to-orange-500 text-slate-900 font-semibold shadow-lg shadow-mansagold/25'
                        : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                    }`}
                    size="default"
                  >
                    {tier.cta}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.4}>
          <p className="text-center text-white/80 text-sm mt-8">
            All plans include a free trial. A valid credit card is required to start.
            <br />
            Your card will be charged automatically after the trial period ends unless you cancel.
          </p>
        </ScrollReveal>

        <ROICalculator />
      </div>
    </section>
  );
};

export default PricingSection;
