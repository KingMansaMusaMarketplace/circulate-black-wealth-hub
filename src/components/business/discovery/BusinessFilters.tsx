import React from 'react';
import { Filter, X, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BusinessFiltersProps {
  selectedCategory: string;
  selectedRating: string;
  priceRange: number[];
  verifiedOnly: boolean;
  onCategoryChange: (category: string) => void;
  onRatingChange: (rating: string) => void;
  onPriceRangeChange: (range: number[]) => void;
  onVerifiedChange: (verified: boolean) => void;
  onClearAll: () => void;
}

const categories = [
  'all',
  'Restaurant',
  'Retail', 
  'Services',
  'Beauty',
  'Technology',
  'Healthcare',
  'Education',
  'Other'
];

export const BusinessFilters: React.FC<BusinessFiltersProps> = ({
  selectedCategory,
  selectedRating,
  priceRange,
  verifiedOnly,
  onCategoryChange,
  onRatingChange,
  onPriceRangeChange,
  onVerifiedChange,
  onClearAll
}) => {
  const hasActiveFilters = 
    selectedCategory !== 'all' || 
    selectedRating !== 'all' || 
    verifiedOnly ||
    priceRange[0] > 0 || 
    priceRange[1] < 1000;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearAll}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div>
          <label className="text-sm font-medium mb-3 block">Category</label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="text-sm font-medium mb-3 block">Minimum Rating</label>
          <Select value={selectedRating} onValueChange={onRatingChange}>
            <SelectTrigger>
              <SelectValue placeholder="Any rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Rating</SelectItem>
              <SelectItem value="4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  4+ Stars
                </div>
              </SelectItem>
              <SelectItem value="3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  3+ Stars
                </div>
              </SelectItem>
              <SelectItem value="2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  2+ Stars
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Verified Only */}
        <div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="verified"
              checked={verifiedOnly}
              onCheckedChange={onVerifiedChange}
            />
            <label 
              htmlFor="verified" 
              className="text-sm font-medium cursor-pointer"
            >
              Verified businesses only
            </label>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Show only businesses that have been verified by our team
          </p>
        </div>

        {/* Price Range - Future feature */}
        <div className="opacity-50">
          <label className="text-sm font-medium mb-3 block">Price Range</label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={onPriceRangeChange}
              max={1000}
              min={0}
              step={50}
              className="mb-2"
              disabled
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}+</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Coming soon: Filter by average price range
          </p>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div>
            <label className="text-sm font-medium mb-2 block">Active Filters</label>
            <div className="flex flex-wrap gap-2">
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {selectedCategory}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => onCategoryChange('all')}
                  />
                </Badge>
              )}
              {selectedRating !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {selectedRating}+ stars
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => onRatingChange('all')}
                  />
                </Badge>
              )}
              {verifiedOnly && (
                <Badge variant="secondary" className="gap-1">
                  Verified only
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => onVerifiedChange(false)}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};