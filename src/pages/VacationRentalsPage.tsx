import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '@/components/vacation-rentals/PropertyCard';
import PropertyFilters from '@/components/vacation-rentals/PropertyFilters';
import PropertyMap from '@/components/stays/PropertyMap';
import { vacationRentalService } from '@/lib/services/vacation-rental-service';
import { VacationProperty, PropertySearchFilters } from '@/types/vacation-rental';
import { Loader2, Home, Map, Plus, Luggage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const VacationRentalsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [properties, setProperties] = useState<VacationProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PropertySearchFilters>({});
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-mansablue/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-mansagold/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] pointer-events-none" />
      
      {/* Hero Section */}
      <div className="relative z-10 bg-gradient-to-br from-mansablue/30 to-mansablue-dark/30 py-16 px-4 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Mansa Stays
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Book unique vacation rentals from Black property owners. 
            Experience authentic hospitality while supporting the community.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-mansagold">{properties.length}+</p>
              <p className="text-white/70 text-sm">Properties</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-mansagold">7.5%</p>
              <p className="text-white/70 text-sm">Lower Fees</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-mansagold">100%</p>
              <p className="text-white/70 text-sm">Black-Owned</p>
            </div>
          </div>

          {/* CTA buttons */}
          {user && (
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                onClick={() => navigate('/stays/my-bookings')}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Luggage className="w-4 h-4 mr-2" />
                My Stays
              </Button>
              <Button
                onClick={() => navigate('/stays/list-property')}
                className="bg-mansagold text-black hover:bg-mansagold/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                List Your Property
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Filters Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        <PropertyFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />
      </div>

      {/* Properties Count */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 mb-4">
        <div className="flex items-center justify-between">
          <p className="text-white font-medium">
            {loading ? 'Loading...' : `${properties.length} properties found`}
          </p>
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
        </div>
      </div>

      {/* Split-View Layout (Desktop) / Stacked Layout (Mobile) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-mansagold" />
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <Home className="w-16 h-16 mx-auto text-white/40 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">No properties found</h3>
            <p className="text-white/60 mb-6">
              Try adjusting your filters or check back soon for new listings.
            </p>
            {user && (
              <Button onClick={() => navigate('/stays/list-property')} className="bg-mansagold text-black hover:bg-mansagold/90">
                Be the first to list a property
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6" style={{ minHeight: '600px' }}>
            {/* Map (shown on top for mobile, sticky on desktop) */}
            <div className="w-full lg:w-[60%] lg:order-2 lg:sticky lg:top-4 lg:self-start rounded-xl overflow-hidden border-2 border-mansagold/30">
              <PropertyMap 
                properties={properties}
                selectedPropertyId={selectedPropertyId}
                onSelectProperty={(id) => {
                  setSelectedPropertyId(id);
                  // Scroll to the property in the list
                  const element = document.getElementById(`property-${id}`);
                  if (element && listRef.current) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                height="400px"
              />
            </div>

            {/* Property List (scrollable on desktop) */}
            <div 
              ref={listRef}
              className="w-full lg:w-[40%] lg:order-1 space-y-4 lg:max-h-[600px] lg:overflow-y-auto lg:pr-3 scrollbar-thin scrollbar-thumb-mansagold/30 scrollbar-track-transparent"
            >
              {properties.map((property) => (
                <div 
                  key={property.id}
                  id={`property-${property.id}`}
                  onClick={() => setSelectedPropertyId(property.id)}
                  className={`cursor-pointer transition-all ${selectedPropertyId === property.id ? 'ring-2 ring-mansagold rounded-xl' : ''}`}
                >
                  <PropertyCard 
                    property={property} 
                    isHighlighted={selectedPropertyId === property.id}
                    onHover={(id) => setSelectedPropertyId(id || undefined)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Why Mansa Stays Section */}
      <div className="relative z-10 bg-slate-900/50 backdrop-blur-sm py-16 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Why Book with Mansa Stays?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-mansagold/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-mansagold/30">
                <span className="text-3xl">🏠</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Support Black Hosts</h3>
              <p className="text-white/60">
                Every booking directly supports Black property owners and entrepreneurs.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-mansagold/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-mansagold/30">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Lower Fees</h3>
              <p className="text-white/60">
                Only 7.5% platform fee vs 14-20% on other platforms. More money stays with hosts.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-mansagold/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-mansagold/30">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Community Impact</h3>
              <p className="text-white/60">
                Part of every fee goes back to community initiatives and Susu Circles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VacationRentalsPage;
