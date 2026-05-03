
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
      distance: undefined
    });
  };

  const activeFiltersCount = [
    filters.category,
    filters.minRating,
    filters.minDiscount,
    filters.featured,
    filters.distance
  ].filter(Boolean).length;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[85vh] overflow-y-auto bg-slate-900 border-t border-white/10 text-white"
      >
        <SheetHeader className="text-left pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg text-white">Filters</SheetTitle>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-mansagold hover:text-mansagold hover:bg-mansagold/10"
              >
                Clear all ({activeFiltersCount})
              </Button>
            )}
          </div>
          <SheetDescription className="text-slate-400">
            Refine your search to find the perfect businesses
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-4">
          {/* Category Filter */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2 text-white">
              <Award className="h-4 w-4 text-mansagold" />
              Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const active = filters.category === category;
                return (
                  <Badge
                    key={category}
                    variant="outline"
                    className={`cursor-pointer transition-colors ${
                      active
                        ? 'bg-mansagold text-black border-mansagold hover:bg-mansagold/90'
                        : 'bg-transparent text-slate-300 border-white/15 hover:bg-white/5 hover:text-white'
                    }`}
                    onClick={() => onFiltersChange({
                      category: active ? undefined : category
                    })}
                  >
                    {category}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2 text-white">
              <Star className="h-4 w-4 text-mansagold" />
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
              <div className="flex justify-between text-sm text-slate-400">
                <span>Any rating</span>
                <span className="text-mansagold">{filters.minRating || 0}+ stars</span>
              </div>
            </div>
          </div>

          {/* Discount Filter */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2 text-white">
              <Percent className="h-4 w-4 text-mansagold" />
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
              <div className="flex justify-between text-sm text-slate-400">
                <span>Any discount</span>
                <span className="text-mansagold">{filters.minDiscount || 0}%+ off</span>
              </div>
            </div>
          </div>

          {/* Distance Filter */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2 text-white">
              <MapPin className="h-4 w-4 text-mansagold" />
              Maximum Distance
            </h3>
            <div className="space-y-3">
              <Slider
                value={[filters.distance || 25]}
                onValueChange={(value) => onFiltersChange({ distance: value[0] })}
                max={25}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-slate-400">
                <span>1 mile</span>
                <span className="text-mansagold">Within {filters.distance || 25} miles</span>
              </div>
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center justify-between border-t border-white/10 pt-6">
            <div>
              <h3 className="font-medium text-white">Featured Only</h3>
              <p className="text-sm text-slate-400">Show only verified businesses</p>
            </div>
            <Switch
              checked={filters.featured || false}
              onCheckedChange={(checked) => onFiltersChange({ featured: checked || undefined })}
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-slate-900 border-t border-white/10 pt-4 mt-6">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full bg-mansagold text-black hover:bg-mansagold/90 font-semibold"
          >
            Apply Filters
            {activeFiltersCount > 0 && (
              <span className="ml-2 text-xs opacity-80">({activeFiltersCount})</span>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFiltersSheet;
