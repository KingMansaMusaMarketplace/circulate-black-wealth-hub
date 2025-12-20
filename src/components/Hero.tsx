import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Star, Building2, Users, TrendingUp, MapPin, Loader2, ArrowRight, Sparkles, Crown, Clock } from 'lucide-react';
import { useLocation } from '@/hooks/location/useLocation';
import { toast } from 'sonner';
import { shouldHideStripePayments } from '@/utils/platform-utils';

const Hero = () => {
  const isIOS = shouldHideStripePayments();
  const navigate = useNavigate();
  const { getCurrentPosition, loading: locationLoading } = useLocation();
  const [isLocating, setIsLocating] = useState(false);

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

  // Exclusivity-focused messaging instead of raw numbers
  const displayStats = [
    { value: 'Founding', label: 'Member Status', icon: Crown, highlight: true },
    { value: 'Up to 30%', label: 'Exclusive Discounts', icon: TrendingUp },
    { value: 'Forever', label: 'Badge & Perks', icon: Star },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-mansablue-dark via-mansablue to-mansablue-dark" />
      
      {/* Animated ambient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-mansagold/10 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-400/5 rounded-full blur-[180px]" />
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-mansagold/40 rounded-full"
            initial={{ x: `${Math.random() * 100}%`, y: '110%', opacity: 0 }}
            animate={{ y: '-10%', opacity: [0, 1, 0] }}
            transition={{
              duration: Math.random() * 6 + 6,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative container mx-auto px-4 pt-8 pb-20 md:pt-16 md:pb-32">
        {/* Free Growth Banner */}
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-mansagold/30 via-amber-500/20 to-mansagold/30 border-2 border-mansagold/50 backdrop-blur-md shadow-[0_0_40px_rgba(251,191,36,0.3)] hover:shadow-[0_0_60px_rgba(251,191,36,0.5)] transition-all duration-500 hover:scale-105">
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-mansagold animate-pulse" />
            <span className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-mansagold via-yellow-300 to-amber-400 bg-clip-text text-transparent drop-shadow-lg">
              Phase 1: 100% FREE Until March 31, 2026
            </span>
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-mansagold animate-pulse" />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left column - Content */}
          <div className="text-center lg:text-left">
            <motion.h1 
              className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 md:mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="text-white">Save Money.</span>
              <br />
              <span className="text-white">Support </span>
              <span className="text-gradient-gold">Black-Owned</span>
              <br />
              <span className="text-gradient-gold">Businesses.</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl lg:text-2xl text-blue-100/80 mb-8 md:mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Get <span className="text-mansagold font-semibold">5% - 30% discounts</span> while 
              building generational wealth in Black communities.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10 md:mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {!isIOS && (
                <Button 
                  asChild
                  size="lg"
                  className="group bg-mansagold hover:bg-mansagold-dark text-mansablue-dark font-semibold text-lg px-8 py-6 rounded-xl shadow-lg shadow-mansagold/25 hover:shadow-xl hover:shadow-mansagold/30 transition-all duration-300"
                >
                  <Link to="/signup">
                    Join FREE Today
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              )}
              
              <Button 
                size="lg"
                onClick={handleFindNearMe}
                disabled={isLocating || locationLoading}
                className="group bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 font-semibold text-lg px-8 py-6 rounded-xl backdrop-blur-sm transition-all duration-300"
              >
                {isLocating || locationLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Finding...
                  </>
                ) : (
                  <>
                    <MapPin className="mr-2 h-5 w-5" />
                    Find Near Me
                  </>
                )}
              </Button>
            </motion.div>

            {/* Founding Member Benefits */}
            <motion.div 
              className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {displayStats.map((stat, index) => (
                <div 
                  key={stat.label} 
                  className={`text-center px-4 py-3 rounded-xl backdrop-blur-sm border ${
                    stat.highlight 
                      ? 'bg-mansagold/20 border-mansagold/40' 
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon className={`w-5 h-5 ${stat.highlight ? 'text-mansagold' : 'text-mansagold/80'}`} />
                    <span className="text-lg md:text-xl font-bold text-white font-playfair">
                      {stat.value}
                    </span>
                  </div>
                  <span className="text-xs text-blue-200/70">{stat.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Urgency element */}
            <motion.div
              className="flex items-center justify-center lg:justify-start gap-2 mt-4 text-blue-200/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <Clock className="w-4 h-4" />
              <span className="text-sm">Founding member window closes March 31, 2026</span>
            </motion.div>

            {/* Early adopter CTA */}
            <motion.div
              className="mt-8 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-mansagold/30 via-amber-500/20 to-mansagold/30 border-2 border-mansagold/50 backdrop-blur-sm text-center shadow-[0_0_40px_rgba(251,191,36,0.3)]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <p className="text-xl md:text-3xl font-extrabold text-white leading-tight">
                🚀 We just launched! <span className="text-mansagold">Help us grow</span> by sharing with family & friends.
              </p>
              <p className="text-xl md:text-2xl font-bold text-white mt-4">
                📱 Share on social media, text your group chats, <span className="text-mansagold">tell everyone!</span>
              </p>
            </motion.div>
          </div>

          {/* Right column - Visual */}
          <motion.div 
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="relative max-w-md w-full">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-mansagold/30 via-transparent to-purple-500/20 rounded-3xl blur-2xl" />
              
              <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <img 
                  src="/lovable-uploads/487f9aac-a3ad-4b28-8d90-3fd25a3a689b.png" 
                  alt="Professional business woman working on laptop"
                  className="w-full h-auto object-cover"
                  loading="eager"
                />
                
                {/* Overlay with benefits */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 md:p-8">
                  <div className="space-y-3">
                    {[
                      { icon: TrendingUp, text: '5% - 30% Discounts', color: 'text-emerald-400' },
                      { icon: Star, text: '100% FREE to Join', color: 'text-mansagold' },
                      { icon: Users, text: 'Join Our Growing Community', color: 'text-blue-400' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <item.icon className={`h-5 w-5 ${item.color}`} />
                        <span className="text-white font-medium">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature cards */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-16 md:mt-24 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {[
            { title: 'Customers', desc: 'Browse, get discounts & earn rewards', color: 'from-emerald-400 to-teal-500', icon: Users, link: '/signup' },
            { title: 'Businesses', desc: 'List free, grow your customer base', color: 'from-blue-400 to-indigo-500', icon: Building2, link: '/signup?type=business' },
            { title: 'Sales Agents', desc: 'Earn up to 15% commission', color: 'from-amber-400 to-orange-500', icon: TrendingUp, link: '/become-a-sales-agent' },
            { title: 'Directory', desc: 'Explore our growing business network', color: 'from-purple-400 to-pink-500', icon: MapPin, link: '/directory' },
          ].map((card, index) => (
            <Link 
              key={card.title} 
              to={card.link}
              className="group"
            >
              <motion.div
                className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:bg-slate-800/50 transition-all duration-300 h-full"
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} mb-4`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                <p className="text-sm text-blue-200/70">{card.desc}</p>
                <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
