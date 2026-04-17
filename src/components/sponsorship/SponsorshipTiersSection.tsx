
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Crown, Star, Zap, ArrowRight, Gem } from 'lucide-react';

interface SponsorshipTiersSectionProps {
  onLearnMore: (tierName: string) => void;
}

const SponsorshipTiersSection: React.FC<SponsorshipTiersSectionProps> = ({ onLearnMore }) => {
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  const tiers = [
    {
      name: 'Founding Sponsor',
      price: '$1,750',
      period: '/month',
      annualPrice: '$21,000/yr',
      description: 'Entry tier for regional brands building a community footprint',
      icon: Star,
      popular: false,
      gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
      borderGlow: 'rgba(16, 185, 129, 0.3)',
      checkColor: 'text-emerald-400',
      features: [
        'Logo in platform footer',
        'Quarterly impact summary email',
        'Social media mention (1x/quarter)',
        'Founding Sponsor certificate',
        'Newsletter inclusion',
        'Locked rate for 12 months'
      ]
    },
    {
      name: 'Bronze Partner',
      price: '$5,000',
      period: '/month',
      annualPrice: '$50,000/yr',
      description: 'Foundation-level support for community impact',
      icon: Star,
      popular: false,
      gradient: 'from-orange-700 via-amber-600 to-yellow-700',
      borderGlow: 'rgba(194, 127, 50, 0.3)',
      checkColor: 'text-amber-600',
      features: [
        'Logo in platform footer',
        'Monthly impact summary email',
        'Social media mention (1x/month)',
        'Basic analytics reporting',
        'Sponsor certificate',
        'Community newsletter inclusion'
      ]
    },
    {
      name: 'Silver Partner',
      price: '$15,000',
      period: '/month',
      annualPrice: '$150,000/yr',
      description: 'Elevated visibility and strategic engagement',
      icon: Gem,
      popular: false,
      gradient: 'from-slate-300 via-gray-400 to-slate-500',
      borderGlow: 'rgba(148, 163, 184, 0.3)',
      checkColor: 'text-slate-400',
      features: [
        'Logo in footer, sidebar & directory',
        'Monthly newsletter feature',
        'Social media mentions (2x/month)',
        'Enhanced analytics reporting',
        'Community event co-branding',
        'Quarterly impact summary',
        'Dedicated onboarding session'
      ]
    },
    {
      name: 'Gold Partner',
      price: '$25,000',
      period: '/month',
      annualPrice: '$250,000/yr',
      description: 'Maximum visibility with premium benefits',
      icon: Crown,
      popular: true,
      gradient: 'from-amber-300 via-yellow-400 to-orange-400',
      borderGlow: 'rgba(251, 191, 36, 0.4)',
      checkColor: 'text-amber-400',
      features: [
        'Premium directory placement',
        'Rotating homepage banner ad',
        'Social media recognition (4x/month)',
        'Advanced analytics dashboard',
        'Event speaking opportunities',
        'Custom content co-creation',
        'Quarterly impact reports',
        'Dedicated partnership manager'
      ]
    },
    {
      name: 'Platinum Partner',
      price: '$50,000',
      period: '/month',
      annualPrice: '$500,000/yr',
      description: 'Exclusive tier for transformational partners',
      icon: Zap,
      popular: false,
      gradient: 'from-violet-400 via-purple-400 to-fuchsia-400',
      borderGlow: 'rgba(167, 139, 250, 0.3)',
      checkColor: 'text-purple-400',
      features: [
        'Exclusive homepage takeover',
        'Daily social media features',
        'Custom branded landing page',
        'Real-time analytics access',
        'Press release & PR support',
        'Custom market research reports',
        'Annual impact summit VIP access',
        'Direct community engagement',
        'Co-branded national initiatives',
        'C-suite strategy sessions'
      ]
    }
  ];

  return (
    <section id="sponsorship-tiers" className="py-24 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-mansagold text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Partnership Investment
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-playfair mb-6">
            <span className="text-white">Choose Your </span>
            <span className="text-gradient-gold">Impact Level</span>
          </h2>
          <p className="text-xl text-blue-200/70 max-w-2xl mx-auto">
            Every tier delivers measurable ROI through brand visibility, community engagement, and authentic market positioning.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-mansagold/0 via-mansagold to-mansagold/0 mx-auto mt-8" />
        </motion.div>

        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6 max-w-[1700px] mx-auto items-start">
          {tiers.map((tier, index) => (
            <motion.div 
              key={tier.name}
              className={`relative ${tier.popular ? 'xl:-mt-6 xl:mb-6' : ''}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredTier(tier.name)}
              onMouseLeave={() => setHoveredTier(null)}
            >
              {/* Animated glow on hover/popular */}
              <motion.div 
                className="absolute -inset-0.5 rounded-3xl blur-xl"
                style={{ background: `linear-gradient(135deg, ${tier.borderGlow}, transparent, ${tier.borderGlow})` }}
                animate={{ 
                  opacity: hoveredTier === tier.name || tier.popular ? 0.7 : 0 
                }}
                transition={{ duration: 0.4 }}
              />
              
              <div 
                className={`relative bg-slate-950/80 backdrop-blur-2xl rounded-2xl overflow-hidden border transition-all duration-500 ${
                  tier.popular 
                    ? 'border-mansagold/40 shadow-2xl shadow-mansagold/10' 
                    : 'border-white/10 hover:border-white/25'
                }`}
              >
                {/* Top accent bar */}
                <div className={`h-1.5 bg-gradient-to-r ${tier.gradient}`} />
                
                {/* Popular badge */}
                {tier.popular && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-slate-900 text-xs font-bold uppercase tracking-wider shadow-lg shadow-mansagold/30">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="p-8 lg:p-10">
                  {/* Icon & Name */}
                  <div className="mb-8">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${tier.gradient} mb-5 shadow-lg`}>
                      <tier.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white font-playfair">{tier.name}</h3>
                    <p className="text-blue-200/50 text-sm mt-1.5">{tier.description}</p>
                  </div>
                  
                  {/* Pricing */}
                  <div className="mb-8 pb-8 border-b border-white/10">
                    <div className="flex items-baseline gap-1.5">
                      <span className={`text-5xl font-bold font-playfair bg-gradient-to-r ${tier.gradient} bg-clip-text text-transparent`}>
                        {tier.price}
                      </span>
                      <span className="text-blue-200/50 text-base">{tier.period}</span>
                    </div>
                    <p className="text-blue-200/40 text-sm mt-1.5">{tier.annualPrice} billed annually</p>
                  </div>
                  
                  {/* Features */}
                  <ul className="space-y-3.5 mb-10">
                    {tier.features.map((feature, featureIndex) => (
                      <motion.li 
                        key={featureIndex} 
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + featureIndex * 0.03 }}
                      >
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${tier.gradient} flex items-center justify-center mt-0.5`}>
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                        <span className="text-blue-200/80 text-sm leading-relaxed">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  {/* CTA Button */}
                  <Button 
                    className={`w-full group text-base py-6 rounded-xl font-semibold transition-all duration-300 ${
                      tier.popular 
                        ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 hover:from-amber-500 hover:via-yellow-500 hover:to-orange-500 text-slate-900 shadow-xl shadow-mansagold/20 hover:shadow-mansagold/30 hover:scale-[1.02]' 
                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/15 hover:border-white/30'
                    }`}
                    onClick={() => onLearnMore(tier.name)}
                  >
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Comparison + Custom CTA */}
        <motion.div 
          className="mt-20 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Value comparison */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-8">
            <h3 className="text-xl font-bold text-white text-center mb-6 font-playfair">
              What Fortune 500 Companies Pay for Similar Exposure
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Community Marketing', cost: '$50K+/mo' },
                { label: 'Diversity Sponsorship', cost: '$100K+/mo' },
                { label: 'Brand Activations', cost: '$75K+/mo' },
                { label: 'ESG Programs', cost: '$200K+/mo' },
              ].map((item, i) => (
                <div key={i} className="text-center p-4 rounded-xl bg-white/5">
                  <p className="text-red-400/80 font-bold text-lg line-through">{item.cost}</p>
                  <p className="text-blue-200/60 text-xs mt-1">{item.label}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-mansagold font-semibold mt-6 text-lg">
              Get all of this + AI-powered analytics starting at just $1,750/month
            </p>
          </div>

          <div className="text-center">
            <p className="text-blue-200/50 mb-3">Need a custom enterprise solution?</p>
            <button 
              onClick={() => onLearnMore('Custom')}
              className="text-mansagold hover:text-mansagold-light font-semibold inline-flex items-center gap-2 group transition-colors text-lg"
            >
              Contact our enterprise team
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SponsorshipTiersSection;
