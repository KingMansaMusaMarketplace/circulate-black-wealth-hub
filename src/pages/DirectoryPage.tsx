import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Business } from '@/types/business';
import { Helmet } from 'react-helmet-async';
import { useLocation } from '@/hooks/location/useLocation';
import { useSupabaseDirectory } from '@/hooks/use-supabase-directory';
import MultiCityStats from '@/components/directory/MultiCityStats';
import { useGuest } from '@/contexts/GuestContext';
import { useAuth } from '@/contexts/AuthContext';
import SignupPromptModal from '@/components/auth/SignupPromptModal';
import { pageSEO } from '@/utils/seoUtils';
import { BreadcrumbStructuredData, generateBreadcrumbs } from '@/components/SEO/BreadcrumbStructuredData';
import DirectoryStructuredData from '@/components/SEO/DirectoryStructuredData';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { getBusinessBanner } from '@/utils/businessBanners';
import { List, Map as MapIcon, Grid3X3, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
import DirectorySplitView from '@/components/directory/DirectorySplitView';
import DirectoryPagination from '@/components/directory/DirectoryPagination';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useIsMobile } from '@/hooks/use-mobile';
import SponsorSidebar from '@/components/sponsors/SponsorSidebar';
import AlphabetJumpIndex from '@/components/directory/AlphabetJumpIndex';

