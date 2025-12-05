import React from 'react';
import { motion } from 'framer-motion';
import { useSocialProof } from '@/hooks/use-social-proof';
import LiveImpactCounter from '@/components/social-proof/LiveImpactCounter';
import SuccessStoriesCarousel from '@/components/social-proof/SuccessStoriesCarousel';
import TestimonialsGrid from '@/components/social-proof/TestimonialsGrid';
import { Loader2, TrendingUp, Users, Award, Shield, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const SocialProofPage = () => {
  const { metrics, successStories, testimonials, loading } = useSocialProof();
  const navigate = useNavigate();

  const statsData = [
    { value: "1M", label: "Member Goal", sublabel: "Help us grow" },
    { value: "New", label: "& Growing", sublabel: "Join early" },
    { value: "100%", label: "Black-Owned", sublabel: "Supporting our community" },
    { value: "24/7", label: "Always Open", sublabel: "Shop anytime" }
  ];

  const benefits = [
    { icon: Shield, text: "Verified businesses only" },
    { icon: Heart, text: "Secure transactions" },
    { icon: Users, text: "Community-driven" }
  ];

  if (loading) {
    return (
      <div className="relative flex items-center justify-center min-h-screen">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        <Loader2 className="relative z-10 w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden z-10">

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6 mb-16"
          >
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Join Thousands Making{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-mansagold via-amber-400 to-mansagold bg-clip-text text-transparent">
                  Real Impact
                </span>
                <motion.span
                  className="absolute inset-0 bg-mansagold/20 blur-xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Our community is growing stronger every day
            </motion.p>
          </motion.div>

          {/* Stats Grid with Gradient Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statsData.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-yellow-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:bg-slate-900/50 transition-all duration-300">
                  <motion.div
                    className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-white font-semibold mb-1">{stat.label}</div>
                  <div className="text-white/70 text-sm">{stat.sublabel}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Benefits Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.text}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 bg-slate-800/40 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3 text-white"
              >
                <benefit.icon className="w-5 h-5 text-blue-400" />
                <span className="font-medium">{benefit.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Member Benefits Section */}
      <section className="relative py-20 px-4 z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-yellow-400 bg-clip-text text-transparent">
                Member Benefits
              </span>
            </h2>
            <p className="text-xl text-white/70">
              Mansa Musa Marketplace offers unique advantages for both customers and business owners
            </p>
          </motion.div>

          {metrics && (
            <LiveImpactCounter
              totalUsers={metrics.total_users}
              totalBusinesses={metrics.total_businesses}
              wealthCirculated={metrics.total_wealth_circulated}
              jobsSupported={metrics.jobs_supported}
              activeThisWeek={metrics.active_this_week}
            />
          )}
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="relative py-20 px-4 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-yellow-500/10 rounded-3xl blur-xl opacity-30 group-hover:opacity-40 transition-opacity" />
              <div className="relative bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center hover:border-white/20 transition-all duration-300">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <TrendingUp className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">Avg. 35% Revenue Increase</h3>
                <p className="text-white/70">For businesses on our platform</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/10 rounded-3xl blur-xl opacity-30 group-hover:opacity-40 transition-opacity" />
              <div className="relative bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center hover:border-white/20 transition-all duration-300">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Users className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">Building to 1M Members</h3>
                <p className="text-white/70">Join our growing community</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-3xl blur-xl opacity-30 group-hover:opacity-40 transition-opacity" />
              <div className="relative bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center hover:border-white/20 transition-all duration-300">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Award className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">4.9/5 Satisfaction</h3>
                <p className="text-white/70">Rated by our community members</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      {successStories && successStories.length > 0 && (
        <section className="relative py-20 px-4 z-10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-yellow-400 bg-clip-text text-transparent">
                  Real Stories, Real Impact
                </span>
              </h2>
              <p className="text-xl text-white/70">
                See how businesses and customers are thriving together in our marketplace
              </p>
            </motion.div>
            <SuccessStoriesCarousel stories={successStories} />
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="relative py-20 px-4 z-10">
          <div className="max-w-7xl mx-auto">
            <TestimonialsGrid testimonials={testimonials} />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative py-24 px-4 overflow-hidden z-10">

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white"
          >
            Ready to help us build a{" "}
            <span className="bg-gradient-to-r from-blue-400 via-yellow-400 to-blue-400 bg-clip-text text-transparent">
              1 million member community?
            </span>
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                onClick={() => navigate('/signup')}
                className="text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-8 py-6 border-0"
              >
                Start Your Journey
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/directory')}
                className="text-lg border-2 border-white/20 bg-slate-800/40 hover:bg-slate-800/60 text-white backdrop-blur-sm px-8 py-6 font-semibold"
              >
                List Your Business
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SocialProofPage;
