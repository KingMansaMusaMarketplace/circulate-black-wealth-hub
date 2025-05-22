
import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { useLocation } from '@/hooks/location/useLocation';
import { useBusinessDirectory } from '@/hooks/use-business-directory';
import { BusinessFilters } from '@/lib/api/directory/types';

// Import the newly created components
import DirectoryHeader from '@/components/directory/DirectoryHeader';
import DirectoryLoadingState from '@/components/directory/DirectoryLoadingState';
import DirectoryErrorState from '@/components/directory/DirectoryErrorState';
import DirectoryContent from '@/components/directory/DirectoryContent';
import ScrollToTopButton from '@/components/directory/ScrollToTopButton';
import DirectoryRealTimeUpdates from '@/components/directory/DirectoryRealTimeUpdates';

const DirectoryPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOptions, setFilterOptions] = useState<BusinessFilters>({});
  const [page, setPage] = useState(1);
  
  // Fetch user location
  const { location, getCurrentPosition, loading: locationLoading } = useLocation();
  
  // Fetch businesses from Supabase with pagination
  const { 
    businesses, 
    loading, 
    error, 
    categories,
    pagination,
    updateFilters,
    setPage: changePage,
    refetch 
  } = useBusinessDirectory({
    initialFilters: {
      searchTerm: searchTerm,
      ...filterOptions
    },
    initialPage: page,
    pageSize: 16,
    autoFetch: true
  });
  
  // Update search term and filters
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    updateFilters({ searchTerm: term });
  };
  
  const handleFilterChange = (newFilters: Partial<BusinessFilters>) => {
    setFilterOptions(prev => {
      const updated = { ...prev, ...newFilters };
      updateFilters(updated);
      return updated;
    });
  };
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    changePage(newPage);
  };

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
      // Update filters to include location
      updateFilters({ 
        userLat: newLocation.lat, 
        userLng: newLocation.lng,
        distance: 10 // Set a default distance radius of 10 miles
      });
      setShowMap(true); // Show map after getting location
    }
  }, [getCurrentPosition, updateFilters]);

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Business Directory | Mansa Musa Marketplace</title>
        <meta name="description" content="Find and support Black-owned businesses in your community" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DirectoryHeader 
          title="Business Directory"
          description="Discover and support Black-owned businesses in your area. Each scan earns you loyalty points and helps circulate wealth within our community."
        />
        
        {/* Setup real-time updates */}
        <DirectoryRealTimeUpdates onUpdate={refetch} />
        
        {/* Render appropriate content based on loading/error state */}
        {loading ? (
          <DirectoryLoadingState />
        ) : error ? (
          <DirectoryErrorState error={error} />
        ) : (
          <DirectoryContent 
            businesses={businesses}
            loading={loading}
            pagination={pagination}
            searchTerm={searchTerm}
            filterOptions={filterOptions}
            categories={categories}
            viewMode={viewMode}
            showFilters={showFilters}
            showMap={showMap}
            userLocation={location}
            locationLoading={locationLoading}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
            onPageChange={handlePageChange}
            onGetLocation={handleGetLocation}
            onSelectBusiness={handleSelectBusiness}
            setShowFilters={setShowFilters}
            setViewMode={setViewMode}
            setShowMap={setShowMap}
          />
        )}
        
        <ScrollToTopButton />
      </main>
      <Footer />
    </div>
  );
};

export default DirectoryPage;
