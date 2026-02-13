import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { MapPin, Loader2, ArrowRight, Sparkles, Search } from 'lucide-react';
import { useLocation } from '@/hooks/location/useLocation';
import { toast } from 'sonner';
import { shouldHideStripePayments } from '@/utils/platform-utils';
import { useWealthMetrics } from '@/components/wealth-ticker/useWealthMetrics';
import QuickAddBusiness from '@/components/hero/QuickAddBusiness';

const Hero = () => {
  const isIOS = shouldHideStripePayments();
  const navigate = useNavigate();
  const { getCurrentPosition, loading: locationLoading } = useLocation();
  const [isLocating, setIsLocating] = useState(false);
  const [zipCode, setZipCode] = useState('');
  const { metrics } = useWealthMetrics();

  const handleFindNearMe = useCallback(async () => {
    setIsLocating(true);
    try {
      const location = await getCurrentPosition(true);
      if (location) {
        toast.success('Location found! Showing nearby businesses...');
        navigate('/directory?view=map');
      } else {
        toast.error('Could not get your location. Please enable location services.');
      }
    } catch (error) {
      console.error('Location error:', error);
      toast.error('Unable to access location. Please check your settings.');
    } finally {
      setIsLocating(false);
    }
  }, [getCurrentPosition, navigate]);

  const handleZipSearch = useCallback(() => {
    if (zipCode.trim()) {
      localStorage.setItem('guest_zip_code', zipCode.trim());
      navigate(`/directory?zip=${zipCode.trim()}`);
    }
  }, [zipCode, navigate]);

  return (
    <section className="relative min-h-[85vh] md:min-h-screen overflow-hidden">
      {/* Premium gradient background - darker for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#050d1a] via-[#0a1628] to-[#050d1a]" />
      
      {/* Subtle ambient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-mansagold/12 rounded-full blur-[100px] md:blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-500/8 rounded-full blur-[80px] md:blur-[120px]" />
      </div>

      <div className="relative container mx-auto px-4 pt-6 pb-8 md:pt-12 md:pb-20">
        {/* Single Unified Urgency Badge */}
        <motion.div 
          className="text-center mb-6 md:mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-mansagold/30 border-2 border-mansagold shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-sm md:text-base font-black text-white tracking-wide uppercase">
              🚀 Founding Member Access — Free Until Sept 2026
            </span>
          </div>
        </motion.div>

        {/* Main Content - Single Column on Mobile */}
        <div className="max-w-3xl mx-auto text-center">
          {/* Brand Tagline */}
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <span className="text-mansagold font-mono text-lg md:text-xl font-bold tracking-wider">
              1325.AI
            </span>
            <span className="text-white/60 mx-2">—</span>
            <span className="text-white/80 text-sm md:text-base">
              The Intelligence Layer for Black Economic Power
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] mb-4 md:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="text-gradient-gold">Mansa Musa Marketplace</span>
            <br />
            <span className="text-white">Build </span>
            <span className="text-gradient-gold">Generational Wealth.</span>
          </motion.h1>
          
          {/* Subhead */}
          <motion.p 
            className="text-base md:text-lg lg:text-xl text-blue-100/80 mb-4 max-w-xl mx-auto leading-relaxed px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Discover Black-owned businesses. Earn <span className="text-mansagold font-semibold">5% - 30% discounts</span>. 
            Track your community impact in real-time.
          </motion.p>
          
          {/* BHM Quick Add Business Widget */}
          {!isIOS && <QuickAddBusiness />}

          {/* Primary CTA - ZIP Code Search */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mansablue-dark" />
                <Input
                  type="text"
                  placeholder="Enter ZIP code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleZipSearch()}
                  className="pl-12 bg-white border-2 border-mansagold text-mansablue-dark placeholder:text-slate-500 h-14 text-lg font-bold rounded-xl shadow-xl"
                  maxLength={5}
                />
              </div>
              <Button
                onClick={handleZipSearch}
                disabled={!zipCode.trim()}
                size="lg"
                className="bg-mansagold hover:bg-mansagold-dark text-mansablue-dark border-2 border-mansagold-dark font-black h-14 px-6 rounded-xl shadow-xl disabled:opacity-50"
              >
                <Search className="w-5 h-5 mr-2" />
                Find Businesses
              </Button>
            </div>
            <p className="text-sm text-white/80 mt-2 font-medium">
              No account needed to browse
            </p>
          </motion.div>

          {/* Secondary CTAs */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button 
              size="lg"
              onClick={handleFindNearMe}
              disabled={isLocating || locationLoading}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 font-semibold h-12 px-6 rounded-xl backdrop-blur-sm"
            >
              {isLocating || locationLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Finding...
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-5 w-5" />
                  Use My Location
                </>
              )}
            </Button>
            
          </motion.div>

          {/* Social Proof */}
          <motion.div
            className="p-4 md:p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <p className="text-sm md:text-base text-blue-100/80">
              <span className="text-mansagold font-bold">1325.AI</span> — The intelligence layer for Black economic power. 
              Share with family & friends to help us grow.
            </p>
          </motion.div>
        </div>

        {/* Feature cards - Desktop Only - Simplified to 2 paths */}
        <motion.div 
          className="hidden lg:grid grid-cols-2 gap-6 mt-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {[
            { title: 'For Customers', desc: 'Find businesses, earn discounts, track your community impact', link: '/directory' },
            { title: 'For Business Owners', desc: 'List free, attract loyal customers, grow your sales', link: '/signup?type=business' },
          ].map((card) => (
            <Link 
              key={card.title} 
              to={card.link}
              className="group bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-mansagold/30 hover:bg-slate-800/40 transition-all duration-300"
            >
              <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
              <p className="text-sm text-blue-200/70 mb-3">{card.desc}</p>
              <ArrowRight className="w-5 h-5 text-mansagold/50 group-hover:text-mansagold mt-2 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
