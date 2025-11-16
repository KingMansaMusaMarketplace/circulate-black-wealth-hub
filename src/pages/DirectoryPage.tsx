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
import { CompareButton } from '@/components/business/comparison/CompareButton';

// Lazy load MapView for better code splitting
const MapView = React.lazy(() => import('@/components/MapView/MapView'));
import ErrorBoundary from '@/components/ErrorBoundary';
import { ContextualTooltip } from '@/components/ui/ContextualTooltip';
import { ProgressiveDisclosure } from '@/components/ui/ProgressiveDisclosure';
import { CONTEXTUAL_TIPS } from '@/lib/onboarding-constants';
import { SmartDiscoveryWidget } from '@/components/discovery/SmartDiscoveryWidget';

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

  const handleSelectBusiness = (id: string) => {
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
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-[32rem] h-[32rem] bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-pink-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Enhanced Header */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 py-16 md:py-24 relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"></div>
          
          <div className="container mx-auto text-center relative z-10 px-4 animate-fade-in">
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
              Multi-City <span className="text-yellow-300">Marketplace</span> 🌆
            </h1>
            <p className="font-body text-xl sm:text-2xl text-white/95 leading-relaxed max-w-3xl mx-auto mb-10 font-medium">
              Connect with Black-owned businesses across Chicago, Atlanta, Houston, Washington DC, and Detroit
            </p>
            
            <div className="relative max-w-2xl mx-auto" data-tour="search-businesses">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-orange-400/30 to-pink-400/30 rounded-3xl blur-xl"></div>
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-purple-600" />
                <Input
                  type="text" 
                  placeholder="Search businesses across all cities... 🔍"
                  className="pl-14 h-16 rounded-3xl w-full text-xl md:text-2xl font-body shadow-2xl bg-white text-gray-900 placeholder:text-gray-500 border-0 focus-visible:ring-4 focus-visible:ring-purple-500/50"
                  value={searchTerm || ''}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="py-12 relative z-10">
          <div className="container mx-auto px-4">
            <div className="animate-fade-in">
              <MultiCityStats selectedCity={selectedCity} />
            </div>
            
            <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mt-8">
              {/* Sidebar Filters */}
              <div className="w-full lg:w-1/4 space-y-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="sticky top-24 space-y-6">
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
                  <ErrorBoundary>
                    <SmartDiscoveryWidget businesses={filteredBusinesses} />
                  </ErrorBoundary>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="w-full lg:w-3/4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-xl"></div>
                  <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-8 border-0 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                    <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="flex items-center">
                        <ListFilter className="h-6 w-6 mr-2 text-purple-600" />
                        <span className="font-body text-gray-900 font-bold text-lg">
                          {filteredBusinesses?.length || 0} businesses found 🎯
                        {selectedCity !== 'all' && (
                          <span className="text-gray-600 ml-2 font-normal">
                            in {selectedCity.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        )}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <CompareButton businesses={filteredBusinesses} />
                      <Button 
                        variant={viewMode === 'grid' ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        className="shadow-sm bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0"
                      >
                        <Grid3X3 className="h-4 w-4 mr-1" />
                        Grid
                      </Button>
                      <Button 
                        variant={viewMode === 'list' ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className="shadow-sm bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
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
                          className="shadow-sm bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white border-0"
                        >
                          <MapPin className="h-4 w-4 mr-1" />
                          Map
                        </Button>
                      </ContextualTooltip>
                    </div>
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
    </ErrorBoundary>
  );
};

export default DirectoryPage;
