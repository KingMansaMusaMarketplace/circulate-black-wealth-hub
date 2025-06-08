
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { BusinessFilters } from '@/lib/api/directory/types';
import { Star, Award, Percent, MapPin } from 'lucide-react';

interface MobileFiltersSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  filters: BusinessFilters;
  onFiltersChange: (filters: Partial<BusinessFilters>) => void;
  categories: string[];
  children: React.ReactNode;
}

const MobileFiltersSheet: React.FC<MobileFiltersSheetProps> = ({
  isOpen,
  onOpenChange,
  filters,
  onFiltersChange,
  categories,
  children
}) => {
  const clearAllFilters = () => {
    onFiltersChange({
      category: undefined,
      minRating: undefined,
      minDiscount: undefined,
      featured: undefined,
      maxDistance: undefined
    });
  };

  const activeFiltersCount = [
    filters.category,
    filters.minRating,
    filters.minDiscount,
    filters.featured,
    filters.maxDistance
  ].filter(Boolean).length;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
        <SheetHeader className="text-left pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg">Filters</SheetTitle>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-mansablue"
              >
                Clear all ({activeFiltersCount})
              </Button>
            )}
          </div>
          <SheetDescription>
            Refine your search to find the perfect businesses
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-4">
          {/* Category Filter */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Award className="h-4 w-4" />
              Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={filters.category === category ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    filters.category === category ? 'bg-mansablue' : ''
                  }`}
                  onClick={() => onFiltersChange({
                    category: filters.category === category ? undefined : category
                  })}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Minimum Rating
            </h3>
            <div className="space-y-3">
              <Slider
                value={[filters.minRating || 0]}
                onValueChange={(value) => onFiltersChange({ minRating: value[0] || undefined })}
                max={5}
                min={0}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>Any rating</span>
                <span>{filters.minRating || 0}+ stars</span>
              </div>
            </div>
          </div>

          {/* Discount Filter */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Percent className="h-4 w-4" />
              Minimum Discount
            </h3>
            <div className="space-y-3">
              <Slider
                value={[filters.minDiscount || 0]}
                onValueChange={(value) => onFiltersChange({ minDiscount: value[0] || undefined })}
                max={50}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>Any discount</span>
                <span>{filters.minDiscount || 0}%+ off</span>
              </div>
            </div>
          </div>

          {/* Distance Filter */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Maximum Distance
            </h3>
            <div className="space-y-3">
              <Slider
                value={[filters.maxDistance || 25]}
                onValueChange={(value) => onFiltersChange({ maxDistance: value[0] })}
                max={25}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>1 mile</span>
                <span>Within {filters.maxDistance || 25} miles</span>
              </div>
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Featured Only</h3>
              <p className="text-sm text-gray-600">Show only verified businesses</p>
            </div>
            <Switch
              checked={filters.featured || false}
              onCheckedChange={(checked) => onFiltersChange({ featured: checked || undefined })}
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t pt-4 mt-6">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full bg-mansablue hover:bg-mansablue-dark"
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFiltersSheet;
