
import React, { useState } from 'react';
import BusinessGridView from '@/components/directory/BusinessGridView';
import BusinessListView from '@/components/directory/BusinessListView';
import DirectoryResultsSummary from '@/components/directory/DirectoryResultsSummary';
import DirectorySearchBar from '@/components/directory/DirectorySearchBar';
import DirectoryFilter from '@/components/DirectoryFilter';
import DirectoryPagination from '@/components/directory/DirectoryPagination';
import MapView from '@/components/MapView/MapView';
import { BusinessFilters } from '@/lib/api/directory/types';
import { Business } from '@/types/business';
import { LocationData } from '@/hooks/location/types';

interface DirectoryContentProps {
  businesses: Business[];
  loading: boolean;
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
  };
  searchTerm: string;
  filterOptions: BusinessFilters;
  categories: string[];
  viewMode: 'grid' | 'list';
  showFilters: boolean;
  showMap: boolean;
  userLocation: LocationData | null;
  locationLoading: boolean;
  onSearchChange: (term: string) => void;
  onFilterChange: (filters: Partial<BusinessFilters>) => void;
  onPageChange: (page: number) => void;
  onGetLocation: () => void;
  onSelectBusiness: (id: string) => void;
  setShowFilters: (show: boolean) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setShowMap: (show: boolean) => void;
}

const DirectoryContent: React.FC<DirectoryContentProps> = ({
  businesses,
  loading,
  pagination,
  searchTerm,
  filterOptions,
  categories,
  viewMode,
  showFilters,
  showMap,
  userLocation,
  locationLoading,
  onSearchChange,
  onFilterChange,
  onPageChange,
  onGetLocation,
  onSelectBusiness,
  setShowFilters,
  setViewMode,
  setShowMap
}) => {
  // Check if any filters are active
  const isFiltered = 
    searchTerm !== '' || 
    filterOptions.category !== undefined || 
    filterOptions.minRating !== undefined ||
    filterOptions.minDiscount !== undefined ||
    filterOptions.featured !== undefined;
    
  const toggleFilters = () => setShowFilters(!showFilters);

  return (
    <>
      {/* Search and Filter */}
      <div className="mb-8">
        <DirectorySearchBar 
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          showFilters={showFilters}
          toggleFilters={toggleFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
          userLocation={userLocation}
          onGetLocation={onGetLocation}
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
              onSelectBusiness={onSelectBusiness}
            />
          </div>
        )}
        
        {/* Additional filters */}
        {showFilters && (
          <DirectoryFilter
            categories={categories}
            filterOptions={filterOptions}
            onFilterChange={onFilterChange}
          />
        )}
        
        <DirectoryResultsSummary 
          totalResults={pagination.totalCount}
          nearMeActive={!!userLocation}
          searchTerm={searchTerm}
          isFiltered={isFiltered}
        />
      </div>
      
      {/* Businesses Display */}
      {viewMode === 'grid' ? (
        <BusinessGridView 
          businesses={businesses} 
          onSelectBusiness={onSelectBusiness} 
        />
      ) : (
        <BusinessListView 
          businesses={businesses} 
          onSelectBusiness={onSelectBusiness} 
        />
      )}
      
      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8">
          <DirectoryPagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </>
  );
};

export default DirectoryContent;
