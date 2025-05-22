
import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import DirectoryFilter from '@/components/DirectoryFilter';
import MapView from '@/components/MapView/MapView';
import { businesses } from '@/data/businessData';
import { useDirectorySearch } from '@/hooks/use-directory-search';
import DirectorySearchBar from '@/components/directory/DirectorySearchBar';
import BusinessGridView from '@/components/directory/BusinessGridView';
import BusinessListView from '@/components/directory/BusinessListView';
import DirectoryResultsSummary from '@/components/directory/DirectoryResultsSummary';
import DirectoryPagination from '@/components/directory/DirectoryPagination';
import { useLocation } from '@/hooks/location/useLocation';

const DirectoryPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  
  const { location, getCurrentPosition, loading: locationLoading } = useLocation();
  
  const {
    searchTerm,
    setSearchTerm,
    filterOptions,
    handleFilterChange,
    categories,
    filteredBusinesses,
    paginatedBusinesses,
    mapData,
    pagination,
    updateUserLocation
  } = useDirectorySearch(businesses);
  
  const handleSelectBusiness = (id: number) => {
    const business = businesses.find(b => b.id === id);
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
      updateUserLocation(newLocation.lat, newLocation.lng);
      setShowMap(true); // Show map after getting location
    }
  }, [getCurrentPosition, updateUserLocation]);

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Business Directory | Mansa Musa Marketplace</title>
        <meta name="description" content="Find and support Black-owned businesses in your community" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-mansablue mb-4">Business Directory</h1>
          <p className="text-gray-600 max-w-2xl">
            Discover and support Black-owned businesses in your area. Each scan earns you loyalty points and helps
            circulate wealth within our community.
          </p>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-8">
          <DirectorySearchBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            showFilters={showFilters}
            toggleFilters={() => setShowFilters(!showFilters)}
            viewMode={viewMode}
            setViewMode={setViewMode}
            userLocation={location}
            onGetLocation={handleGetLocation}
            locationLoading={locationLoading}
          />
          
          {/* Map View */}
          {showMap && (
            <div className="mb-6">
              <MapView 
                businesses={mapData}
                onSelectBusiness={handleSelectBusiness}
              />
            </div>
          )}
          
          {/* Additional filters */}
          {showFilters && (
            <DirectoryFilter
              categories={categories}
              filterOptions={filterOptions}
              onFilterChange={handleFilterChange}
            />
          )}
          
          <DirectoryResultsSummary 
            totalResults={filteredBusinesses.length}
            nearMeActive={!!location}
          />
        </div>
        
        {/* Businesses Display */}
        {viewMode === 'grid' ? (
          <BusinessGridView 
            businesses={paginatedBusinesses} 
            onSelectBusiness={handleSelectBusiness} 
          />
        ) : (
          <BusinessListView 
            businesses={paginatedBusinesses} 
            onSelectBusiness={handleSelectBusiness} 
          />
        )}
        
        {/* Pagination */}
        {filteredBusinesses.length > 0 && pagination.totalPages > 1 && (
          <div className="mt-8">
            <DirectoryPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={pagination.handlePageChange}
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default DirectoryPage;
