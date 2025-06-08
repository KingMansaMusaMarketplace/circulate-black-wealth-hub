
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MapPin, Star, Percent, Verified, Clock, TrendingUp } from 'lucide-react';
import { BusinessFilters } from '@/lib/api/directory/types';

interface SmartFilteringProps {
  filters: BusinessFilters;
  onFiltersChange: (filters: Partial<BusinessFilters>) => void;
  userLocation?: { lat: number; lng: number } | null;
  className?: string;
}

const SmartFiltering: React.FC<SmartFilteringProps> = ({
  filters,
  onFiltersChange,
  userLocation,
  className = ''
}) => {
  const [smartFiltersEnabled, setSmartFiltersEnabled] = useState(false);

  const handleDistanceChange = (value: number[]) => {
    onFiltersChange({ distance: value[0] });
  };

  const handleRatingChange = (value: number[]) => {
    onFiltersChange({ minRating: value[0] });
  };

  const handleDiscountChange = (value: number[]) => {
    onFiltersChange({ minDiscount: value[0] });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      distance: 0,
      minRating: 0,
      minDiscount: 0,
      featured: undefined
    });
  };

  const applySmartFilters = () => {
    // AI-powered smart filtering suggestions
    const suggestions = {
      distance: userLocation ? 5 : 0, // 5 mile radius if location available
      minRating: 4.5, // Only highly rated
      minDiscount: 10, // At least 10% discount
      featured: true // Prefer verified businesses
    };
    
    onFiltersChange(suggestions);
    setSmartFiltersEnabled(true);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.distance && filters.distance > 0) count++;
    if (filters.minRating && filters.minRating > 0) count++;
    if (filters.minDiscount && filters.minDiscount > 0) count++;
    if (filters.featured) count++;
    return count;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-mansagold" />
            Smart Filters
          </div>
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary">
              {getActiveFiltersCount()} active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Smart Filters Toggle */}
        <div className="flex items-center justify-between p-3 bg-mansablue/5 rounded-lg">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-mansablue" />
            <Label htmlFor="smart-filters" className="text-sm font-medium">
              AI-Powered Filtering
            </Label>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={applySmartFilters}
            className="text-mansablue border-mansablue hover:bg-mansablue hover:text-white"
          >
            Apply Smart Filters
          </Button>
        </div>

        {/* Distance Filter */}
        {userLocation && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <Label className="text-sm font-medium">
                Distance: {filters.distance || 0} miles
              </Label>
            </div>
            <Slider
              value={[filters.distance || 0]}
              onValueChange={handleDistanceChange}
              max={25}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Any distance</span>
              <span>25 miles</span>
            </div>
          </div>
        )}

        {/* Rating Filter */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-mansagold" />
            <Label className="text-sm font-medium">
              Minimum Rating: {filters.minRating || 0} stars
            </Label>
          </div>
          <Slider
            value={[filters.minRating || 0]}
            onValueChange={handleRatingChange}
            max={5}
            min={0}
            step={0.5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Any rating</span>
            <span>5 stars</span>
          </div>
        </div>

        {/* Discount Filter */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Percent className="h-4 w-4 text-green-600" />
            <Label className="text-sm font-medium">
              Minimum Discount: {filters.minDiscount || 0}%
            </Label>
          </div>
          <Slider
            value={[filters.minDiscount || 0]}
            onValueChange={handleDiscountChange}
            max={50}
            min={0}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Any discount</span>
            <span>50%</span>
          </div>
        </div>

        {/* Featured/Verified Filter */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center space-x-2">
            <Verified className="h-4 w-4 text-mansablue" />
            <Label htmlFor="featured" className="text-sm font-medium">
              Verified businesses only
            </Label>
          </div>
          <Switch
            id="featured"
            checked={filters.featured || false}
            onCheckedChange={(checked) => onFiltersChange({ featured: checked })}
          />
        </div>

        {/* Clear Filters */}
        {getActiveFiltersCount() > 0 && (
          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="w-full"
          >
            Clear All Filters
          </Button>
        )}

        {/* Filter Summary */}
        {getActiveFiltersCount() > 0 && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Active Filters:</h4>
            <div className="flex flex-wrap gap-1">
              {filters.distance && filters.distance > 0 && (
                <Badge variant="secondary" className="text-xs">
                  Within {filters.distance} miles
                </Badge>
              )}
              {filters.minRating && filters.minRating > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {filters.minRating}+ stars
                </Badge>
              )}
              {filters.minDiscount && filters.minDiscount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {filters.minDiscount}+ discount
                </Badge>
              )}
              {filters.featured && (
                <Badge variant="secondary" className="text-xs">
                  Verified only
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartFiltering;
