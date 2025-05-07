
import React from 'react';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, ArrowUpDown, Search } from "lucide-react";

export type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc';
export type FilterOption = 'all' | 'active' | 'inactive';

interface ProductFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
  filterBy: FilterOption;
  setFilterBy: (value: FilterOption) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  filterBy,
  setFilterBy
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 items-center animate-fade-in">
      <div className="relative w-full md:w-auto flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input 
          placeholder="Search products..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
          aria-label="Search products"
        />
      </div>
      
      <div className="flex gap-2 w-full md:w-auto">
        <div className="w-1/2 md:w-auto">
          <Select 
            value={filterBy} 
            onValueChange={(value: FilterOption) => setFilterBy(value)}
            aria-label="Filter products"
          >
            <SelectTrigger className="w-36">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-1/2 md:w-auto">
          <Select 
            value={sortBy} 
            onValueChange={(value: SortOption) => setSortBy(value)}
            aria-label="Sort products"
          >
            <SelectTrigger className="w-36">
              <div className="flex items-center">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
