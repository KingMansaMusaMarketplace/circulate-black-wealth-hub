import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import PropertyCard from '@/components/vacation-rentals/PropertyCard';

const PropertyMap = lazy(() => import('@/components/stays/PropertyMap'));
import PremiumPropertySearchBar from '@/components/stays/PremiumPropertySearchBar';
import PropertyFiltersPanel from '@/components/stays/PropertyFiltersPanel';
import ActiveFiltersBar from '@/components/stays/ActiveFiltersBar';
import FeaturedPropertySpotlight from '@/components/stays/FeaturedPropertySpotlight';
import { vacationRentalService } from '@/lib/services/vacation-rental-service';
import { VacationProperty, PropertySearchFilters } from '@/types/vacation-rental';
import { Loader2, Home, Plus, Luggage, Sparkles, Heart, Key, CalendarRange, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/hooks/useWishlist';
import { useStaysBetaTracking } from '@/hooks/useStaysBetaTracking';
import StaysBetaFeedbackWidget from '@/components/stays/StaysBetaFeedbackWidget';

const VacationRentalsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  useStaysBetaTracking();
  const { isFavorited, toggleFavorite } = useWishlist();
  const [properties, setProperties] = useState<VacationProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PropertySearchFilters>({});
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const listRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const data = await vacationRentalService.fetchVacationProperties(filters);
      setProperties(data);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<PropertySearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSearch = () => {
    loadProperties();
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const handleOpenFilters = () => {
    setFiltersOpen(true);
  };

  // Get featured property (highest rated or first verified)
  const featuredProperties = (() => {
    const verified = properties.filter(p => p.is_verified);
    const pool = verified.length > 0 ? verified : properties.slice(0, 1);
    return pool.slice(0, 5);
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#050a18] to-[#030712] relative overflow-hidden">
      <Helmet>
        <title>Mansa Stays — Vacation & Monthly Rentals from Black Hosts</title>
        <meta name="description" content="Book unique vacation and monthly rentals from verified Black property owners. Lower 7.5% fees, community impact, and authentic hospitality on Mansa Stays." />
        <meta property="og:title" content="Mansa Stays — Vacation & Monthly Rentals" />
        <meta property="og:description" content="Support Black hosts. Lower fees. Book unique stays with community impact." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.1325.ai/stays" />
      </Helmet>
      {/* Gold accent line at top */}
      <div className="h-1 bg-gradient-to-r from-transparent via-mansagold to-transparent opacity-60" />
      
      {/* Animated gradient orbs - enhanced */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-mansablue/30 to-blue-600/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 -right-32 w-[32rem] h-[32rem] bg-gradient-to-tl from-mansagold/25 to-amber-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-tr from-blue-500/20 to-mansablue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] pointer-events-none" />
      
      {/* Hero Section - Premium Upgrade */}
      <div className="relative z-10 py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          {/* Font-mono decorative badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <span className="text-mansagold text-sm font-mono tracking-widest uppercase bg-mansagold/10 px-4 py-2 rounded-full border border-mansagold/20 inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Discover • Support • Stay
            </span>
          </motion.div>

          {/* Title with gold gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-7xl sm:text-8xl md:text-9xl font-bold mb-6"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-mansagold via-amber-400 to-mansagold drop-shadow-[0_0_30px_rgba(251,191,36,0.4)]">
              Mansa Stays
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl sm:text-2xl text-white/80 mb-4 max-w-3xl mx-auto font-medium"
          >
            Book unique vacation & monthly rentals from 'Non-Bias' property owners
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-base text-white/60 mb-8 max-w-2xl mx-auto"
          >
            Experience authentic hospitality while supporting the community. Lower fees, more impact.
          </motion.p>

          {/* Stats with premium styling */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center gap-8 md:gap-12 mb-10"
          >
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-mansagold to-amber-400">
                {properties.length}+
              </p>
              <p className="text-white/60 text-sm font-mono tracking-wider uppercase">Properties</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-mansagold to-amber-400">
                7.5%
              </p>
              <p className="text-white/60 text-sm font-mono tracking-wider uppercase">Lower Fees</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-mansagold to-amber-400">
                100%
              </p>
              <p className="text-white/60 text-sm font-mono tracking-wider uppercase">Community-Owned</p>
            </div>
          </motion.div>

          {/* CTA buttons */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap justify-center gap-3 mb-12"
            >
              <Button
                onClick={() => navigate('/stays/my-bookings')}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:border-mansagold/50"
              >
                <Luggage className="w-4 h-4 mr-2" />
                My Stays
              </Button>
              <Button
                onClick={() => navigate('/stays/favorites')}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:border-mansagold/50"
              >
                <Heart className="w-4 h-4 mr-2" />
                Favorites
              </Button>
              <Button
                onClick={() => navigate('/stays/list-property')}
                className="bg-gradient-to-r from-mansagold to-amber-500 text-slate-900 hover:from-amber-400 hover:to-mansagold font-bold shadow-lg shadow-mansagold/30"
              >
                <Plus className="w-4 h-4 mr-2" />
                List Your Property
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Premium Search Bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 -mt-4 mb-4">
        <PremiumPropertySearchBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onOpenFilters={handleOpenFilters}
        />
      </div>

      {/* Active Filters Bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 mb-6">
        <ActiveFiltersBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearAll={handleResetFilters}
        />
      </div>

      {/* Yearly Leases Banner — entry point for long-term rentals */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-mansagold/30 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-mansablue/40 backdrop-blur-xl"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-mansagold/20 rounded-full blur-3xl" />
          <div className="relative p-6 md:p-8 grid md:grid-cols-2 gap-6 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-mansagold bg-mansagold/10 border border-mansagold/30 px-3 py-1 rounded-full mb-3">
                <Sparkles className="w-3 h-3" /> New on Mansa Stays
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                Looking for a <span className="text-mansagold">yearly Lease or list your Rental</span>?
              </h2>
              <p className="text-white/70 text-sm md:text-base mb-4">
                Browse apartments, condos, houses, office space and warehouses for rent by the year from non-bias property owners. Or list your own property — free to list, $99 only when you successfully lease.
              </p>
              <div className="flex flex-wrap gap-2 mb-4 text-xs">
                <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/80">
                  <CalendarRange className="w-3.5 h-3.5 text-mansagold" /> 12-month leases
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/80">
                  <Home className="w-3.5 h-3.5 text-mansagold" /> Free to list · $99 success fee only
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => navigate('/stays/lease')}
                  className="bg-mansagold text-slate-900 hover:bg-mansagold/90 font-bold"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Browse Yearly Leases
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  onClick={() => navigate('/stays/host/lease/new')}
                  variant="outline"
                  className="border-mansagold/40 text-white hover:bg-mansagold/10 hover:border-mansagold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  List Your Rental
                </Button>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <figure className="w-full max-w-md">
                <div className="relative overflow-hidden rounded-xl border border-mansagold/40 bg-black shadow-2xl shadow-mansagold/10 aspect-video">
                  <video
                    src="/videos/MansaStays-LeaseListing-2min.mp4"
                    controls
                    preload="metadata"
                    playsInline
                    className="w-full h-full object-cover"
                    aria-label="How to List your Leasing Property — 2 minute walkthrough"
                  />
                </div>
                <figcaption className="text-center text-xs text-white/70 mt-2">
                  ▶ <span className="text-mansagold font-semibold">How to List your Leasing Property</span> — 2 min walkthrough
                </figcaption>
              </figure>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Short-Term Rental Host Banner */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-mansagold/30 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-mansablue/40 backdrop-blur-xl"
        >
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-mansagold/20 rounded-full blur-3xl" />
          <div className="relative p-6 md:p-8 grid md:grid-cols-2 gap-6 items-center">
            <div className="md:order-2">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-mansagold bg-mansagold/10 border border-mansagold/30 px-3 py-1 rounded-full mb-3">
                <Sparkles className="w-3 h-3" /> Hosting on Mansa Stays
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                Hosting <span className="text-mansagold">nightly stays</span>?
              </h2>
              <p className="text-white/70 text-sm md:text-base mb-4">
                List your short-term rental in minutes. Keep 92.5% of every booking — we only charge a 7.5% platform fee, well below the 14–20% other platforms take.
              </p>
              <div className="flex flex-wrap gap-2 mb-4 text-xs">
                <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/80">
                  <Home className="w-3.5 h-3.5 text-mansagold" /> Nightly & weekly stays
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/80">
                  <Luggage className="w-3.5 h-3.5 text-mansagold" /> 92.5% host payout
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => navigate('/stays/host')}
                  className="bg-mansagold text-slate-900 hover:bg-mansagold/90 font-bold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  List your Short-Term Rental
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
            <div className="flex justify-center md:justify-start md:order-1">
              <figure className="w-full max-w-md">
                <div className="relative overflow-hidden rounded-xl border border-mansagold/40 bg-black shadow-2xl shadow-mansagold/10 aspect-video">
                  <video
                    src="/videos/MansaStays-HowToList-2min.mp4"
                    controls
                    preload="metadata"
                    playsInline
                    className="w-full h-full object-cover"
                    aria-label="How to List your Short-Term Rental — 2 minute walkthrough"
                  />
                </div>
                <figcaption className="text-center text-xs text-white/70 mt-2">
                  ▶ <span className="text-mansagold font-semibold">How to List your Short-Term Rental</span> — 2 min walkthrough
                </figcaption>
              </figure>
            </div>
          </div>
        </motion.div>
      </div>



      {/* Filters Panel */}
      <PropertyFiltersPanel
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onApply={handleSearch}
        onReset={handleResetFilters}
        propertyCount={properties.length}
      />

      {/* Featured Property Spotlight */}
      {!loading && featuredProperties.length > 0 && (
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <FeaturedPropertySpotlight properties={featuredProperties} />
        </div>
      )}

      {/* Properties Count with pulsing dot */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 mb-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-mansagold animate-pulse" />
            <span className="text-mansagold font-bold text-xl">
              {loading ? '...' : properties.length}
            </span>
            <span className="text-white/60 font-medium">properties found</span>
          </div>
          {user && (
            <Button
              onClick={() => navigate('/stays/list-property')}
              size="sm"
              className="bg-mansagold text-black hover:bg-mansagold/90 lg:hidden"
            >
              <Plus className="w-4 h-4 mr-2" />
              List Property
            </Button>
          )}
        </motion.div>
      </div>

      {/* Split-View Layout (Desktop) / Stacked Layout (Mobile) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-mansagold" />
          </div>
        ) : properties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10"
          >
            <Home className="w-16 h-16 mx-auto text-white/40 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">No properties found</h3>
            <p className="text-white/60 mb-6">
              Try adjusting your filters or check back soon for new listings.
            </p>
            {user && (
              <Button 
                onClick={() => navigate('/stays/list-property')} 
                className="bg-gradient-to-r from-mansagold to-amber-500 text-slate-900 hover:from-amber-400 hover:to-mansagold font-bold"
              >
                Be the first to list a property
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6" style={{ minHeight: '600px' }}>
            {/* Map (shown on top for mobile, sticky on desktop) */}
            <div className="w-full lg:w-[60%] lg:order-2 lg:sticky lg:top-4 lg:self-start rounded-xl overflow-hidden border-2 border-mansagold/30 shadow-lg shadow-mansagold/10">
              <Suspense fallback={<div className="w-full h-[400px] bg-slate-800/40 animate-pulse flex items-center justify-center"><Loader2 className="h-8 w-8 text-mansagold animate-spin" /></div>}>
                <PropertyMap 
                  properties={properties}
                  selectedPropertyId={selectedPropertyId}
                  onSelectProperty={(id) => {
                    setSelectedPropertyId(id);
                    const element = document.getElementById(`property-${id}`);
                    if (element && listRef.current) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  height="400px"
                />
              </Suspense>
            </div>

            {/* Property List (scrollable on desktop) */}
            <motion.div 
              ref={listRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="w-full lg:w-[40%] lg:order-1 space-y-4 lg:max-h-[600px] lg:overflow-y-auto lg:pr-3 scrollbar-thin scrollbar-thumb-mansagold/30 scrollbar-track-transparent"
            >
              {properties.map((property, index) => (
                <motion.div 
                  key={property.id}
                  id={`property-${property.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => setSelectedPropertyId(property.id)}
                  className={`cursor-pointer transition-all ${selectedPropertyId === property.id ? 'ring-2 ring-mansagold rounded-xl' : ''}`}
                >
                  <PropertyCard 
                    property={property} 
                    isHighlighted={selectedPropertyId === property.id}
                    onHover={(id) => setSelectedPropertyId(id || undefined)}
                    isFavorited={isFavorited(property.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>

      {/* Why Mansa Stays Section - Premium Upgrade */}
      <div className="relative z-10 bg-slate-900/50 backdrop-blur-xl py-20 px-4 border-t border-white/10">
        {/* Decorative accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-mansagold to-transparent" />
        
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="text-mansagold text-sm font-mono tracking-widest uppercase mb-4 block">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/80">
              Why Book with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-mansagold to-amber-400">
                Mansa Stays
              </span>
              ?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                emoji: '🏠',
                title: 'Support Black Hosts',
                description: 'Every booking directly supports Black property owners and entrepreneurs.',
              },
              {
                emoji: '💰',
                title: 'Lower Fees',
                description: 'Only 7.5% platform fee vs 14-20% on other platforms. More money stays with hosts.',
              },
              {
                emoji: '🌍',
                title: 'Community Impact',
                description: 'Part of every fee goes back to community initiatives and Susu Circles.',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-mansagold/20 to-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-mansagold/30 group-hover:border-mansagold/60 transition-all group-hover:scale-105">
                  <span className="text-4xl">{feature.emoji}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-mansagold transition-colors">
                  {feature.title}
                </h3>
                <p className="text-white/60">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <StaysBetaFeedbackWidget />
    </div>
  );
};

export default VacationRentalsPage;
