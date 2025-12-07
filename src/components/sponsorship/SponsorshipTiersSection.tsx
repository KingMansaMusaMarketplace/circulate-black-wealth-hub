
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Crown, Star, Zap, ArrowRight } from 'lucide-react';

interface SponsorshipTiersSectionProps {
  onLearnMore: (tierName: string) => void;
}

const SponsorshipTiersSection: React.FC<SponsorshipTiersSectionProps> = ({ onLearnMore }) => {
  const tiers = [
    {
      name: 'Silver Partner',
      price: '$2,500',
      period: '/month',
      description: 'Perfect for companies beginning their impact journey',
      icon: Star,
      popular: false,
      gradient: 'from-slate-400 to-slate-500',
      bgGlow: 'rgba(148, 163, 184, 0.15)',
      features: [
        'Business directory listing highlight',
        'Monthly newsletter inclusion',
        'Social media mentions (2x/month)',
        'Basic analytics reporting',
        'Community event co-branding',
        'Quarterly impact summary'
      ]
    },
    {
      name: 'Gold Partner',
      price: '$5,000',
      period: '/month',
      description: 'Our most popular tier for maximum visibility',
      icon: Crown,
      popular: true,
      gradient: 'from-amber-400 via-yellow-400 to-orange-400',
      bgGlow: 'rgba(251, 191, 36, 0.2)',
      features: [
        'Premium directory placement',
        'Weekly newsletter spotlight',
        'Social media mentions (4x/month)',
        'Advanced analytics dashboard',
        'Event speaking opportunities',
        'Custom content creation',
        'Quarterly impact reports',
        'Dedicated partnership manager'
      ]
    },
    {
      name: 'Platinum Partner',
      price: '$10,000',
      period: '/month',
      description: 'Exclusive tier for transformational impact',
      icon: Zap,
      popular: false,
      gradient: 'from-violet-400 via-purple-400 to-fuchsia-400',
      bgGlow: 'rgba(167, 139, 250, 0.15)',
      features: [
        'Exclusive homepage presence',
        'Daily social media features',
        'Custom partnership landing page',
        'Real-time analytics access',
        'Executive advisory board seat',
        'Custom research reports',
        'Annual impact summit VIP access',
        'Direct community engagement',
        'Co-branded initiatives',
        'Priority support & strategy calls'
      ]
    }
  ];

  return (
    <section id="sponsorship-tiers" className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-mansagold text-sm font-semibold uppercase tracking-widest mb-4">
            Partnership Tiers
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-playfair mb-6">
            <span className="text-white">Choose Your </span>
            <span className="text-gradient-gold">Impact Level</span>
          </h2>
          <p className="text-xl text-blue-200/80 max-w-2xl mx-auto">
            Select the partnership tier that aligns with your company's goals and commitment to community transformation.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto items-start">
          {tiers.map((tier, index) => (
            <motion.div 
              key={tier.name}
              className={`relative ${tier.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Glow effect for popular tier */}
              {tier.popular && (
                <div 
                  className="absolute -inset-1 rounded-3xl blur-xl opacity-50"
                  style={{ background: `linear-gradient(135deg, ${tier.bgGlow}, transparent)` }}
                />
              )}
              
              <div 
                className={`relative bg-slate-900/70 backdrop-blur-xl rounded-2xl overflow-hidden border transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${
                  tier.popular 
                    ? 'border-mansagold/50 shadow-lg shadow-mansagold/10' 
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Popular badge */}
                {tier.popular && (
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400" />
                )}
                
                <div className="p-8 lg:p-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${tier.gradient} mb-4`}>
                        <tier.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white font-playfair">{tier.name}</h3>
                      <p className="text-blue-200/60 text-sm mt-1">{tier.description}</p>
                    </div>
                    {tier.popular && (
                      <span className="px-3 py-1 rounded-full bg-mansagold/20 border border-mansagold/30 text-mansagold text-xs font-semibold uppercase tracking-wide">
                        Popular
                      </span>
                    )}
                  </div>
                  
                  {/* Pricing */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-5xl font-bold font-playfair bg-gradient-to-r ${tier.gradient} bg-clip-text text-transparent`}>
                        {tier.price}
                      </span>
                      <span className="text-blue-200/60 text-lg">{tier.period}</span>
                    </div>
                  </div>
                  
                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${tier.gradient} flex items-center justify-center mt-0.5`}>
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                        <span className="text-blue-200/90 text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* CTA Button */}
                  <Button 
                    className={`w-full group text-base py-6 rounded-xl transition-all duration-300 ${
                      tier.popular 
                        ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 hover:from-amber-500 hover:via-yellow-500 hover:to-orange-500 text-slate-900 font-semibold shadow-lg shadow-mansagold/25' 
                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-white/30'
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
        
        {/* Custom partnership CTA */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-blue-200/60 mb-2">Looking for a custom partnership?</p>
          <button 
            onClick={() => onLearnMore('Custom')}
            className="text-mansagold hover:text-mansagold-light font-semibold inline-flex items-center gap-2 group transition-colors"
          >
            Contact us for enterprise solutions
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default SponsorshipTiersSection;
