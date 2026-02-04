import React, { useState, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from '@/hooks/location/useLocation';
import { useSupabaseDirectory } from '@/hooks/use-supabase-directory';
import MultiCityStats from '@/components/directory/MultiCityStats';
import { useOnboardingTour } from '@/hooks/useOnboardingTour';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';
import { useGuest } from '@/contexts/GuestContext';
import { useAuth } from '@/contexts/AuthContext';
import SignupPromptModal from '@/components/auth/SignupPromptModal';
import { pageSEO } from '@/utils/seoUtils';
import { BreadcrumbStructuredData, generateBreadcrumbs } from '@/components/SEO/BreadcrumbStructuredData';
import { motion } from 'framer-motion';

// Import the directory components
import DirectoryErrorState from '@/components/directory/DirectoryErrorState';
import BusinessGridView from '@/components/directory/BusinessGridView';
import BusinessListView from '@/components/directory/BusinessListView';
import ScrollToTopButton from '@/components/directory/ScrollToTopButton';
import PremiumSearchBar from '@/components/directory/PremiumSearchBar';
import FeaturedSpotlight from '@/components/directory/FeaturedSpotlight';
import CategoryPills from '@/components/directory/CategoryPills';
import { SkeletonGrid } from '@/components/directory/SkeletonCard';
import DirectoryFilter from '@/components/DirectoryFilter';
import ErrorBoundary from '@/components/ErrorBoundary';

const DirectoryPage: React.FC = () => {
  const { shouldShowTour, tourSteps, tourKey, completeTour, skipTour } = useOnboardingTour();
  const { user } = useAuth();
  const { recordBusinessView, recordAttemptedAction, showSignupPrompt, setShowSignupPrompt, lastAttemptedAction } = useGuest();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
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

  // Get featured business for spotlight
  const featuredBusiness = useMemo(() => {
    return filteredBusinesses?.find(b => b.isFeatured);
  }, [filteredBusinesses]);

  // Get non-featured businesses for the grid
  const regularBusinesses = useMemo(() => {
    if (!featuredBusiness) return filteredBusinesses || [];
    return filteredBusinesses?.filter(b => b.id !== featuredBusiness.id) || [];
  }, [filteredBusinesses, featuredBusiness]);

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
        element.classList.add('ring-2', 'ring-mansagold');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-mansagold');
        }, 2000);
      }
    }
  }, [filteredBusinesses, user, recordBusinessView]);

  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  // Handle category selection
  const handleCategorySelect = useCallback((category: string | undefined) => {
    handleFilterChange({ category });
  }, [handleFilterChange]);

  // Calculate business counts per category
  const businessCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredBusinesses?.forEach(b => {
      counts[b.category] = (counts[b.category] || 0) + 1;
    });
    return counts;
  }, [filteredBusinesses]);

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
      
      <div className="min-h-screen relative overflow-hidden">
        {/* Modern dark gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" />
        
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-mansablue/30 to-blue-600/30 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/4 -right-32 w-[32rem] h-[32rem] bg-gradient-to-tl from-mansagold/25 to-amber-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute -bottom-40 left-1/4 w-[28rem] h-[28rem] bg-gradient-to-tr from-blue-700/25 to-mansablue/25 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-bl from-mansagold/20 to-amber-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

        {/* Subtle gold accent line at top */}
        <div className="h-1 bg-gradient-to-r from-transparent via-mansagold to-transparent opacity-60 relative z-10" />
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          {/* Premium Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-4">
              <span className="text-mansagold text-sm font-mono tracking-widest uppercase bg-mansagold/10 px-4 py-2 rounded-full border border-mansagold/20">
                ✦ Discover • Support • Thrive ✦
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-display">
              Black-Owned Business
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-mansagold via-amber-400 to-mansagold">
                Directory
              </span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl">
              Discover amazing businesses in your community and start earning loyalty points today
            </p>
          </motion.div>
          
          {/* Premium Search Bar */}
          <div data-tour="search-businesses">
            <PremiumSearchBar
              searchTerm={searchTerm || ''}
              onSearchChange={setSearchTerm}
              viewMode={viewMode}
              setViewMode={setViewMode}
              showFilters={showFilters}
              toggleFilters={toggleFilters}
            />
          </div>
          
          {/* Category Pills */}
          <CategoryPills
            categories={categories}
            selectedCategory={filterOptions.category}
            onSelectCategory={handleCategorySelect}
            businessCounts={businessCounts}
          />
          
          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <DirectoryFilter
                categories={categories}
                filterOptions={filterOptions}
                onFilterChange={handleFilterChange}
              />
            </motion.div>
          )}
          
          {/* Featured Spotlight */}
          {featuredBusiness && !searchTerm && !isLoading && (
            <FeaturedSpotlight business={featuredBusiness} />
          )}
          
          {/* Results count with premium styling */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-mansagold animate-pulse" />
              <p className="text-gray-400">
                {isLoading ? (
                  <span className="text-gray-500">Loading businesses...</span>
                ) : (
                  <>
                    <span className="text-mansagold font-bold text-xl">{filteredBusinesses?.length || 0}</span>
                    <span className="ml-2">businesses found</span>
                  </>
                )}
              </p>
            </div>
            <div className="h-px flex-1 mx-6 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </motion.div>
        
          {/* Business Grid/List with Skeleton Loading */}
          <div data-tour="business-card">
            {isLoading ? (
              <SkeletonGrid count={6} />
            ) : viewMode === 'grid' ? (
              <BusinessGridView 
                businesses={regularBusinesses} 
                onSelectBusiness={handleSelectBusiness} 
              />
            ) : (
              <BusinessListView 
                businesses={regularBusinesses} 
                onSelectBusiness={handleSelectBusiness} 
              />
            )}
          </div>
          
          {/* Stats section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16 pt-12 border-t border-white/10"
          >
            <MultiCityStats selectedCity={selectedCity} />
          </motion.div>
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
