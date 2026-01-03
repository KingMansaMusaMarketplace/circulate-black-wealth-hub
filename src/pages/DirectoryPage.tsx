import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from '@/hooks/location/useLocation';
import { businesses } from '@/data/businessData';
import { BusinessFilters } from '@/lib/api/directory/types';
import { useMultiCityDirectory } from '@/hooks/use-multi-city-directory';
import MultiCityStats from '@/components/directory/MultiCityStats';
import GlobalReachBanner from '@/components/directory/GlobalReachBanner';
import { useOnboardingTour } from '@/hooks/useOnboardingTour';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';
import { useGuest } from '@/contexts/GuestContext';
import { useAuth } from '@/contexts/AuthContext';
import SignupPromptModal from '@/components/auth/SignupPromptModal';

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
import earthImage from '@/assets/earth.png';
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
import { SponsorLogoGrid } from '@/components/sponsors/SponsorLogoGrid';

const DirectoryPage: React.FC = () => {
  const { shouldShowTour, tourSteps, tourKey, completeTour, skipTour } = useOnboardingTour();
  const { user } = useAuth();
  const { recordBusinessView, recordAttemptedAction, showSignupPrompt, setShowSignupPrompt, lastAttemptedAction } = useGuest();
  
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
      // Track business view for guests
      if (!user) {
        recordBusinessView(id);
      }
      
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

  // Handler for guest actions that require auth
  const handleGuestAction = (action: string, businessName?: string) => {
    if (!user) {
      recordAttemptedAction(action, businessName);
      return false;
    }
    return true;
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
      
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-mansablue/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-[32rem] h-[32rem] bg-mansagold/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
        </div>

        {/* Enhanced Header */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-16 md:py-24 relative overflow-hidden border-b border-white/10">
          {/* Background effects */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-mansablue via-blue-500 to-mansagold"></div>
          
          <div className="container mx-auto text-center relative z-10 px-4 animate-fade-in">
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg flex items-center justify-center gap-4 flex-wrap">
              Multi-City <span className="bg-gradient-to-r from-mansagold via-amber-400 to-orange-400 bg-clip-text text-transparent">Marketplace</span>
              <img src={earthImage} alt="Earth" className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 drop-shadow-[0_0_15px_rgba(255,193,7,0.5)] rounded-full" />
            </h1>
            <p className="font-body text-xl sm:text-2xl text-slate-300 leading-relaxed max-w-4xl mx-auto mb-6 font-medium">
              Connect with Black-owned businesses worldwide
            </p>
            
            <div className="mb-10">
              <GlobalReachBanner />
            </div>
            
            <div className="relative max-w-2xl mx-auto" data-tour="search-businesses">
              <div className="absolute inset-0 bg-gradient-to-r from-mansablue/30 via-blue-500/30 to-mansagold/30 rounded-3xl blur-xl"></div>
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-mansagold" />
                <Input
                  type="text" 
                  placeholder="Search businesses across all cities... 🔍"
                  className="pl-14 h-16 rounded-3xl w-full text-xl md:text-2xl font-body shadow-2xl bg-slate-800/60 border border-white/10 text-white placeholder:text-slate-400 focus-visible:ring-4 focus-visible:ring-mansagold/50"
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
            
            {/* Featured Sponsor Section - Gold+ tiers */}
            <div className="mt-6 animate-fade-in" style={{ animationDelay: '0.05s' }}>
              <SponsorLogoGrid 
                placement="directory" 
                maxLogos={4}
                variant="dark"
                className="bg-gradient-to-r from-slate-800/80 to-blue-900/80 backdrop-blur-sm rounded-2xl p-6 border border-mansagold/20"
              />
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
                  {/* Sidebar Sponsor Logos - Silver+ tiers */}
                  <div className="mt-6">
                    <SponsorLogoGrid 
                      placement="sidebar" 
                      maxLogos={4}
                      variant="dark"
                      className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                    />
                  </div>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="w-full lg:w-3/4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-mansablue/20 via-blue-500/20 to-mansagold/20 rounded-3xl blur-xl"></div>
                  <div className="relative border border-white/10 bg-slate-800/60 backdrop-blur-xl rounded-3xl shadow-2xl p-6 mb-8 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-mansablue via-blue-500 to-mansagold"></div>
                    <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="flex items-center">
                        <ListFilter className="h-6 w-6 mr-2 text-mansagold" />
                        <span className="font-body text-white font-bold text-lg">
                          {filteredBusinesses?.length || 0} businesses found 🎯
                        {selectedCity !== 'all' && (
                          <span className="text-slate-300 ml-2 font-normal">
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
                        className={`shadow-sm ${viewMode === 'grid' ? 'bg-gradient-to-r from-mansablue to-blue-500 hover:from-blue-600 hover:to-blue-600 text-white border-0' : 'border-white/10 text-slate-300 hover:bg-white/10'}`}
                        aria-label="Grid view"
                        aria-pressed={viewMode === 'grid'}
                      >
                        <Grid3X3 className={`h-4 w-4 mr-1`} />
                        <span>Grid</span>
                      </Button>
                      <Button 
                        variant={viewMode === 'list' ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className={`shadow-sm ${viewMode === 'list' ? 'bg-gradient-to-r from-blue-500 to-mansagold hover:from-blue-600 hover:to-amber-500 text-white border-0' : 'border-white/10 text-slate-300 hover:bg-white/10'}`}
                        aria-label="List view"
                        aria-pressed={viewMode === 'list'}
                      >
                        <List className={`h-4 w-4 mr-1`} />
                        <span>List</span>
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
                          className={`shadow-sm ${viewMode === 'map' ? 'bg-gradient-to-r from-mansagold to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white border-0' : 'border-white/10 text-slate-300 hover:bg-white/10'}`}
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
      
      {/* Signup Prompt Modal for Guests */}
      <SignupPromptModal 
        isOpen={showSignupPrompt}
        onClose={() => setShowSignupPrompt(false)}
        action={lastAttemptedAction?.action || 'save_favorite'}
        businessName={lastAttemptedAction?.businessName}
      />
    </ErrorBoundary>
  );
};

export default DirectoryPage;
