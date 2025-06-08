
import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import CategoryExploration from '@/components/directory/CategoryExploration';
import MobileCategoryCarousel from '@/components/directory/MobileCategoryCarousel';
import SmartFiltering from '@/components/directory/SmartFiltering';
import MobileFiltersSheet from '@/components/directory/MobileFiltersSheet';
import MobileSearchBar from '@/components/directory/MobileSearchBar';
import DesktopHeroSection from '@/components/directory/DesktopHeroSection';
import DesktopViewModeSelector from '@/components/directory/DesktopViewModeSelector';
import MobileContentRenderer from '@/components/directory/MobileContentRenderer';
import DesktopContentRenderer from '@/components/directory/DesktopContentRenderer';
import PaginationControls from '@/components/directory/PaginationControls';
import { useLocation } from '@/hooks/location/useLocation';
import { useBusinessDirectory } from '@/hooks/use-business-directory';
import { useSearchHistory } from '@/hooks/use-search-history';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { useIsMobile } from '@/hooks/use-mobile';
import { BusinessFilters } from '@/lib/api/directory/types';

const EnhancedDirectoryPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'recommendations' | 'grid' | 'list' | 'map'>('recommendations');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();
  
  // Hooks for personalization
  const { addToSearchHistory } = useSearchHistory();
  const { preferences } = useUserPreferences();
  
  // Location hook
  const { location, getCurrentPosition, loading: locationLoading } = useLocation();
  
  // Business directory hook with real Supabase data
  const {
    businesses,
    loading,
    error,
    categories,
    pagination,
    filters,
    updateFilters,
    setPage,
    refetch
  } = useBusinessDirectory({
    initialFilters: {
      searchTerm: searchTerm,
      userLat: location?.lat,
      userLng: location?.lng,
      // Apply user preferences if available
      distance: preferences?.default_radius,
      category: preferences?.preferred_categories?.[0]
    },
    pageSize: isMobile ? 12 : 16,
    autoFetch: true
  });

  const handleSelectBusiness = (id: number) => {
    const business = businesses.find(b => b.id === id);
    if (business) {
      // Scroll to the business card
      const element = document.getElementById(`business-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-2', 'ring-mansablue');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-mansablue');
        }, 2000);
      }
    }
  };

  const handleGetLocation = useCallback(async () => {
    try {
      const position = await getCurrentPosition(true);
      if (position) {
        updateFilters({
          userLat: position.lat,
          userLng: position.lng
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  }, [getCurrentPosition, updateFilters]);

  const handleCategorySelect = (category: string) => {
    if (category === 'all') {
      updateFilters({ category: undefined });
    } else {
      updateFilters({ category });
      if (isMobile) {
        setViewMode('grid');
      } else {
        setViewMode('grid');
      }
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateFilters({ searchTerm: value });
    
    // Add to search history when user performs a search
    if (value.trim() && value.length > 2) {
      addToSearchHistory(
        value, 
        filters.category, 
        location ? `${location.lat},${location.lng}` : undefined,
        businesses.length
      );
    }
  };

  const handleFilterChange = (newFilters: Partial<BusinessFilters>) => {
    updateFilters(newFilters);
  };

  // Create map data for MapView
  const mapData = businesses.map(b => ({
    id: b.id,
    name: b.name,
    lat: b.lat,
    lng: b.lng,
    category: b.category,
    distanceValue: b.distanceValue,
    distance: b.distance
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Enhanced Directory | Mansa Musa Marketplace</title>
        <meta name="description" content="Discover Black-owned businesses with AI-powered recommendations and smart filtering" />
      </Helmet>
      
      <Navbar />
      
      {/* Desktop Hero Section */}
      {!isMobile && (
        <DesktopHeroSection
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          location={location}
          handleGetLocation={handleGetLocation}
          locationLoading={locationLoading}
          showAdvancedFilters={showAdvancedFilters}
          setShowAdvancedFilters={setShowAdvancedFilters}
          categories={categories}
        />
      )}
      
      {/* Mobile Search Bar */}
      {isMobile && (
        <MobileSearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          showFilters={showMobileFilters}
          toggleFilters={() => setShowMobileFilters(!showMobileFilters)}
          viewMode={viewMode as 'grid' | 'list' | 'map'}
          setViewMode={(mode) => setViewMode(mode)}
          userLocation={location}
          onGetLocation={handleGetLocation}
          locationLoading={locationLoading}
          totalResults={pagination.totalCount}
          categories={categories}
        />
      )}

      {/* Mobile Category Carousel */}
      {isMobile && (
        <MobileCategoryCarousel
          categories={categories}
          selectedCategory={filters.category}
          onCategorySelect={handleCategorySelect}
        />
      )}
      
      <div className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto">
          
          {/* Desktop Category Exploration */}
          {!isMobile && (
            <div className="mb-8">
              <CategoryExploration
                onCategorySelect={handleCategorySelect}
                selectedCategory={filters.category}
              />
            </div>
          )}
          
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Desktop Sidebar Filters */}
            {!isMobile && showAdvancedFilters && (
              <div className="w-full lg:w-1/4">
                <SmartFiltering
                  filters={filters}
                  onFiltersChange={handleFilterChange}
                  userLocation={location}
                />
              </div>
            )}

            {/* Mobile Filters Sheet */}
            {isMobile && (
              <MobileFiltersSheet
                isOpen={showMobileFilters}
                onOpenChange={setShowMobileFilters}
                filters={filters}
                onFiltersChange={handleFilterChange}
                categories={categories}
              >
                <div />
              </MobileFiltersSheet>
            )}
            
            {/* Main Content */}
            <div className={`w-full ${!isMobile && showAdvancedFilters ? 'lg:w-3/4' : ''}`}>
              
              {/* Desktop View Mode Selector */}
              {!isMobile && (
                <DesktopViewModeSelector
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  loading={loading}
                  totalCount={pagination.totalCount}
                  location={location}
                  error={error}
                />
              )}
              
              {/* Content Views */}
              {isMobile ? (
                <MobileContentRenderer
                  viewMode={viewMode}
                  location={location}
                  businesses={businesses}
                  loading={loading}
                  onSelectBusiness={handleSelectBusiness}
                  mapData={mapData}
                />
              ) : (
                <DesktopContentRenderer
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  location={location}
                  businesses={businesses}
                  loading={loading}
                  onSelectBusiness={handleSelectBusiness}
                  mapData={mapData}
                />
              )}

              {/* Pagination */}
              <PaginationControls
                pagination={pagination}
                setPage={setPage}
                isMobile={isMobile}
              />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EnhancedDirectoryPage;
