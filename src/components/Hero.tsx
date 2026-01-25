import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { MapPin, Loader2, ArrowRight, Sparkles, Search, Building2, TrendingUp, DollarSign } from 'lucide-react';
import { useLocation } from '@/hooks/location/useLocation';
import { toast } from 'sonner';
import { shouldHideStripePayments } from '@/utils/platform-utils';
import { useWealthMetrics } from '@/components/wealth-ticker/useWealthMetrics';

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
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-mansablue-dark via-mansablue to-mansablue-dark" />
      
      {/* Vibrant ambient effects - boosted for iPhone visibility */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-mansagold/20 rounded-full blur-[100px] md:blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-500/15 rounded-full blur-[80px] md:blur-[120px]" />
      </div>

      <div className="relative container mx-auto px-4 pt-6 pb-8 md:pt-12 md:pb-20">
        {/* Economic Operating System Badge */}
        <motion.div 
          className="text-center mb-6 md:mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-3">
            <span className="text-xs md:text-sm font-medium text-blue-200/80 tracking-wide uppercase">
              The Economic Operating System
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mansagold/20 border border-mansagold/40 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-mansagold" />
            <span className="text-sm md:text-base font-semibold text-mansagold">
              100% FREE Until September 1, 2026
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
            <span className="text-mansagold font-display text-lg md:text-xl font-bold tracking-tight">
              1325.ai
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
            <span className="text-white">Circulate. </span>
            <span className="text-gradient-gold">Accumulate.</span>
            <br />
            <span className="text-white">Build </span>
            <span className="text-gradient-gold">Generational Wealth.</span>
          </motion.h1>
          
          {/* Subhead */}
          <motion.p 
            className="text-base md:text-lg lg:text-xl text-blue-100/80 mb-6 md:mb-8 max-w-xl mx-auto leading-relaxed px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Discover Black-owned businesses. Earn <span className="text-mansagold font-semibold">5% - 30% discounts</span>. 
            Track your community impact in real-time.
          </motion.p>

          {/* Primary CTA - ZIP Code Search */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <Input
                  type="text"
                  placeholder="Enter ZIP code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleZipSearch()}
                  className="pl-12 bg-white/10 border-white/30 text-white placeholder:text-white/50 h-14 text-lg rounded-xl"
                  maxLength={5}
                />
              </div>
              <Button
                onClick={handleZipSearch}
                disabled={!zipCode.trim()}
                size="lg"
                className="bg-mansagold hover:bg-mansagold-dark text-mansablue-dark font-bold h-14 px-6 rounded-xl shadow-lg shadow-mansagold/25 text-base"
              >
                <Search className="w-5 h-5 mr-2" />
                Find Businesses
              </Button>
            </div>
            <p className="text-xs md:text-sm text-blue-200/60 mt-2">
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
            
            {!isIOS && (
              <Button 
                asChild
                size="lg"
                variant="ghost"
                className="text-mansagold hover:text-mansagold hover:bg-mansagold/10 font-semibold h-12 px-6 rounded-xl"
              >
                <Link to="/signup">
                  Join FREE Today
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            )}
          </motion.div>

          {/* Compact Wealth Ticker - Inline */}
          {metrics && (
            <motion.div
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-blue-200/70">Impact</p>
                    <p className="text-lg font-bold text-white">${metrics.economic_impact.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-500/20">
                    <Building2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-blue-200/70">Businesses</p>
                    <p className="text-lg font-bold text-white">{metrics.businesses_supported}</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-mansagold/20">
                    <TrendingUp className="w-4 h-4 text-mansagold" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-blue-200/70">Multiplier</p>
                    <p className="text-lg font-bold text-mansagold">{metrics.multiplier}x</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Early adopter CTA - Simplified */}
          <motion.div
            className="p-4 md:p-6 rounded-xl bg-mansagold/15 border border-mansagold/30 backdrop-blur-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-base md:text-lg font-bold text-white">
              🚀 We just launched! Share with family & friends to help us grow.
            </p>
          </motion.div>
        </div>

        {/* Feature cards - Desktop Only */}
        <motion.div 
          className="hidden lg:grid grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {[
            { title: 'Customers', desc: 'Browse, get discounts', link: '/signup' },
            { title: 'Businesses', desc: 'List free, grow sales', link: '/signup?type=business' },
            { title: 'Sales Agents', desc: 'Earn 15% commission', link: '/become-a-sales-agent' },
            { title: 'Directory', desc: 'Explore businesses', link: '/directory' },
          ].map((card) => (
            <Link 
              key={card.title} 
              to={card.link}
              className="group bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-white/20 hover:bg-slate-800/40 transition-all duration-300"
            >
              <h3 className="text-base font-bold text-white mb-1">{card.title}</h3>
              <p className="text-sm text-blue-200/70">{card.desc}</p>
              <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white/60 mt-2 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
