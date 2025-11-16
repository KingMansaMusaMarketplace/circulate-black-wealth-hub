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
      
      <>
      <div className="min-h-screen bg-gradient-subtle">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-br from-mansablue via-mansablue-dark to-mansablue py-16 md:py-20 relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJWMzZ6TTM2IDM4djJoMnYtMnptLTIgMHYyaDJ2LTJ6bTAgMnYyaDJ2LTJ6bS0yLTJ2Mmgydi0yem0wIDJ2Mmgydi0yem0tMi0ydjJoMnYtMnptMCAydjJoMnYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
          
          <div className="container mx-auto text-center relative z-10 px-4">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              Multi-City <span className="bg-gradient-gold bg-clip-text text-transparent">Marketplace</span>
            </h1>
            <p className="font-body text-lg sm:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto mb-8">
              Connect with Black-owned businesses across Chicago, Atlanta, Houston, Washington DC, and Detroit
            </p>
            
            <div className="relative max-w-xl mx-auto" data-tour="search-businesses">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-foreground/70" />
              <Input
                type="text" 
                placeholder="Search businesses across all cities..."
                className="pl-12 h-14 glass-card rounded-2xl w-full text-lg font-body shadow-2xl bg-background/10 text-primary-foreground placeholder:text-primary-foreground/70 border border-primary-foreground/30 focus-visible:ring-offset-0"
                value={searchTerm || ''}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="py-12">
          <div className="container mx-auto px-4">
            <MultiCityStats selectedCity={selectedCity} />
            
            <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mt-8">
              {/* Sidebar Filters */}
              <div className="w-full lg:w-1/4 space-y-6">
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
              <div className="w-full lg:w-3/4">
                <div className="glass-card backdrop-blur-xl rounded-2xl shadow-xl p-6 mb-8 border border-border/30">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center">
                      <ListFilter className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span className="font-body text-foreground font-semibold">
                        {filteredBusinesses?.length || 0} businesses found
                        {selectedCity !== 'all' && (
                          <span className="text-muted-foreground ml-2 font-normal">
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
                        className="shadow-sm"
                      >
                        <Grid3X3 className="h-4 w-4 mr-1" />
                        Grid
                      </Button>
                      <Button 
                        variant={viewMode === 'list' ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className="shadow-sm"
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
                          className="shadow-sm"
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
