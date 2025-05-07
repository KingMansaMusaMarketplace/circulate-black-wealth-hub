
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, X } from "lucide-react";
import { FilterOption } from './ProductFilters';

interface PriceRange {
  min: number;
  max: number;
}

interface DateRange {
  from: string;
  to: string;
}

interface AdvancedFiltersProps {
  onApplyFilters: (filters: AdvancedFiltersState) => void;
  categories: string[];
  filterBy: FilterOption;
  setFilterBy: (value: FilterOption) => void;
}

export interface AdvancedFiltersState {
  category: string;
  hasTag: string;
  priceRange: PriceRange;
  dateAdded: DateRange;
  optimizationLevel: number;
}

const defaultFilters: AdvancedFiltersState = {
  category: '',
  hasTag: '',
  priceRange: { min: 0, max: 1000 },
  dateAdded: { from: '', to: '' },
  optimizationLevel: 0
};

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ 
  onApplyFilters, 
  categories, 
  filterBy, 
  setFilterBy 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<AdvancedFiltersState>(defaultFilters);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  const handleFilterChange = (key: keyof AdvancedFiltersState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    onApplyFilters(filters);
    setIsOpen(false);
    
    // Count active filters
    let count = 0;
    if (filters.category) count++;
    if (filters.hasTag) count++;
    if (filters.priceRange.min > 0 || filters.priceRange.max < 1000) count++;
    if (filters.dateAdded.from || filters.dateAdded.to) count++;
    if (filters.optimizationLevel > 0) count++;
    
    setActiveFilterCount(count);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    onApplyFilters(defaultFilters);
    setActiveFilterCount(0);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Advanced Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Advanced Filters</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2" 
              onClick={resetFilters}
            >
              <X className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
          
          {/* Status Filter */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select 
              value={filterBy} 
              onValueChange={(value: FilterOption) => setFilterBy(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Products" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Category Filter */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select 
              value={filters.category}
              onValueChange={(value) => handleFilterChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Tag Filter */}
          <div className="space-y-2">
            <Label>Has Tag</Label>
            <Input 
              placeholder="Enter tag" 
              value={filters.hasTag}
              onChange={(e) => handleFilterChange('hasTag', e.target.value)}
            />
          </div>
          
          {/* Price Range */}
          <div className="space-y-2">
            <Label>Price Range</Label>
            <div className="flex space-x-2">
              <Input 
                type="number" 
                placeholder="Min"
                className="w-1/2"
                value={filters.priceRange.min}
                onChange={(e) => handleFilterChange('priceRange', {
                  ...filters.priceRange,
                  min: parseInt(e.target.value) || 0
                })}
              />
              <Input 
                type="number" 
                placeholder="Max"
                className="w-1/2"
                value={filters.priceRange.max}
                onChange={(e) => handleFilterChange('priceRange', {
                  ...filters.priceRange,
                  max: parseInt(e.target.value) || 0
                })}
              />
            </div>
          </div>
          
          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Added</Label>
            <div className="flex space-x-2">
              <Input 
                type="date" 
                className="w-1/2"
                value={filters.dateAdded.from}
                onChange={(e) => handleFilterChange('dateAdded', {
                  ...filters.dateAdded,
                  from: e.target.value
                })}
              />
              <Input 
                type="date" 
                className="w-1/2"
                value={filters.dateAdded.to}
                onChange={(e) => handleFilterChange('dateAdded', {
                  ...filters.dateAdded,
                  to: e.target.value
                })}
              />
            </div>
          </div>
          
          <Button className="w-full" onClick={applyFilters}>
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AdvancedFilters;
