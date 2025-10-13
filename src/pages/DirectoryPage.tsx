import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from '@/hooks/location/useLocation';
import { businesses } from '@/data/businessData';
import { BusinessFilters } from '@/lib/api/directory/types';
import { useMultiCityDirectory } from '@/hooks/use-multi-city-directory';
import MultiCityStats from '@/components/directory/MultiCityStats';
import { useOnboardingTour } from '@/hooks/useOnboardingTour';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';

// Import the directory components
import DirectoryHeader from '@/components/directory/DirectoryHeader';
import DirectoryLoadingState from '@/components/directory/DirectoryLoadingState';
import DirectoryErrorState from '@/components/directory/DirectoryErrorState';
import BusinessGridView from '@/components/directory/BusinessGridView';
import BusinessListView from '@/components/directory/BusinessListView';
import ScrollToTopButton from '@/components/directory/ScrollToTopButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, ListFilter, Grid3X3, List } from 'lucide-react';
import DirectoryFilter from '@/components/DirectoryFilter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Lazy load MapView for better code splitting
const MapView = React.lazy(() => import('@/components/MapView/MapView'));
import ErrorBoundary from '@/components/ErrorBoundary';
import { ContextualTooltip } from '@/components/ui/ContextualTooltip';
import { ProgressiveDisclosure } from '@/components/ui/ProgressiveDisclosure';
import { CONTEXTUAL_TIPS } from '@/lib/onboarding-constants';

const DirectoryPage: React.FC = () => {
  const { shouldShowTour, tourSteps, tourKey, completeTour, skipTour } = useOnboardingTour();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  
  // Fetch user location
  const { location, getCurrentPosition, loading: locationLoading } = useLocation();
  
  // Use the multi-city directory hook with the business data
  const {
    selectedCity,
    searchTerm,
    setSearchTerm,
    filterOptions,
    handleFilterChange,
    handleCityChange,
    categories,
    filteredBusinesses,
    mapData,
    totalBusinesses
  } = useMultiCityDirectory(businesses);

  // Safety check for data
  console.log('DirectoryPage - businesses:', businesses?.length);
  console.log('DirectoryPage - filteredBusinesses:', filteredBusinesses?.length);
  console.log('DirectoryPage - selectedCity:', selectedCity);
  console.log('DirectoryPage - searchTerm:', searchTerm);
  console.log('DirectoryPage - filterOptions:', filterOptions);
  
  if (!businesses || businesses.length === 0) {
    console.error('DirectoryPage - No businesses data available');
  }

  const handleSelectBusiness = (id: number) => {
    const business = filteredBusinesses.find(b => b.id === id);
    if (business) {
      // Scroll to the business card
      const element = document.getElementById(`business-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Highlight the card
        element.classList.add('ring-2', 'ring-mansablue');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-mansablue');
        }, 2000);
      }
    }
  };

  const handleGetLocation = useCallback(async () => {
    try {
      const newLocation = await getCurrentPosition(true);
      if (newLocation) {
        setShowMap(true); // Show map after getting location
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  }, [getCurrentPosition]);

  return (
    <ErrorBoundary>
      <Helmet>
        <title>Business Directory | Mansa Musa Marketplace</title>
        <meta name="description" content="Find and support Black-owned businesses in your community" />
      </Helmet>
      
      <>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-primary py-8">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Multi-City Marketplace</h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-6">
              Connect with Black-owned businesses across Chicago, Atlanta, Houston, Washington DC, and Detroit
            </p>
            
            <div className="relative max-w-xl mx-auto" data-tour="search-businesses">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="text" 
                placeholder="Search businesses across all cities..."
                className="pl-10 h-12 bg-background rounded-lg w-full"
                value={searchTerm || ''}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="py-8">
          <div className="container mx-auto">
            <MultiCityStats selectedCity={selectedCity} />
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              {/* Sidebar Filters */}
              <div className="w-full md:w-1/4">
                <ErrorBoundary>
                  <DirectoryFilter 
                    categories={categories || []}
                    filterOptions={filterOptions}
                    onFilterChange={handleFilterChange}
                    selectedCity={selectedCity}
                    onCityChange={handleCityChange}
                    showCitySelector={true}
                  />
                </ErrorBoundary>
              </div>
              
              {/* Main Content */}
              <div className="w-full md:w-3/4">
                <div className="bg-card rounded-lg shadow-sm p-4 mb-6">
                  <div className="flex flex-col sm:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 sm:mb-0">
                      <ListFilter className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span className="text-foreground">
                        {filteredBusinesses?.length || 0} businesses found
                        {selectedCity !== 'all' && (
                          <span className="text-muted-foreground ml-2">
                            in {selectedCity.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        )}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant={viewMode === 'grid' ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid3X3 className="h-4 w-4 mr-1" />
                        Grid
                      </Button>
                      <Button 
                        variant={viewMode === 'list' ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setViewMode('list')}
                      >
                        <List className="h-4 w-4 mr-1" />
                        List
                      </Button>
                      <ContextualTooltip
                        id="directory-map-view"
                        title={CONTEXTUAL_TIPS['directory-map'].title}
                        tip={CONTEXTUAL_TIPS['directory-map'].tip}
                        trigger="hover"
                      >
                        <Button 
                          variant={viewMode === 'map' ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setViewMode('map')}
                        >
                          <MapPin className="h-4 w-4 mr-1" />
                          Map
                        </Button>
                      </ContextualTooltip>
                    </div>
                  </div>
                </div>
                
                <ErrorBoundary>
                  <Tabs value={viewMode} onValueChange={(val) => setViewMode(val as 'grid' | 'list' | 'map')}>
                    <TabsContent value="grid" className="mt-0">
                      <div data-tour="business-card">
                        <BusinessGridView 
                          businesses={filteredBusinesses || []} 
                          onSelectBusiness={handleSelectBusiness} 
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="list" className="mt-0">
                      <BusinessListView 
                        businesses={filteredBusinesses || []} 
                        onSelectBusiness={handleSelectBusiness} 
                      />
                    </TabsContent>
                    <TabsContent value="map" className="mt-0">
                      <ContextualTooltip
                        id="directory-map-usage"
                        title="Interactive Map"
                        tip="Click on any business marker to see details. Use zoom controls to navigate and the search bar to find specific locations."
                        trigger="auto"
                        delay={2000}
                      >
                        <div className="h-[600px] rounded-lg overflow-hidden">
                          <React.Suspense fallback={
                            <div className="flex items-center justify-center h-full bg-muted">
                              <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                                <p className="text-sm text-muted-foreground">Loading map...</p>
                              </div>
                            </div>
                          }>
                            <MapView businesses={mapData || []} />
                          </React.Suspense>
                        </div>
                      </ContextualTooltip>
                    </TabsContent>
                  </Tabs>
                </ErrorBoundary>
              </div>
            </div>
          </div>
        </div>
        
        <ScrollToTopButton />
      </div>
      
      {shouldShowTour && (
        <OnboardingTour
          steps={tourSteps}
          tourKey={tourKey}
          onComplete={completeTour}
          onSkip={skipTour}
        />
      )}
      </>
    </ErrorBoundary>
  );
};

export default DirectoryPage;
