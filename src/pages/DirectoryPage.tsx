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
      
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Subtle gold accent line at top */}
        <div className="h-1 bg-gradient-to-r from-transparent via-mansagold to-transparent opacity-60" />
        
        <div className="container mx-auto px-4 py-16">
          {/* Premium Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-mansagold text-sm font-mono tracking-widest uppercase">
                Discover • Support • Thrive
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display">
              Black-Owned Business Directory
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Discover amazing businesses in your community and start earning loyalty points today
            </p>
          </div>
          
          {/* Premium Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-16" data-tour="search-businesses">
            <div className="absolute inset-0 bg-gradient-to-r from-mansagold/20 via-transparent to-mansagold/20 rounded-xl blur-xl opacity-50" />
            <div className="relative glass-card rounded-xl p-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-mansagold" />
                <Input
                  type="text" 
                  placeholder="Search businesses by name, category, or location..."
                  className="pl-12 h-14 rounded-lg w-full text-base bg-slate-900/50 border-white/10 text-white placeholder:text-gray-500 focus:border-mansagold/50 focus:ring-mansagold/20"
                  value={searchTerm || ''}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Results count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-400">
              <span className="text-mansagold font-semibold">{filteredBusinesses?.length || 0}</span> businesses found
            </p>
            <div className="h-px flex-1 mx-6 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        
          {/* Business Grid */}
          <div data-tour="business-card">
            <BusinessGridView 
              businesses={filteredBusinesses || []} 
              onSelectBusiness={handleSelectBusiness} 
            />
          </div>
          
          {/* Stats section */}
          <div className="text-center mt-16 pt-12 border-t border-white/10">
            <MultiCityStats selectedCity={selectedCity} />
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
