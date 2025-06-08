
import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import SmartBusinessRecommendations from '@/components/discovery/SmartBusinessRecommendations';
import CategoryExploration from '@/components/directory/CategoryExploration';
import MobileCategoryCarousel from '@/components/directory/MobileCategoryCarousel';
import SmartFiltering from '@/components/directory/SmartFiltering';
import MobileFiltersSheet from '@/components/directory/MobileFiltersSheet';
import BusinessGridView from '@/components/directory/BusinessGridView';
import BusinessListView from '@/components/directory/BusinessListView';
import MobileBusinessCard from '@/components/directory/MobileBusinessCard';
import MobileSearchBar from '@/components/directory/MobileSearchBar';
import UserPreferencesDialog from '@/components/directory/UserPreferencesDialog';
import MapView from '@/components/MapView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MapPin, Grid3X3, List, TrendingUp, Filter, Settings } from 'lucide-react';
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

  // Mobile Business List Component
  const MobileBusinessList = () => (
    <div className="space-y-3 px-4">
      {businesses.map((business) => (
        <MobileBusinessCard
          key={business.id}
          {...business}
          onSelect={() => handleSelectBusiness(business.id)}
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Enhanced Directory | Mansa Musa Marketplace</title>
        <meta name="description" content="Discover Black-owned businesses with AI-powered recommendations and smart filtering" />
      </Helmet>
      
      <Navbar />
      
      {/* Desktop Hero Section */}
      {!isMobile && (
        <div className="bg-gradient-to-r from-mansablue to-mansablue-dark py-12">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Discover Amazing Black-Owned Businesses
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg">
              Powered by AI recommendations, smart filtering, and real-time location data
            </p>
            
            <div className="relative max-w-xl mx-auto mb-6">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <Input
                type="text" 
                placeholder="Search businesses, categories, or locations..."
                className="pl-10 h-12 bg-white rounded-lg w-full text-lg"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            
            <div className="flex justify-center gap-4">
              <Button
                variant="secondary"
                onClick={handleGetLocation}
                disabled={locationLoading}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <MapPin className="h-4 w-4 mr-2" />
                {location ? 'Update Location' : 'Find Near Me'}
              </Button>
              
              <Button
                variant="secondary"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Smart Filters
              </Button>

              <UserPreferencesDialog categories={categories}>
                <Button
                  variant="secondary"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Preferences
                </Button>
              </UserPreferencesDialog>
            </div>
          </div>
        </div>
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
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-gray-700">
                      {loading ? 'Loading...' : `${pagination.totalCount} businesses found`}
                      {location && ' near you'}
                      {error && <span className="text-red-500 ml-2">Error loading data</span>}
                    </div>
                    
                    <Tabs value={viewMode} onValueChange={(val) => setViewMode(val as any)}>
                      <TabsList>
                        <TabsTrigger value="recommendations">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          AI Picks
                        </TabsTrigger>
                        <TabsTrigger value="grid">
                          <Grid3X3 className="h-4 w-4 mr-1" />
                          Grid
                        </TabsTrigger>
                        <TabsTrigger value="list">
                          <List className="h-4 w-4 mr-1" />
                          List
                        </TabsTrigger>
                        <TabsTrigger value="map">
                          <MapPin className="h-4 w-4 mr-1" />
                          Map
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              )}
              
              {/* Content Views */}
              {isMobile ? (
                // Mobile Content
                <div className="space-y-4">
                  {viewMode === 'recommendations' && (
                    <div className="px-4">
                      <SmartBusinessRecommendations userLocation={location} />
                    </div>
                  )}
                  
                  {viewMode === 'map' && (
                    <div className="h-[60vh] mx-4 rounded-lg overflow-hidden">
                      <MapView 
                        businesses={mapData} 
                        onSelectBusiness={handleSelectBusiness}
                      />
                    </div>
                  )}
                  
                  {(viewMode === 'grid' || viewMode === 'list') && (
                    <>
                      {loading ? (
                        <div className="text-center py-8">Loading businesses...</div>
                      ) : (
                        <MobileBusinessList />
                      )}
                    </>
                  )}
                </div>
              ) : (
                // Desktop Content
                <Tabs value={viewMode} onValueChange={(val) => setViewMode(val as any)}>
                  <TabsContent value="recommendations" className="mt-0">
                    <div className="space-y-8">
                      <SmartBusinessRecommendations userLocation={location} />
                      <div>
                        <h2 className="text-2xl font-bold text-mansablue mb-4">All Businesses</h2>
                        {loading ? (
                          <div className="text-center py-8">Loading businesses...</div>
                        ) : (
                          <BusinessGridView 
                            businesses={businesses} 
                            onSelectBusiness={handleSelectBusiness} 
                          />
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="grid" className="mt-0">
                    {loading ? (
                      <div className="text-center py-8">Loading businesses...</div>
                    ) : (
                      <BusinessGridView 
                        businesses={businesses} 
                        onSelectBusiness={handleSelectBusiness} 
                      />
                    )}
                  </TabsContent>
                  
                  <TabsContent value="list" className="mt-0">
                    {loading ? (
                      <div className="text-center py-8">Loading businesses...</div>
                    ) : (
                      <BusinessListView 
                        businesses={businesses} 
                        onSelectBusiness={handleSelectBusiness} 
                      />
                    )}
                  </TabsContent>
                  
                  <TabsContent value="map" className="mt-0">
                    <div className="h-[600px] rounded-lg overflow-hidden">
                      <MapView 
                        businesses={mapData} 
                        onSelectBusiness={handleSelectBusiness}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8 px-4">
                  <div className="flex gap-2">
                    {pagination.page > 1 && (
                      <Button
                        variant="outline"
                        onClick={() => setPage(pagination.page - 1)}
                        size={isMobile ? "sm" : "default"}
                      >
                        Previous
                      </Button>
                    )}
                    
                    <span className="flex items-center px-4 text-sm">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    
                    {pagination.page < pagination.totalPages && (
                      <Button
                        variant="outline"
                        onClick={() => setPage(pagination.page + 1)}
                        size={isMobile ? "sm" : "default"}
                      >
                        Next
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EnhancedDirectoryPage;
