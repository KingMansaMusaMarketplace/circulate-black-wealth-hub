import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '@/components/vacation-rentals/PropertyCard';
import PropertyFilters from '@/components/vacation-rentals/PropertyFilters';
import PropertyMap from '@/components/stays/PropertyMap';
import { vacationRentalService } from '@/lib/services/vacation-rental-service';
import { VacationProperty, PropertySearchFilters } from '@/types/vacation-rental';
import { Loader2, Home, Map, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const VacationRentalsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [properties, setProperties] = useState<VacationProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PropertySearchFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>();

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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-mansablue to-mansablue-dark py-16 px-4">
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

          {/* CTA for hosts */}
          {user && (
            <Button
              onClick={() => navigate('/stays/list-property')}
              className="bg-mansagold text-black hover:bg-mansagold/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              List Your Property
            </Button>
          )}
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <PropertyFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />
      </div>

      {/* View Toggle */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            {loading ? 'Loading...' : `${properties.length} properties found`}
          </p>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Home className="w-4 h-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('map')}
            >
              <Map className="w-4 h-4 mr-2" />
              Map
            </Button>
          </div>
        </div>
      </div>

      {/* Properties Grid or Map */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <Home className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No properties found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or check back soon for new listings.
            </p>
            {user && (
              <Button onClick={() => navigate('/stays/list-property')}>
                Be the first to list a property
              </Button>
            )}
          </div>
        ) : viewMode === 'map' ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Property List (scrollable) */}
            <div className="lg:col-span-2 space-y-4 max-h-[700px] overflow-y-auto pr-2">
              {properties.map((property) => (
                <div 
                  key={property.id}
                  onClick={() => setSelectedPropertyId(property.id)}
                  className={`cursor-pointer transition-all ${selectedPropertyId === property.id ? 'ring-2 ring-mansagold rounded-lg' : ''}`}
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
            
            {/* Map */}
            <div className="lg:col-span-3 sticky top-4">
              <PropertyMap 
                properties={properties}
                selectedPropertyId={selectedPropertyId}
                onSelectProperty={(id) => {
                  setSelectedPropertyId(id);
                  navigate(`/stays/${id}`);
                }}
                height="700px"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>

      {/* Why Mansa Stays Section */}
      <div className="bg-secondary/50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Book with Mansa Stays?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-mansagold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏠</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Support Black Hosts</h3>
              <p className="text-muted-foreground">
                Every booking directly supports Black property owners and entrepreneurs.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-mansagold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lower Fees</h3>
              <p className="text-muted-foreground">
                Only 7.5% platform fee vs 14-20% on other platforms. More money stays with hosts.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-mansagold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Impact</h3>
              <p className="text-muted-foreground">
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
