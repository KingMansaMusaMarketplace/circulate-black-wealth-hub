
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import DirectoryFilter from '@/components/DirectoryFilter';
import BusinessGridView from '@/components/directory/BusinessGridView';
import BusinessListView from '@/components/directory/BusinessListView';

// Lazy load MapView for better code splitting
const MapView = React.lazy(() => import('@/components/MapView'));
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, ListFilter, Grid3X3, List } from 'lucide-react';
import { businessCategories } from '@/data/businessData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { businesses } from '@/data/businessData';
import { useDirectorySearch } from '@/hooks/use-directory-search';
import { Business } from '@/types/business';
import { BusinessLocation } from '@/components/MapView/types';
import { BusinessFilters } from '@/lib/api/directory/types';

const BusinessDirectoryPage: React.FC = () => {
  const [view, setView] = useState<'grid' | 'list' | 'map'>('grid');
  
  // Use the directory search hook
  const {
    searchTerm,
    setSearchTerm,
    filterOptions,
    handleFilterChange,
    categories,
    filteredBusinesses,
    mapData
  } = useDirectorySearch(businesses);

  // Convert businesses to the format expected by MapView
  const mapViewBusinesses: BusinessLocation[] = mapData;

  const handleSelectBusiness = (id: string) => {
    console.log('Selected business:', id);
    // You can add navigation logic here if needed
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 -z-10"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-purple-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <Helmet>
        <title>Business Directory | Mansa Musa Marketplace</title>
        <meta name="description" content="Browse Black-owned businesses in the Mansa Musa Marketplace directory" />
      </Helmet>
      
      <div className="relative z-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-12 shadow-2xl">
        <div className="container mx-auto text-center relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 animate-fade-in relative z-10">
            Discover Black-Owned Businesses
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-6 relative z-10">
            Support economic circulation by shopping at verified Black-owned businesses in our community
          </p>
          
          <div className="relative max-w-xl mx-auto z-10">
            <Search className="absolute left-3 top-3 h-5 w-5 text-indigo-500" />
            <Input
              type="text" 
              placeholder="Search for businesses, products, or services..."
              className="pl-10 h-12 bg-white/95 backdrop-blur-sm rounded-xl w-full border-2 border-white/50 shadow-2xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-200/50"
              style={{ WebkitTextFillColor: 'inherit', opacity: 1 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="flex-grow relative z-10 py-8">
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
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-4 mb-6 border border-indigo-100">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <div className="flex items-center mb-4 sm:mb-0">
                    <ListFilter className="h-5 w-5 mr-2 text-gray-500" />
                    <span className="text-gray-700">{filteredBusinesses.length} businesses found</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant={view === 'grid' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setView('grid')}
                      className={view === 'grid' 
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : 'border-indigo-300 !text-indigo-700 bg-white hover:bg-indigo-50 hover:border-indigo-400'}
                    >
                      <Grid3X3 className="h-4 w-4 mr-1" />
                      Grid
                    </Button>
                    <Button 
                      variant={view === 'list' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setView('list')}
                      className={view === 'list' 
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : 'border-indigo-300 !text-indigo-700 bg-white hover:bg-indigo-50 hover:border-indigo-400'}
                    >
                      <List className="h-4 w-4 mr-1" />
                      List
                    </Button>
                    <Button 
                      variant={view === 'map' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setView('map')}
                      className={view === 'map' 
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : 'border-indigo-300 !text-indigo-700 bg-white hover:bg-indigo-50 hover:border-indigo-400'}
                    >
                      <MapPin className="h-4 w-4 mr-1" />
                      Map
                    </Button>
                  </div>
                </div>
              </div>
              
              <Tabs value={view} onValueChange={(val) => setView(val as 'grid' | 'list' | 'map')}>
                <TabsContent value="grid" className="mt-0">
                  <BusinessGridView businesses={filteredBusinesses} onSelectBusiness={handleSelectBusiness} />
                </TabsContent>
                <TabsContent value="list" className="mt-0">
                  <BusinessListView businesses={filteredBusinesses} onSelectBusiness={handleSelectBusiness} />
                </TabsContent>
                <TabsContent value="map" className="mt-0">
                  <div className="h-[600px] rounded-lg overflow-hidden">
                    <React.Suspense fallback={
                      <div className="flex items-center justify-center h-full bg-muted">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                          <p className="text-sm text-muted-foreground">Loading map...</p>
                        </div>
                      </div>
                    }>
                      <MapView businesses={mapViewBusinesses} />
                    </React.Suspense>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDirectoryPage;
