import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, ArrowRight, Sparkles, Crown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import OptimizedImage from '@/components/ui/optimized-image';
import { generatePlaceholder } from '@/utils/imageOptimizer';
import { motion, AnimatePresence } from 'framer-motion';
import { Business } from '@/types/business';
import { getBusinessBanner } from '@/utils/businessBanners';

interface FeaturedSpotlightProps {
  business?: Business;
  businesses?: Business[];
}

const FeaturedSpotlightCard: React.FC<{ business: Business }> = ({ business }) => {
  const resolvedBanner = getBusinessBanner(business.id, business.bannerUrl, business.website);
  const primarySrc = resolvedBanner || business.imageUrl || business.bannerUrl || '';
  const websiteFallback = business.website 
    ? `https://image.thum.io/get/width/1200/crop/630/noanimate/${business.website}` 
    : '';
  const placeholderSrc = generatePlaceholder(600, 400, business.name);

  return (
    <div className="relative bg-slate-900/80 backdrop-blur-xl border border-mansagold/30 rounded-2xl overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-mansagold via-amber-400 to-mansagold" />
      
      <div className="absolute top-4 left-4 z-20">
        <Badge className="bg-mansagold text-slate-900 font-bold px-3 py-1 text-sm flex items-center gap-1 shadow-lg shadow-mansagold/30">
          <Crown className="h-4 w-4" />
          Featured Business
        </Badge>
      </div>
      
      <div className="grid md:grid-cols-2 gap-0">
        <div className="relative h-64 md:h-80 overflow-hidden">
          <OptimizedImage 
            src={primarySrc || websiteFallback || placeholderSrc} 
            alt={business.name}
            className="w-full h-full object-cover"
            fallbackSrc={websiteFallback || placeholderSrc}
            quality="high"
            lazy={false}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-900/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent md:hidden" />
          <div className="absolute top-8 right-8 hidden md:block">
            <Sparkles className="h-8 w-8 text-mansagold animate-pulse" />
          </div>
        </div>
        
        <div className="p-6 md:p-8 flex flex-col justify-center relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-mansagold/10 to-transparent" />
          
          <div className="relative z-10">
            <Badge variant="secondary" className="mb-3 bg-white/10 text-mansagold border-mansagold/30">
              {business.category}
            </Badge>
            
            <h2 className="text-3xl md:text-4xl font-bold text-mansagold mb-3 drop-shadow-[0_0_20px_rgba(251,191,36,0.4)]">
              {business.name}
            </h2>
            
            <p className="text-gray-300 text-lg mb-4 line-clamp-2">
              {business.description || `Discover amazing ${business.category.toLowerCase()} services and earn loyalty points`}
            </p>
            
            <div className="flex items-center gap-4 mb-4 text-gray-300">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-mansagold fill-mansagold mr-1" />
                <span className="text-white font-semibold">{business.rating}</span>
                <span className="ml-1 text-gray-400">({business.reviewCount} reviews)</span>
              </div>
              {business.address && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-mansagold/70 mr-1" />
                  <span className="truncate max-w-[200px]">{business.address}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <Link to={`/business/${business.id}`} className="flex-1 md:flex-none">
                <Button 
                  size="lg"
                  className="w-full md:w-auto bg-gradient-to-r from-mansagold to-amber-500 text-slate-900 hover:from-amber-400 hover:to-mansagold font-bold px-8 shadow-lg shadow-mansagold/30 transition-all duration-300 hover:shadow-mansagold/50 hover:scale-105"
                >
                  Explore Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              {business.discount && (
                <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-base px-4 py-2 hidden md:flex">
                  {business.discount}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturedSpotlight: React.FC<FeaturedSpotlightProps> = ({ business, businesses = [] }) => {
  // Support both single business (legacy) and array
  const allFeatured = business && businesses.length === 0 ? [business] : businesses;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % allFeatured.length);
  }, [allFeatured.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + allFeatured.length) % allFeatured.length);
  }, [allFeatured.length]);

  // Auto-rotate every 6 seconds
  useEffect(() => {
    if (allFeatured.length <= 1 || isPaused) return;
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, [allFeatured.length, isPaused, goNext]);

  if (allFeatured.length === 0) return null;

  const currentBusiness = allFeatured[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      className="relative mb-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Animated glow background */}
      <div className="absolute -inset-4 bg-gradient-to-r from-mansagold/20 via-amber-500/10 to-mansagold/20 rounded-3xl blur-2xl animate-pulse" />
      
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBusiness.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            <FeaturedSpotlightCard business={currentBusiness} />
          </motion.div>
        </AnimatePresence>

        {/* Navigation controls */}
        {allFeatured.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-slate-900/70 hover:bg-mansagold/30 border border-mansagold/30 rounded-full p-2 transition-colors"
              aria-label="Previous featured business"
            >
              <ChevronLeft className="h-5 w-5 text-mansagold" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-slate-900/70 hover:bg-mansagold/30 border border-mansagold/30 rounded-full p-2 transition-colors"
              aria-label="Next featured business"
            >
              <ChevronRight className="h-5 w-5 text-mansagold" />
            </button>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {allFeatured.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex 
                      ? 'w-6 bg-mansagold' 
                      : 'w-2 bg-mansagold/30 hover:bg-mansagold/50'
                  }`}
                  aria-label={`Go to featured business ${idx + 1}`}
                />
              ))}
            </div>

            {/* Counter */}
            <div className="text-center mt-2 text-sm text-mansagold/60">
              {currentIndex + 1} of {allFeatured.length} Featured Businesses
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default FeaturedSpotlight;
