
import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { useLocation } from '@/hooks/location/useLocation';
import { businesses } from '@/data/businessData';
import { BusinessFilters } from '@/lib/api/directory/types';
import { useDirectorySearch } from '@/hooks/use-directory-search';

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
import MapView from '@/components/MapView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DirectoryPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  
  // Fetch user location
  const { location, getCurrentPosition, loading: locationLoading } = useLocation();
  
  // Use the directory search hook with the business data that includes images
  const {
    searchTerm,
    setSearchTerm,
    filterOptions,
    handleFilterChange,
    categories,
    filteredBusinesses,
    mapData
  } = useDirectorySearch(businesses);

  console.log('DirectoryPage - businesses data:', businesses.length);
  console.log('DirectoryPage - filteredBusinesses:', filteredBusinesses.length);
  console.log('DirectoryPage - sample business with image:', filteredBusinesses[0]);

  const handleSelectBusiness = (id: number) => {
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
    const newLocation = await getCurrentPosition(true);
    if (newLocation) {
      setShowMap(true); // Show map after getting location
    }
  }, [getCurrentPosition]);

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Business Directory | Mansa Musa Marketplace</title>
        <meta name="description" content="Find and support Black-owned businesses in your community" />
      </Helmet>
      
      <Navbar />
      
      <div className="bg-mansablue py-8">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Discover Black-Owned Businesses</h1>
          <p className="text-white/80 max-w-2xl mx-auto mb-6">
            Support economic circulation by shopping at verified Black-owned businesses in our community
          </p>
          
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <Input
              type="text" 
              placeholder="Search for businesses, products, or services..."
              className="pl-10 h-12 bg-white rounded-lg w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            {/* Sidebar Filters */}
            <div className="w-full md:w-1/4">
              <DirectoryFilter 
                categories={categories}
                filterOptions={filterOptions}
                onFilterChange={handleFilterChange}
              />
            </div>
            
            {/* Main Content */}
            <div className="w-full md:w-3/4">
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <div className="flex items-center mb-4 sm:mb-0">
                    <ListFilter className="h-5 w-5 mr-2 text-gray-500" />
                    <span className="text-gray-700">{filteredBusinesses.length} businesses found</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant={viewMode === 'grid' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3X3 className="h-4 w-4 mr-1" />
                      Grid
                    </Button>
                    <Button 
                      variant={viewMode === 'list' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4 mr-1" />
                      List
                    </Button>
                    <Button 
                      variant={viewMode === 'map' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setViewMode('map')}
                    >
                      <MapPin className="h-4 w-4 mr-1" />
                      Map
                    </Button>
                  </div>
                </div>
              </div>
              
              <Tabs value={viewMode} onValueChange={(val) => setViewMode(val as 'grid' | 'list' | 'map')}>
                <TabsContent value="grid" className="mt-0">
                  <BusinessGridView businesses={filteredBusinesses} onSelectBusiness={handleSelectBusiness} />
                </TabsContent>
                <TabsContent value="list" className="mt-0">
                  <BusinessListView businesses={filteredBusinesses} onSelectBusiness={handleSelectBusiness} />
                </TabsContent>
                <TabsContent value="map" className="mt-0">
                  <div className="h-[600px] rounded-lg overflow-hidden">
                    <MapView businesses={mapData} />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      
      <ScrollToTopButton />
      <Footer />
    </div>
  );
};

export default DirectoryPage;
