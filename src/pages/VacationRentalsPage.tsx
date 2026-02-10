import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PropertyCard from '@/components/vacation-rentals/PropertyCard';
import PropertyMap from '@/components/stays/PropertyMap';
import PremiumPropertySearchBar from '@/components/stays/PremiumPropertySearchBar';
import PropertyFiltersPanel from '@/components/stays/PropertyFiltersPanel';
import ActiveFiltersBar from '@/components/stays/ActiveFiltersBar';
import FeaturedPropertySpotlight from '@/components/stays/FeaturedPropertySpotlight';
import { vacationRentalService } from '@/lib/services/vacation-rental-service';
import { VacationProperty, PropertySearchFilters } from '@/types/vacation-rental';
import { Loader2, Home, Plus, Luggage, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const VacationRentalsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
  const featuredProperty = properties.find(p => p.is_verified) || properties[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
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
            className="font-display text-5xl sm:text-6xl md:text-7xl font-bold mb-6"
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
              <p className="text-white/60 text-sm font-mono tracking-wider uppercase">Black-Owned</p>
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
      {!loading && featuredProperty && (
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <FeaturedPropertySpotlight property={featuredProperty} />
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
    </div>
  );
};

export default VacationRentalsPage;
