
import React from 'react';
import ProductFilters, { SortOption, FilterOption } from './ProductFilters';
import ViewControls from './ViewControls';
import AdvancedFilters, { AdvancedFiltersState } from './AdvancedFilters';

interface GalleryControlsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
  filterBy: FilterOption;
  setFilterBy: (value: FilterOption) => void;
  layoutType: 'grid' | 'list';
  setLayoutType: (type: 'grid' | 'list') => void;
  selectionMode: boolean;
  toggleSelectionMode: () => void;
  onApplyAdvancedFilters?: (filters: AdvancedFiltersState) => void;
  categories: string[];
}

const GalleryControls: React.FC<GalleryControlsProps> = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  filterBy,
  setFilterBy,
  layoutType,
  setLayoutType,
  selectionMode,
  toggleSelectionMode,
  onApplyAdvancedFilters,
  categories = []
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <ProductFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
        />
        
        <ViewControls
          layoutType={layoutType}
          setLayoutType={setLayoutType}
          selectionMode={selectionMode}
          toggleSelectionMode={toggleSelectionMode}
        />
      </div>
      
      {onApplyAdvancedFilters && (
        <div className="flex justify-end">
          <AdvancedFilters 
            onApplyFilters={onApplyAdvancedFilters}
            categories={categories}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
          />
        </div>
      )}
    </div>
  );
};

export default GalleryControls;
