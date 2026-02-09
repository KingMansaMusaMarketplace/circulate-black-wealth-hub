import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap, 
  Award,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const benefits = [
  {
    icon: DollarSign,
    title: '$5 Per Signup',
    description: 'Earn a flat fee for every business that joins through your referral link.'
  },
  {
    icon: TrendingUp,
    title: '10% Recurring Revenue',
    description: 'Receive 10% of platform commissions on bookings from businesses you refer.'
  },
  {
    icon: Zap,
    title: 'Instant Marketing Kit',
    description: 'Get professional flyers, social assets, and email templates with your unique code.'
  },
  {
    icon: Shield,
    title: 'Dedicated Dashboard',
    description: 'Track referrals, earnings, and payouts in real-time from your partner portal.'
  },
  {
    icon: Users,
    title: 'Embed Widget',
    description: 'Add our directory widget to your website and earn from every conversion.'
  },
  {
    icon: Award,
    title: 'Founding Partner Status',
    description: 'Early partners receive exclusive benefits and priority support.'
  }
];

const steps = [
  { step: 1, title: 'Create Account', description: 'Sign up with your email in seconds' },
  { step: 2, title: 'Apply as Partner', description: 'Tell us about your directory or audience' },
  { step: 3, title: 'Get Approved', description: 'Quick review within 24-48 hours' },
  { step: 4, title: 'Start Earning', description: 'Share your link and watch earnings grow' }
];

const PartnerLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/50 to-slate-900">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-mansagold/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
        </div>
        
        <div className="container max-w-5xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 bg-mansagold/20 text-mansagold text-sm font-medium rounded-full mb-6">
              Partner Program
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Turn Your Directory Into a{' '}
              <span className="text-mansagold">Revenue Engine</span>
            </h1>
            
            <p className="text-xl text-blue-200/80 max-w-2xl mx-auto mb-8">
              Earn $5 per signup + 10% recurring revenue share when you refer businesses to 1325.AI
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-mansagold hover:bg-mansagold-dark text-slate-900 font-bold text-lg px-8 py-6 rounded-xl"
              >
                <Link to="/auth?redirect=/partner-portal&signup=true">
                  Become a Partner
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 font-semibold text-lg px-8 py-6 rounded-xl"
              >
                <Link to="/auth?redirect=/partner-portal">
                  Already have an account? Sign In
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Partner With Us?
            </h2>
            <p className="text-lg text-blue-200/70 max-w-2xl mx-auto">
              Join the growing network of directory partners earning recurring revenue
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="bg-slate-900/50 border-white/10 h-full hover:border-mansagold/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-mansagold/20 rounded-xl flex items-center justify-center mb-4">
                      <benefit.icon className="h-6 w-6 text-mansagold" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                    <p className="text-sm text-slate-400">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-slate-900/30">
        <div className="container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-blue-200/70">
              Get started in four simple steps
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-mansagold text-slate-900 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings Example */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-mansagold/20 to-mansagold/5 border-mansagold/30">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  Potential Earnings Example
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div className="p-4">
                    <div className="text-3xl font-bold text-mansagold mb-2">50</div>
                    <div className="text-sm text-slate-400">Businesses Referred</div>
                  </div>
                  <div className="p-4 border-x border-white/10">
                    <div className="text-3xl font-bold text-mansagold mb-2">$250</div>
                    <div className="text-sm text-slate-400">Signup Bonuses</div>
                  </div>
                  <div className="p-4">
                    <div className="text-3xl font-bold text-mansagold mb-2">$500+</div>
                    <div className="text-sm text-slate-400">Monthly Recurring*</div>
                  </div>
                </div>
                
                <p className="text-xs text-slate-500 text-center mt-6">
                  *Based on average booking volume. Actual earnings vary.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4">
        <div className="container max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Earning?
            </h2>
            <p className="text-lg text-blue-200/70 mb-8">
              Join our partner program today and turn your audience into recurring revenue.
            </p>
            
            <Button
              asChild
              size="lg"
              className="bg-mansagold hover:bg-mansagold-dark text-slate-900 font-bold text-lg px-10 py-6 rounded-xl"
            >
              <Link to="/auth?redirect=/partner-portal&signup=true">
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Apply Now — It's Free
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PartnerLanding;
