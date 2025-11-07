import React from 'react';
import { motion } from 'framer-motion';
import { useSocialProof } from '@/hooks/use-social-proof';
import LiveImpactCounter from '@/components/social-proof/LiveImpactCounter';
import SuccessStoriesCarousel from '@/components/social-proof/SuccessStoriesCarousel';
import TestimonialsGrid from '@/components/social-proof/TestimonialsGrid';
import { Loader2, TrendingUp, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const SocialProofPage = () => {
  const { metrics, successStories, testimonials, loading } = useSocialProof();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
              Building <span className="text-primary">Economic Power</span> Together
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See the real impact our community is making by supporting Black-owned businesses
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
      <section className="py-12 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">150% Growth</h3>
              <p className="text-sm text-muted-foreground">In business revenue year-over-year</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">98% Satisfaction</h3>
              <p className="text-sm text-muted-foreground">From both businesses and customers</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <Award className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Verified Impact</h3>
              <p className="text-sm text-muted-foreground">Every business and metric validated</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <SuccessStoriesCarousel stories={successStories} />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <TestimonialsGrid testimonials={testimonials} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Ready to Make an Impact?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of community members supporting Black-owned businesses
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/signup')} className="gap-2">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/directory')}>
              Browse Businesses
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SocialProofPage;
