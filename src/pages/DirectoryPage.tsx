
import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import DirectoryFilter from '@/components/DirectoryFilter';
import MapView from '@/components/MapView/MapView';
import { useDirectorySearch } from '@/hooks/use-directory-search';
import DirectorySearchBar from '@/components/directory/DirectorySearchBar';
import BusinessGridView from '@/components/directory/BusinessGridView';
import BusinessListView from '@/components/directory/BusinessListView';
import DirectoryResultsSummary from '@/components/directory/DirectoryResultsSummary';
import DirectoryPagination from '@/components/directory/DirectoryPagination';
import { useLocation } from '@/hooks/location/useLocation';
import { useBusinessDirectory } from '@/hooks/use-business-directory';
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DirectoryPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  
  // Fetch user location
  const { location, getCurrentPosition, loading: locationLoading } = useLocation();
  
  // Fetch businesses from Supabase
  const { businesses, loading, error } = useBusinessDirectory();
  
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

  // Render loading state
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-10">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-4 w-full max-w-2xl mb-2" />
            <Skeleton className="h-4 w-full max-w-xl" />
          </div>
          
          <div className="mb-8">
            <Skeleton className="h-14 w-full mb-6 rounded-lg" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="border rounded-xl overflow-hidden">
                <Skeleton className="h-36 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-3" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-mansablue mb-4">Business Directory</h1>
          </div>
          
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}. Please try refreshing the page or contact support if the problem persists.
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

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
