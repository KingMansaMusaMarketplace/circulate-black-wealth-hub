import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Gift, TrendingUp, ShieldCheck, QrCode, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScrollReveal from '@/components/animations/ScrollReveal';

const benefits = [
  {
    icon: Search,
    title: 'Discover Local Businesses',
    description: 'Find verified, community-owned businesses near you — restaurants, services, shops, and more.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
  },
  {
    icon: QrCode,
    title: 'Earn Loyalty Points',
    description: 'Scan QR codes at participating businesses and watch your rewards grow with every purchase.',
    color: 'text-mansagold',
    bg: 'bg-mansagold/20',
  },
  {
    icon: Gift,
    title: 'Exclusive Deals & Discounts',
    description: 'Unlock special offers from businesses that reward your loyalty and support.',
    color: 'text-green-400',
    bg: 'bg-green-500/20',
  },
  {
    icon: TrendingUp,
    title: 'Track Your Impact',
    description: 'See exactly how your spending circulates and strengthens the community economy.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/20',
  },
  {
    icon: Heart,
    title: 'Support Your Community',
    description: 'Every dollar you spend at a listed business creates generational wealth for the community.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/20',
  },
  {
    icon: ShieldCheck,
    title: 'Verified & Trusted',
    description: 'All businesses are verified — shop with confidence knowing you\'re supporting real community owners.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20',
  },
];

const ConsumerBenefits: React.FC = () => {
  return (
    <section className="py-12 md:py-20 relative">
      <div className="max-w-6xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 mb-6">
              <Heart className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">For Consumers</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Shop. Earn. <span className="text-mansagold">Make an Impact.</span>
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Join for free and start earning rewards while supporting businesses that invest back into your community.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {benefits.map((benefit, index) => (
            <ScrollReveal key={benefit.title} delay={index * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-slate-800/60 border border-white/10 rounded-xl p-5 backdrop-blur-sm hover:border-mansagold/30 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg ${benefit.bg} flex items-center justify-center mb-4`}>
                  <benefit.icon className={`w-5 h-5 ${benefit.color}`} />
                </div>
                <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{benefit.description}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3}>
          <div className="text-center">
            <Button
              asChild
              size="lg"
              className="bg-mansagold hover:bg-mansagold-dark text-mansablue-dark font-extrabold h-14 px-10 rounded-xl shadow-xl text-xl"
            >
              <Link to="/signup">
                Join Free — It Takes 30 Seconds
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <p className="text-white/70 text-base mt-3 font-medium">No credit card required. Always free for consumers.</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ConsumerBenefits;