const DirectoryPage: React.FC = () => {
  
  const { user } = useAuth();
  const { recordBusinessView, recordAttemptedAction, showSignupPrompt, setShowSignupPrompt, lastAttemptedAction } = useGuest();
  const isMobile = useIsMobile();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'split'>('split');
  const [showFilters, setShowFilters] = useState(false);
  const [mapApiKey, setMapApiKey] = useState<string>('');
  
  // Fetch user location
  const { location, getCurrentPosition, loading: locationLoading } = useLocation();
  
  // Fetch Mapbox API key
  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        if (data?.token) {
          setMapApiKey(data.token);
        }
      } catch (err) {
        console.error('Failed to fetch Mapbox token:', err);
      }
    };
    fetchMapboxToken();
  }, []);
  
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
    businessCounts,
    isLoading,
    error,
    page,
    setPage,
    totalPages,
  } = useSupabaseDirectory();

  // Fetch top-rated businesses for Featured Spotlight (separate from paginated results)
  const { data: featuredBusinesses = [] } = useQuery({
    queryKey: ['featured-spotlight-businesses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('id, name, business_name, description, category, address, city, state, zip_code, website, logo_url, banner_url, average_rating, review_count, is_verified, latitude, longitude, created_at, updated_at')
        .eq('is_verified', true)
        .gte('average_rating', 4)
        .gt('review_count', 0)
        .not('id', 'in', '(ac39bb6d-7669-4972-9ad7-ebd0d42b86d3)') // Exclude Dakar NOLA from Featured Spotlight
        .order('average_rating', { ascending: false })
        .order('review_count', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      return (data || []).map((b: any) => {
        const bannerUrl = getBusinessBanner(b.id, b.banner_url, b.website) || '';
        const logoUrl = b.logo_url || '';
        const cardImage = bannerUrl || logoUrl;
        const businessName = b.name || b.business_name || 'Unnamed Business';
        return {
          id: b.id,
          name: businessName,
          description: b.description || '',
          category: b.category || 'Other',
          address: b.address || '',
          city: b.city || '',
          state: b.state || '',
          zipCode: b.zip_code || '',
          phone: '',
          email: '',
          website: b.website || '',
          logoUrl,
          bannerUrl,
          averageRating: Number(b.average_rating) || 0,
          reviewCount: b.review_count || 0,
          rating: Number(b.average_rating) || 0,
          discount: '',
          discountValue: 0,
          distance: '',
          distanceValue: 0,
          lat: b.latitude || 0,
          lng: b.longitude || 0,
          imageUrl: cardImage,
          imageAlt: businessName,
          isFeatured: true,
          isVerified: b.is_verified || false,
          isSample: false,
          ownerId: '',
          createdAt: b.created_at,
          updatedAt: b.updated_at,
        };
      }) as Business[];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // All paginated businesses go to the grid (featured spotlight is separate)
  const regularBusinesses = useMemo(
    () => [...(filteredBusinesses || [])].sort((a, b) => a.name.localeCompare(b.name)),
    [filteredBusinesses]
  );

  // Alphabet jump index support
  const activeLetters = useMemo(() => {
    const letters = new Set<string>();
    (regularBusinesses || []).forEach(b => {
      const first = b.name.charAt(0).toUpperCase();
      letters.add(/[A-Z]/.test(first) ? first : '#');
    });
    return letters;
  }, [regularBusinesses]);

  const handleJumpToLetter = useCallback((letter: string) => {
    const targets = Array.from(document.querySelectorAll(`[data-letter-group="${letter}"]`)) as HTMLElement[];
    const target = targets.find((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    }) ?? null;
    if (!target) return;

    const scrollContainer = target.closest('[data-radix-scroll-area-viewport]') as HTMLElement | null;
    if (scrollContainer) {
      const containerRect = scrollContainer.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const nextTop = targetRect.top - containerRect.top + scrollContainer.scrollTop - 56;
      scrollContainer.scrollTo({ top: Math.max(0, nextTop), behavior: 'smooth' });
      return;
    }

    const y = target.getBoundingClientRect().top + window.pageYOffset - 160;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  }, []);

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

  // businessCounts now comes from the hook (server-side)

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
      <DirectoryStructuredData totalBusinesses={totalBusinesses || 12000} />
      
      <div className="min-h-screen relative overflow-x-hidden">
        {/* Modern dark gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#050a18] to-[#030712]" />
        
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-mansablue/30 to-blue-600/30 rounded-full blur-3xl animate-float will-change-transform" />
          <div className="absolute top-1/4 -right-32 w-[32rem] h-[32rem] bg-gradient-to-tl from-mansagold/25 to-amber-500/25 rounded-full blur-3xl animate-pulse will-change-transform" style={{ animationDelay: '1s' }} />
          <div className="absolute -bottom-40 left-1/4 w-[28rem] h-[28rem] bg-gradient-to-tr from-blue-700/25 to-mansablue/25 rounded-full blur-3xl animate-float will-change-transform" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-bl from-mansagold/20 to-amber-600/20 rounded-full blur-3xl animate-pulse will-change-transform" style={{ animationDelay: '1.5s' }} />
        </div>

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

        {/* Subtle gold accent line at top */}
        <div className="h-1 bg-gradient-to-r from-transparent via-mansagold to-transparent opacity-60 relative z-10" />
        
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
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
               {totalBusinesses ? `${totalBusinesses.toLocaleString()}+ verified businesses` : '50,000+ verified businesses'} — discover, support, and earn loyalty points
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
            totalCount={totalBusinesses}
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
          
          {/* Featured Spotlight Carousel */}
          {featuredBusinesses.length > 0 && !searchTerm && !isLoading && (
            <FeaturedSpotlight businesses={featuredBusinesses} />
          )}
          
          {/* Results count with view mode toggles - consolidated for easy access */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-between gap-4 mb-8"
          >
            <div className="flex flex-wrap items-center gap-4">
              {/* Business count */}
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-mansagold animate-pulse" />
                <p className="text-gray-400">
                {isLoading ? (
                    <span className="text-gray-500">Loading businesses...</span>
                  ) : (
                    <>
                      <span className="text-mansagold font-bold text-xl">{totalBusinesses?.toLocaleString() || 0}</span>
                      <span className="ml-2">businesses found</span>
                      {totalPages > 1 && (
                        <span className="ml-2 text-gray-500">· page {page} of {totalPages}</span>
                      )}
                    </>
                  )}
                </p>
              </div>
              
              {/* View mode toggles - now right next to count */}
              {!isLoading && (
                <TooltipProvider delayDuration={200}>
                  <div className="flex items-center gap-1 bg-slate-800/50 backdrop-blur-sm rounded-lg p-1 border border-white/10">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewMode('split')}
                          className={`h-8 px-3 ${viewMode === 'split' ? 'bg-mansagold/20 text-mansagold' : 'text-gray-400 hover:text-white'}`}
                        >
                          <MapIcon className="h-4 w-4" />
                          <span className="ml-2 hidden sm:inline">Map</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-slate-800 text-white border-white/10">
                        <p>Split View with Map</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewMode('grid')}
                          className={`h-8 px-3 ${viewMode === 'grid' ? 'bg-mansagold/20 text-mansagold' : 'text-gray-400 hover:text-white'}`}
                        >
                          <Grid3X3 className="h-4 w-4" />
                          <span className="ml-2 hidden sm:inline">Grid</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-slate-800 text-white border-white/10">
                        <p>Grid View</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewMode('list')}
                          className={`h-8 px-3 ${viewMode === 'list' ? 'bg-mansagold/20 text-mansagold' : 'text-gray-400 hover:text-white'}`}
                        >
                          <List className="h-4 w-4" />
                          <span className="ml-2 hidden sm:inline">List</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-slate-800 text-white border-white/10">
                        <p>List View</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    {/* Divider */}
                    <div className="h-6 w-px bg-white/10 mx-1" />
                    
                    {/* Filters toggle */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowFilters(!showFilters)}
                          className={`h-8 px-3 ${showFilters ? 'bg-mansagold/20 text-mansagold' : 'text-gray-400 hover:text-white'}`}
                        >
                          <SlidersHorizontal className="h-4 w-4" />
                          <span className="ml-2 hidden sm:inline">Filters</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-slate-800 text-white border-white/10">
                        <p>Toggle Filters</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              )}
            </div>
            
            <div className="h-px flex-1 mx-6 bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block" />
          </motion.div>
        
          {/* Business Grid/List/Split with Skeleton Loading + Sponsor Sidebar */}
          <div className="flex gap-8">
            <div className="flex-1 min-w-0" data-tour="business-card">
              {isLoading ? (
                <SkeletonGrid count={6} />
              ) : viewMode === 'split' ? (
                <DirectorySplitView
                  businesses={regularBusinesses}
                  mapData={mapData}
                  onSelectBusiness={handleSelectBusiness}
                  isLoading={isLoading}
                  userLocation={location}
                  mapApiKey={mapApiKey}
                />
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

            {/* Sponsor Sidebar - desktop only, all view modes */}
            <SponsorSidebar />
          </div>

          {/* Pagination */}
          {totalPages > 1 && !isLoading && (
            <div className="mt-10">
              <DirectoryPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(newPage) => {
                  setPage(newPage);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )}
          {/* Stats section - only show in grid/list view, not split */}
          {viewMode !== 'split' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-16 pt-12 border-t border-white/10"
            >
              <MultiCityStats selectedCity={selectedCity} />
            </motion.div>
          )}
        </div>
        
        <ScrollToTopButton />
        
        {/* Alphabet Jump Index - visible when not searching and businesses are loaded */}
        {!isLoading && regularBusinesses.length > 0 && !searchTerm && (
          <AlphabetJumpIndex activeLetters={activeLetters} onJumpToLetter={handleJumpToLetter} />
        )}
      </div>
      
      
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
