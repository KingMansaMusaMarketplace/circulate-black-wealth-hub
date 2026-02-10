import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, ArrowRight, Sparkles, Crown, Users, Bed, Bath } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { VacationProperty } from '@/types/vacation-rental';

interface FeaturedPropertySpotlightProps {
  property: VacationProperty;
}

const FeaturedPropertySpotlight: React.FC<FeaturedPropertySpotlightProps> = ({ property }) => {
  const mainImage = property.photos?.[0] || '/placeholder.svg';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      className="relative mb-12"
    >
      {/* Animated glow background */}
      <div className="absolute -inset-4 bg-gradient-to-r from-mansagold/20 via-amber-500/10 to-mansagold/20 rounded-3xl blur-2xl animate-pulse" />
      
      <div className="relative bg-slate-900/80 backdrop-blur-xl border border-mansagold/30 rounded-2xl overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-mansagold via-amber-400 to-mansagold" />
        
        {/* Featured label */}
        <div className="absolute top-4 left-4 z-20">
          <Badge className="bg-mansagold text-slate-900 font-bold px-3 py-1 text-sm flex items-center gap-1 shadow-lg shadow-mansagold/30">
            <Crown className="h-4 w-4" />
            Featured Property
          </Badge>
        </div>
        
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img 
              src={mainImage} 
              alt={property.title}
              className="w-full h-full object-cover"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-900/90" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent md:hidden" />
            
            {/* Floating sparkles */}
            <div className="absolute top-8 right-8 hidden md:block">
              <Sparkles className="h-8 w-8 text-mansagold animate-pulse" />
            </div>
          </div>
          
          {/* Content Section */}
          <div className="p-6 md:p-8 flex flex-col justify-center relative">
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-mansagold/10 to-transparent" />
            
            <div className="relative z-10">
              <Badge variant="secondary" className="mb-3 bg-white/10 text-mansagold border-mansagold/30 capitalize">
                {property.property_type}
              </Badge>
              
              <h2 className="text-3xl md:text-4xl font-bold text-mansagold mb-3 drop-shadow-[0_0_20px_rgba(251,191,36,0.4)]">
                {property.title}
              </h2>
              
              <p className="text-gray-300 text-lg mb-4 line-clamp-2">
                {property.description || `Experience authentic hospitality at this beautiful ${property.property_type}`}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 mb-4 text-gray-300">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-mansagold fill-mansagold mr-1" />
                  <span className="text-white font-semibold">
                    {property.average_rating > 0 ? property.average_rating.toFixed(1) : 'New'}
                  </span>
                  {property.review_count > 0 && (
                    <span className="ml-1 text-gray-400">({property.review_count} reviews)</span>
                  )}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-mansagold/70 mr-1" />
                  <span>{property.city}, {property.state}</span>
                </div>
              </div>

              {/* Property Details */}
              <div className="flex items-center gap-4 mb-6 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{property.max_guests} guests</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bed className="w-4 h-4" />
                  <span>{property.bedrooms} beds</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="w-4 h-4" />
                  <span>{property.bathrooms} baths</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Link to={`/stays/${property.id}`} className="flex-1 md:flex-none">
                  <Button 
                    size="lg"
                    className="w-full md:w-auto bg-gradient-to-r from-mansagold to-amber-500 text-slate-900 hover:from-amber-400 hover:to-mansagold font-bold px-8 shadow-lg shadow-mansagold/30 transition-all duration-300 hover:shadow-mansagold/50 hover:scale-105"
                  >
                    View Property
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                
                <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-base px-4 py-2 hidden md:flex">
                  {property.listing_mode === 'monthly' && property.base_monthly_rate
                    ? `$${Number(property.base_monthly_rate).toLocaleString()}/mo`
                    : `$${property.base_nightly_rate}/night`}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedPropertySpotlight;
