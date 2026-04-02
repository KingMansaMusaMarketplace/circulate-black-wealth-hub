
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Crown, Building2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ScrollReveal from '@/components/animations/ScrollReveal';

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const navigate = useNavigate();

  const tiers = [
    {
      name: 'Starter',
      icon: Zap,
      monthlyPrice: 49,
      annualPrice: 490,
      description: 'Perfect for solo entrepreneurs getting started',
      highlight: false,
      features: [
        'AI-powered records management',
        'Basic business directory listing',
        'Community marketplace access',
        'Email support',
        'Monthly impact reports',
      ],
      cta: 'Get Started',
    },
    {
      name: 'Pro',
      icon: Crown,
      monthlyPrice: 149,
      annualPrice: 1490,
      description: 'Full suite of 24+ AI-powered services',
      highlight: true,
      badge: 'Most Popular',
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
    },
    {
      name: 'Enterprise',
      icon: Building2,
      monthlyPrice: 399,
      annualPrice: null,
      description: 'Multi-location support & white-labeling',
      highlight: false,
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
    <section className="-mt-24 pb-2 relative z-10">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal>
          <div className="flex justify-center mb-8">
            <a
              href="/business-signup"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-mansagold text-black font-bold text-base md:text-lg shadow-lg shadow-mansagold/20 hover:shadow-xl hover:shadow-mansagold/30 hover:scale-105 transition-all duration-300"
            >
              Press to See How Kayla Saves You Money
            </a>
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
              Replace $1,650–$5,750/month in labor costs with an autonomous AI employee. 
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

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {tiers.map((tier, index) => (
            <ScrollReveal key={tier.name} delay={index * 0.15}>
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
                
                <div className={`rounded-2xl p-6 lg:p-8 h-full flex flex-col ${
                  tier.highlight
                    ? 'bg-gradient-to-b from-slate-900 via-slate-800/95 to-slate-900'
                    : 'bg-slate-900/80 backdrop-blur-xl'
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${
                      tier.highlight ? 'bg-mansagold/20' : 'bg-white/10'
                    }`}>
                      <tier.icon className={`w-5 h-5 ${
                        tier.highlight ? 'text-mansagold' : 'text-white/70'
                      }`} />
                    </div>
                    <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                  </div>

                  <p className="text-sm text-white/60 mb-6">{tier.description}</p>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">
                        ${tier.monthlyPrice}
                      </span>
                      <span className="text-white/50">/mo</span>
                    </div>
                    {isAnnual && tier.annualPrice && (
                      <p className="text-xs text-mansagold mt-1">
                        ${tier.annualPrice}/year — save ${tier.monthlyPrice * 12 - tier.annualPrice}
                      </p>
                    )}
                    {tier.name === 'Enterprise' && (
                      <p className="text-xs text-white/40 mt-1">Custom annual pricing available</p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          tier.highlight ? 'text-mansagold' : 'text-green-400'
                        }`} />
                        <span className="text-sm text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => navigate(tier.name === 'Enterprise' ? '/sponsorship' : '/login')}
                    className={`w-full group ${
                      tier.highlight
                        ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 hover:from-amber-500 hover:via-yellow-500 hover:to-orange-500 text-slate-900 font-semibold shadow-lg shadow-mansagold/25'
                        : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                    }`}
                    size="lg"
                  >
                    {tier.cta}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.5}>
          <p className="text-center text-white/40 text-sm mt-8">
            All plans include a 14-day free trial. No credit card required to start.
            <br />
            Pro & Enterprise include a one-time $149 onboarding fee.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default PricingSection;
