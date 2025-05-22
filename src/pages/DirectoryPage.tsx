
import React, { useState, useCallback, useEffect } from 'react';
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
import { AlertCircle, ArrowUp } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { BusinessFilters } from '@/lib/api/directory-api';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const DirectoryPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOptions, setFilterOptions] = useState<BusinessFilters>({});
  const [page, setPage] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const { toast } = useToast();
  
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
  
  // Listen for scroll events to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Set up real-time updates for business ratings
  useEffect(() => {
    // Subscribe to changes in the businesses table
    const channel = supabase
      .channel('business-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'businesses' },
        (payload) => {
          console.log('Business updated:', payload);
          // Refresh the businesses list to get the latest data
          refetch();
          // Show toast notification
          toast({
            title: "Directory updated",
            description: "Business information has been updated",
          });
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch, toast]);
  
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
      updateFilters({ userLat: newLocation.lat, userLng: newLocation.lng });
      setShowMap(true); // Show map after getting location
    }
  }, [getCurrentPosition, updateFilters]);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            onSearchChange={handleSearchChange}
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
                businesses={businesses.map(b => ({
                  id: b.id,
                  name: b.name,
                  lat: b.lat,
                  lng: b.lng,
                  category: b.category,
                  distanceValue: b.distanceValue,
                  distance: b.distance
                }))}
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
            totalResults={pagination.totalCount}
            nearMeActive={!!location}
          />
        </div>
        
        {/* Businesses Display */}
        {viewMode === 'grid' ? (
          <BusinessGridView 
            businesses={businesses} 
            onSelectBusiness={handleSelectBusiness} 
          />
        ) : (
          <BusinessListView 
            businesses={businesses} 
            onSelectBusiness={handleSelectBusiness} 
          />
        )}
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8">
            <DirectoryPagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
        
        {/* Scroll to top button */}
        {showScrollTop && (
          <Button 
            className="fixed bottom-6 right-6 rounded-full shadow-lg bg-mansablue hover:bg-mansablue/90 h-12 w-12"
            onClick={scrollToTop}
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default DirectoryPage;
