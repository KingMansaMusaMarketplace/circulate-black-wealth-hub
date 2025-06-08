
import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import SmartBusinessRecommendations from '@/components/discovery/SmartBusinessRecommendations';
import CategoryExploration from '@/components/directory/CategoryExploration';
import SmartFiltering from '@/components/directory/SmartFiltering';
import BusinessGridView from '@/components/directory/BusinessGridView';
import BusinessListView from '@/components/directory/BusinessListView';
import MapView from '@/components/MapView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MapPin, Grid3X3, List, TrendingUp } from 'lucide-react';
import { useLocation } from '@/hooks/location/useLocation';
import { useDirectorySearch } from '@/hooks/use-directory-search';
import { businesses } from '@/data/businessData';
import { BusinessFilters } from '@/lib/api/directory/types';

const EnhancedDirectoryPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'recommendations' | 'grid' | 'list' | 'map'>('recommendations');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Location hook
  const { location, getCurrentPosition, loading: locationLoading } = useLocation();
  
  // Directory search hook
  const {
    searchTerm,
    setSearchTerm,
    filterOptions,
    handleFilterChange,
    categories,
    filteredBusinesses,
    mapData
  } = useDirectorySearch(businesses);

  const handleSelectBusiness = (id: number) => {
    const business = filteredBusinesses.find(b => b.id === id);
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
      await getCurrentPosition(true);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  }, [getCurrentPosition]);

  const handleCategorySelect = (category: string) => {
    if (category === 'all') {
      handleFilterChange({ category: undefined });
    } else {
      handleFilterChange({ category });
      setViewMode('grid'); // Switch to grid view when category is selected
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Enhanced Directory | Mansa Musa Marketplace</title>
        <meta name="description" content="Discover Black-owned businesses with AI-powered recommendations and smart filtering" />
      </Helmet>
      
      <Navbar />
      
      {/* Hero Section */}
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
              value={searchTerm || ''}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          </div>
        </div>
      </div>
      
      <div className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto">
          
          {/* Category Exploration */}
          <div className="mb-8">
            <CategoryExploration
              onCategorySelect={handleCategorySelect}
              selectedCategory={filterOptions.category}
            />
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Sidebar Filters */}
            {showAdvancedFilters && (
              <div className="w-full lg:w-1/4">
                <SmartFiltering
                  filters={filterOptions}
                  onFiltersChange={handleFilterChange}
                  userLocation={location}
                />
              </div>
            )}
            
            {/* Main Content */}
            <div className={`w-full ${showAdvancedFilters ? 'lg:w-3/4' : ''}`}>
              
              {/* View Mode Selector */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-gray-700">
                    {filteredBusinesses?.length || 0} businesses found
                    {location && ' near you'}
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
              
              {/* Content Views */}
              <Tabs value={viewMode} onValueChange={(val) => setViewMode(val as any)}>
                <TabsContent value="recommendations" className="mt-0">
                  <div className="space-y-8">
                    <SmartBusinessRecommendations userLocation={location} />
                    <div>
                      <h2 className="text-2xl font-bold text-mansablue mb-4">All Businesses</h2>
                      <BusinessGridView 
                        businesses={filteredBusinesses || []} 
                        onSelectBusiness={handleSelectBusiness} 
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="grid" className="mt-0">
                  <BusinessGridView 
                    businesses={filteredBusinesses || []} 
                    onSelectBusiness={handleSelectBusiness} 
                  />
                </TabsContent>
                
                <TabsContent value="list" className="mt-0">
                  <BusinessListView 
                    businesses={filteredBusinesses || []} 
                    onSelectBusiness={handleSelectBusiness} 
                  />
                </TabsContent>
                
                <TabsContent value="map" className="mt-0">
                  <div className="h-[600px] rounded-lg overflow-hidden">
                    <MapView 
                      businesses={mapData || []} 
                      onSelectBusiness={handleSelectBusiness}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EnhancedDirectoryPage;
