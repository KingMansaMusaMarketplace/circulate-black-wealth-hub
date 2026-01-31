import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from '@/hooks/location/useLocation';
import { BusinessFilters } from '@/lib/api/directory/types';
import { useSupabaseDirectory } from '@/hooks/use-supabase-directory';
import MultiCityStats from '@/components/directory/MultiCityStats';
import GlobalReachBanner from '@/components/directory/GlobalReachBanner';
import { useOnboardingTour } from '@/hooks/useOnboardingTour';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';
import { useGuest } from '@/contexts/GuestContext';
import { useAuth } from '@/contexts/AuthContext';
import SignupPromptModal from '@/components/auth/SignupPromptModal';
import { pageSEO } from '@/utils/seoUtils';
import { BreadcrumbStructuredData, generateBreadcrumbs } from '@/components/SEO/BreadcrumbStructuredData';

// Import the directory components
import DirectoryHeader from '@/components/directory/DirectoryHeader';
import DirectoryLoadingState from '@/components/directory/DirectoryLoadingState';
import DirectoryErrorState from '@/components/directory/DirectoryErrorState';
import { WebSearchSection } from '@/components/business/discovery/WebSearchSection';
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
import { DiscoveredBusinessesSection } from '@/components/directory/DiscoveredBusinessesSection';

const DirectoryPage: React.FC = () => {
  const { shouldShowTour, tourSteps, tourKey, completeTour, skipTour } = useOnboardingTour();
  const { user } = useAuth();
  const { recordBusinessView, recordAttemptedAction, showSignupPrompt, setShowSignupPrompt, lastAttemptedAction } = useGuest();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  
  // Fetch user location
  const { location, getCurrentPosition, loading: locationLoading } = useLocation();
  
  // Use the Supabase directory hook to fetch real businesses
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
    totalBusinesses,
    isLoading,
    error
  } = useSupabaseDirectory();

  const handleSelectBusiness = useCallback((id: string) => {
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
  }, [filteredBusinesses, user, recordBusinessView]);

  // Handler for guest actions that require auth
  const handleGuestAction = useCallback((action: string, businessName?: string) => {
    if (!user) {
      recordAttemptedAction(action, businessName);
      return false;
    }
    return true;
  }, [user, recordAttemptedAction]);

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

  // Show loading state
  if (isLoading) {
    return <DirectoryLoadingState />;
  }

  // Show error state
  if (error) {
    return <DirectoryErrorState error={error instanceof Error ? error.message : 'Failed to load businesses'} />;
  }

  return (
    <ErrorBoundary>
      <Helmet>
        <title>{pageSEO.directory.title}</title>
        <meta name="description" content={pageSEO.directory.description} />
        <meta name="keywords" content={pageSEO.directory.keywords.join(', ')} />
      </Helmet>
      
      <BreadcrumbStructuredData items={generateBreadcrumbs.directory()} />
      
      <div className="min-h-screen bg-gray-50">

        {/* Header */}
        <div className="bg-gradient-to-r from-mansablue to-blue-600 py-16 md:py-20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mansagold via-orange-400 to-mansagold"></div>
          
          <div className="container mx-auto text-center relative z-10 px-4">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 flex items-center justify-center gap-4 flex-wrap">
              <span className="font-mono tracking-wider text-mansagold">1325.AI</span> Business Directory
              <img src={earthImage} alt="Global Network" className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 drop-shadow-lg rounded-full" />
            </h1>
            <p className="font-body text-lg sm:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-6">
              Discover amazing Black-owned businesses in your community and start earning loyalty points today
            </p>
            
            <div className="relative max-w-xl mx-auto" data-tour="search-businesses">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text" 
                placeholder="Search businesses..."
                className="pl-12 h-14 rounded-full w-full text-lg font-body shadow-lg bg-white border-0 text-gray-900 placeholder:text-gray-400 focus-visible:ring-4 focus-visible:ring-mansagold/50"
                value={searchTerm || ''}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="py-12">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <MultiCityStats selectedCity={selectedCity} />
            </div>
            
            {/* Featured Sponsor Section */}
            <div className="mb-8">
              <SponsorLogoGrid 
                placement="directory" 
                maxLogos={4}
                variant="light"
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              />
            </div>
            
            <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
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
                  {/* Sidebar Sponsor Logos */}
                  <div className="mt-6">
                    <SponsorLogoGrid 
                      placement="sidebar" 
                      maxLogos={4}
                      variant="light"
                      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                    />
                  </div>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="w-full lg:w-3/4">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center">
                      <ListFilter className="h-5 w-5 mr-2 text-mansablue" />
                      <span className="font-body text-gray-900 font-bold text-lg">
                        {filteredBusinesses?.length || 0} businesses found
                        {selectedCity !== 'all' && (
                          <span className="text-gray-500 ml-2 font-normal">
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
                        className={viewMode === 'grid' ? 'bg-mansablue hover:bg-mansablue-dark' : ''}
                        aria-label="Grid view"
                        aria-pressed={viewMode === 'grid'}
                      >
                        <Grid3X3 className="h-4 w-4 mr-1" />
                        <span>Grid</span>
                      </Button>
                      <Button 
                        variant={viewMode === 'list' ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className={viewMode === 'list' ? 'bg-mansablue hover:bg-mansablue-dark' : ''}
                        aria-label="List view"
                        aria-pressed={viewMode === 'list'}
                      >
                        <List className="h-4 w-4 mr-1" />
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
                          className={viewMode === 'map' ? 'bg-mansagold hover:bg-mansagold-dark text-gray-900' : ''}
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
                
                {/* Discovered Businesses Section - Claim Your Business */}
                <div className="mt-12">
                  <DiscoveredBusinessesSection />
                </div>
                
                {/* Web Search Section - Find businesses not on platform */}
                <div className="mt-8">
                  <WebSearchSection initialQuery={searchTerm || ''} />
                </div>
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
