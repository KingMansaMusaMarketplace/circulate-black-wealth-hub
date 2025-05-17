
import React, { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DirectoryFilter from '@/components/DirectoryFilter';
import MapView from '@/components/MapView';
import { businesses } from '@/data/businessData';
import { useDirectorySearch } from '@/hooks/use-directory-search';
import DirectorySearchBar from '@/components/directory/DirectorySearchBar';
import BusinessGridView from '@/components/directory/BusinessGridView';
import BusinessListView from '@/components/directory/BusinessListView';
import DirectoryResultsSummary from '@/components/directory/DirectoryResultsSummary';
import DirectoryPagination from '@/components/directory/DirectoryPagination';
import { toast } from 'sonner';

const DirectoryPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  
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

  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported", {
        description: "Your browser doesn't support geolocation services."
      });
      return;
    }

    toast.loading("Getting your location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        updateUserLocation(latitude, longitude);
        toast.dismiss();
        toast.success("Location found", {
          description: "Showing businesses near your location."
        });
      },
      (error) => {
        toast.dismiss();
        toast.error("Location error", {
          description: "Couldn't access your location. Please check your browser permissions."
        });
        console.error("Geolocation error:", error);
      }
    );
  }, [updateUserLocation]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container-custom py-8">
        <div className="mb-10">
          <h1 className="heading-lg text-mansablue mb-4">Business Directory</h1>
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
            userLocation={userLocation}
            onGetLocation={handleGetLocation}
          />
          
          {/* Map View */}
          <MapView 
            businesses={mapData}
            onSelectBusiness={handleSelectBusiness}
          />
          
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
            nearMeActive={!!userLocation}
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
        {filteredBusinesses.length > 0 && (
          <DirectoryPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.handlePageChange}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default DirectoryPage;
