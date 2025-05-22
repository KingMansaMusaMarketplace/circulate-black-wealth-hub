
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import DirectoryFilter, { FilterOptions } from '@/components/DirectoryFilter';
import MapView from '@/components/MapView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, ListFilter, Grid3X3, List } from 'lucide-react';
import { businessCategories } from '@/data/businessData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { businesses } from '@/data/businessData';
import { useDirectorySearch } from '@/hooks/use-directory-search';
import { Business } from '@/types/business';
import { BusinessLocation } from '@/components/MapView/types';

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

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Business Directory | Mansa Musa Marketplace</title>
        <meta name="description" content="Browse Black-owned businesses in the Mansa Musa Marketplace directory" />
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
                      variant={view === 'grid' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setView('grid')}
                    >
                      <Grid3X3 className="h-4 w-4 mr-1" />
                      Grid
                    </Button>
                    <Button 
                      variant={view === 'list' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setView('list')}
                    >
                      <List className="h-4 w-4 mr-1" />
                      List
                    </Button>
                    <Button 
                      variant={view === 'map' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setView('map')}
                    >
                      <MapPin className="h-4 w-4 mr-1" />
                      Map
                    </Button>
                  </div>
                </div>
              </div>
              
              <Tabs value={view} onValueChange={(val) => setView(val as 'grid' | 'list' | 'map')}>
                <TabsContent value="grid" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredBusinesses.map(business => (
                      <div key={business.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="font-medium">{business.name}</h3>
                        <p className="text-sm text-gray-500">{business.category}</p>
                        <div className="mt-2 text-xs flex items-center text-gray-600">
                          <MapPin size={12} className="mr-1" />
                          {business.distance}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="list" className="mt-0">
                  <div className="space-y-3">
                    {filteredBusinesses.map(business => (
                      <div key={business.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center">
                        <div>
                          <h3 className="font-medium">{business.name}</h3>
                          <p className="text-sm text-gray-500">{business.category}</p>
                        </div>
                        <div className="ml-auto text-xs flex items-center text-gray-600">
                          <MapPin size={12} className="mr-1" />
                          {business.distance}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="map" className="mt-0">
                  <div className="h-[600px] rounded-lg overflow-hidden">
                    <MapView businesses={mapViewBusinesses} />
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

export default BusinessDirectoryPage;
