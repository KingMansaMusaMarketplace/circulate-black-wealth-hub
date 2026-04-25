import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';

interface SponsorshipTiersSectionProps {
  onLearnMore: (tierName: string) => void;
}

interface Tier {
  name: string;
  mark: string;
  annual: string;
  monthly: string;
  description: string;
  recommended?: boolean;
  invitation?: boolean;
  features: string[];
}

const tiers: Tier[] = [
  {
    name: 'Founding Sponsor',
    mark: 'I',
    annual: '$21,000',
    monthly: '$1,750 / month',
    description: 'For regional brands building a community footprint.',
    features: [
      'Logo in platform footer',
      'Quarterly impact summary',
      'Founding Sponsor certificate',
      'Newsletter inclusion',
      'Locked rate for 12 months',
    ],
  },
  {
    name: 'Bronze Partner',
    mark: 'II',
    annual: '$60,000',
    monthly: '$5,000 / month',
    description: 'Foundation-level support for measurable impact.',
    features: [
      'Logo in footer & directory',
      'Monthly impact reporting',
      'Social recognition (1×/mo)',
      'Sponsor certificate',
      'Community newsletter feature',
    ],
  },
  {
    name: 'Silver Partner',
    mark: 'III',
    annual: '$180,000',
    monthly: '$15,000 / month',
    description: 'Elevated visibility and strategic engagement.',
    features: [
      'Logo in footer, sidebar & directory',
      'Monthly newsletter feature',
      'Social recognition (2×/mo)',
      'Enhanced analytics reporting',
      'Quarterly impact summary',
      'Dedicated onboarding session',
    ],
  },
  {
    name: 'Gold Partner',
    mark: 'IV',
    annual: '$300,000',
    monthly: '$25,000 / month',
    description: 'Recommended for national brands.',
    recommended: true,
    features: [
      'Premium directory placement',
      'Rotating homepage banner',
      'Social recognition (4×/mo)',
      'Advanced analytics dashboard',
      'Event speaking opportunities',
      'Custom content co-creation',
      'Dedicated partnership manager',
    ],
  },
  {
    name: 'Platinum Partner',
    mark: 'V',
    annual: '$600,000',
    monthly: '$50,000 / month',
    description: 'Exclusive tier for transformational partners.',
    features: [
      'Exclusive homepage takeover',
      'Daily social media features',
      'Custom branded landing page',
      'Real-time analytics access',
      'Press release & PR support',
      'Annual impact summit VIP access',
      'C-suite strategy sessions',
    ],
  },
  {
    name: 'Founding Partner',
    mark: 'VI',
    annual: 'By invitation',
    monthly: 'Bespoke engagement',
    description: 'Reserved for category-defining institutions.',
    invitation: true,
    features: [
      'Co-architected national initiative',
      'Board-level advisory access',
      'Patent licensing discussions',
      'Annual letter to shareholders',
      'Direct line to founder',
    ],
  },
];

const SponsorshipTiersSection: React.FC<SponsorshipTiersSectionProps> = ({ onLearnMore }) => {
  return (
    <section id="sponsorship-tiers" className="py-24 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[11px] text-mansagold tracking-[0.3em] uppercase mb-4">Engagement tiers</p>
          <h2 className="font-playfair text-3xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight">
            Choose your level of commitment.
          </h2>
          <p className="text-white/85 mt-6 max-w-2xl mx-auto">
            Annual commitments below. Monthly equivalents shown for budgeting reference.
            Every tier includes verified ROI dashboards.
          </p>
          <div className="w-16 h-px bg-mansagold/60 mx-auto mt-8" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {tiers.map((tier, index) => {
            const isRecommended = !!tier.recommended;
            const isInvitation = !!tier.invitation;
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="relative"
              >
                <div
                  className={`relative h-full bg-black rounded-2xl overflow-hidden border-2 transition-all duration-300 flex flex-col ${
                    isRecommended
                      ? 'border-mansagold shadow-[0_0_50px_-15px_rgba(212,175,55,0.4)]'
                      : 'border-mansagold/25 hover:border-mansagold/60'
                  }`}
                >
                  {isRecommended && (
                    <div className="absolute top-0 left-0 right-0 h-px bg-mansagold" />
                  )}

                  <div className="p-8 lg:p-10 flex flex-col h-full">
                    {/* Mark + Name */}
                    <div className="flex items-baseline justify-between mb-6">
                      <h3 className="font-playfair text-2xl font-semibold text-white">{tier.name}</h3>
                      <span className="font-playfair text-mansagold text-sm tracking-widest">
                        {tier.mark}
                      </span>
                    </div>

                    <p className={`text-sm mb-8 ${isRecommended ? 'text-mansagold' : 'text-white/85'}`}>
                      {tier.description}
                    </p>

                    {/* Pricing */}
                    <div className="mb-8 pb-8 border-b border-mansagold/20">
                      <p className="text-[10px] text-mansagold tracking-[0.25em] uppercase mb-2">
                        {isInvitation ? 'Engagement' : 'Annual commitment'}
                      </p>
                      <div className="font-playfair text-3xl md:text-4xl font-semibold text-white">
                        {tier.annual}
                      </div>
                      <p className="text-white/75 text-sm mt-2">{tier.monthly}</p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-10 flex-grow">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-mansagold flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                          <span className="text-white/90 text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Button
                      className={`w-full group rounded-md py-5 font-medium transition-all ${
                        isRecommended
                          ? 'bg-mansagold hover:bg-mansagold/90 text-slate-900'
                          : 'bg-white/[0.05] hover:bg-mansagold/15 text-white border border-mansagold/30 hover:border-mansagold/60'
                      }`}
                      onClick={() => onLearnMore(tier.name)}
                    >
                      {isInvitation ? 'Contact Leadership' : 'Request Brief'}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="mt-20 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-black border border-white/10 rounded-2xl p-8 md:p-10">
            <p className="text-[11px] text-mansagold tracking-[0.3em] uppercase mb-4 text-center">
              Investment context
            </p>
            <p className="text-white/70 text-center text-base md:text-lg leading-relaxed">
              Comparable corporate community-impact programs typically range from
              <span className="text-white font-semibold"> $50K to $200K per month</span> with limited
              measurement. Our tiers begin at $1,750 per month — with verified circulation tracking,
              executive reporting, and patent-pending infrastructure built in.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SponsorshipTiersSection;
