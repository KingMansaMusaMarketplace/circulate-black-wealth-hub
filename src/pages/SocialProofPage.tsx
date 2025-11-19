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
    { value: "12,500+", label: "Active Members", sublabel: "Growing daily" },
    { value: "2,847", label: "Verified Businesses", sublabel: "Across 15 cities" },
    { value: "$1.2M+", label: "Money Circulated", sublabel: "In Black communities" },
    { value: "89%", label: "Satisfaction Rate", sublabel: "Member retention" }
  ];

  const benefits = [
    { icon: Shield, text: "Verified businesses only" },
    { icon: Heart, text: "Secure transactions" },
    { icon: Users, text: "Community-driven" }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-mansablue via-mansablue-dark to-mansablue">
        <Loader2 className="w-8 h-8 animate-spin text-mansagold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section with Animated Gradient */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-mansablue via-mansablue-dark to-mansablue">
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, hsl(var(--mansagold) / 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 50%, hsl(var(--mansagold) / 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 50%, hsl(var(--mansagold) / 0.3) 0%, transparent 50%)",
              ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        </div>

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
                <div className="absolute inset-0 bg-gradient-to-br from-mansagold/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300">
                  <motion.div
                    className="text-3xl md:text-4xl font-bold text-mansagold mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-white font-semibold mb-1">{stat.label}</div>
                  <div className="text-blue-200 text-sm">{stat.sublabel}</div>
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
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 text-white"
              >
                <benefit.icon className="w-5 h-5 text-mansagold" />
                <span className="font-medium">{benefit.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Member Benefits Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-background via-mansagold/5 to-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-mansablue via-mansablue-dark to-mansablue bg-clip-text text-transparent">
                Member Benefits
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
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

      {/* Trust Indicators with Gradient Backgrounds */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-mansablue/5 via-transparent to-mansagold/5" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-mansagold to-amber-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-white border-2 border-mansagold/20 rounded-3xl p-8 text-center hover:border-mansagold/40 transition-all duration-300 shadow-lg">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-mansagold to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <TrendingUp className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-mansablue mb-2">Avg. 35% Revenue Increase</h3>
                <p className="text-muted-foreground">For businesses on our platform</p>
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
              <div className="absolute inset-0 bg-gradient-to-br from-mansablue to-mansablue-dark rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-white border-2 border-mansablue/20 rounded-3xl p-8 text-center hover:border-mansablue/40 transition-all duration-300 shadow-lg">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-mansablue to-mansablue-dark rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Users className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-mansablue mb-2">Building to 1M Members</h3>
                <p className="text-muted-foreground">Join our growing community</p>
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
              <div className="absolute inset-0 bg-gradient-to-br from-mansagold to-amber-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-white border-2 border-mansagold/20 rounded-3xl p-8 text-center hover:border-mansagold/40 transition-all duration-300 shadow-lg">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-mansagold to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Award className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-mansablue mb-2">4.9/5 Satisfaction</h3>
                <p className="text-muted-foreground">Rated by our community members</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      {successStories && successStories.length > 0 && (
        <section className="py-20 px-4 bg-gradient-to-br from-mansablue/5 via-background to-mansagold/5">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-mansablue via-mansablue-dark to-mansablue bg-clip-text text-transparent">
                  Real Stories, Real Impact
                </span>
              </h2>
              <p className="text-xl text-muted-foreground">
                See how businesses and customers are thriving together in our marketplace
              </p>
            </motion.div>
            <SuccessStoriesCarousel stories={successStories} />
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <TestimonialsGrid testimonials={testimonials} />
          </div>
        </section>
      )}

      {/* CTA Section with Gradient */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-mansablue via-mansablue-dark to-mansablue">
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 0% 0%, hsl(var(--mansagold) / 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 100% 100%, hsl(var(--mansagold) / 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 0% 0%, hsl(var(--mansagold) / 0.3) 0%, transparent 50%)",
              ]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white"
          >
            Ready to help us build a{" "}
            <span className="bg-gradient-to-r from-mansagold via-amber-400 to-mansagold bg-clip-text text-transparent">
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
                className="text-lg bg-mansagold hover:bg-mansagold-dark text-mansablue font-bold px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Start Your Journey
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/directory')}
                className="text-lg border-2 border-white/30 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm px-8 py-6 font-semibold"
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
