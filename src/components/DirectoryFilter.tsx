import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  MapPin, 
  Star,
  Tag,
  CheckCircle,
  ListFilter,
  RotateCcw
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BusinessFilters } from '@/lib/api/directory/types';
import { businessCategories } from '@/data/categories';
import CitySelector from './directory/CitySelector';

// Export the interface for use in other components
export interface DirectoryFilterProps {
  categories: string[];
  filterOptions: BusinessFilters;
  onFilterChange: (filters: Partial<BusinessFilters>) => void;
  selectedCity?: string;
  onCityChange?: (cityId: string) => void;
  showCitySelector?: boolean;
}

const DirectoryFilter: React.FC<DirectoryFilterProps> = ({ 
  categories,
  filterOptions, 
  onFilterChange,
  selectedCity = 'all',
  onCityChange,
  showCitySelector = true
}) => {
  const allCategories = businessCategories.map(cat => cat.name).sort();

  const activeCount =
    (filterOptions.category ? 1 : 0) +
    ((filterOptions.distance || 0) > 0 ? 1 : 0) +
    ((filterOptions.minRating || 0) > 0 ? 1 : 0) +
    ((filterOptions.minDiscount || 0) > 0 ? 1 : 0) +
    (filterOptions.featured ? 1 : 0);

  const handleReset = () => {
    onFilterChange({
      category: undefined,
      distance: 0,
      minRating: 0,
      minDiscount: 0,
      featured: false,
    });
  };

  return (
    <div className="bg-slate-900/80 rounded-xl shadow-lg border border-white/10 backdrop-blur-md p-6 mb-4 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <ListFilter className="h-5 w-5 text-mansagold" />
          Filter Businesses
          {activeCount > 0 && (
            <Badge className="bg-mansagold/20 text-mansagold border border-mansagold/40 ml-1">
              {activeCount} active
            </Badge>
          )}
        </h3>
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-gray-300 hover:text-mansagold hover:bg-white/5"
          >
            <RotateCcw className="h-4 w-4 mr-1.5" />
            Reset
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {showCitySelector && onCityChange && (
          <CitySelector 
            selectedCity={selectedCity}
            onCityChange={onCityChange}
            showBusinessCount={true}
          />
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Tag size={16} className="text-mansagold" />
            <label className="text-sm font-medium text-gray-200">Category</label>
          </div>
          <Select 
            value={filterOptions.category || 'all'} 
            onValueChange={(value) => onFilterChange({ category: value === 'all' ? undefined : value })}
          >
            <SelectTrigger className="w-full bg-slate-800/70 border-white/10 text-white hover:border-mansagold/40 transition-colors">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="max-h-80 bg-slate-900 border-white/10 text-white">
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-mansagold" />
            <label className="text-sm font-medium text-gray-200">Distance (miles)</label>
            <Badge variant="outline" className="ml-auto bg-mansagold/10 text-mansagold border-mansagold/30">
              {filterOptions.distance === 0 ? 'Any' : `< ${filterOptions.distance} mi`}
            </Badge>
          </div>
          <Slider 
            value={[filterOptions.distance || 0]} 
            min={0} 
            max={10} 
            step={0.5}
            onValueChange={(value) => onFilterChange({ distance: value[0] })}
            className="py-4"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-mansagold" />
            <label className="text-sm font-medium text-gray-200">Min Rating</label>
            <Badge variant="outline" className="ml-auto bg-mansagold/10 text-mansagold border-mansagold/30">
              {filterOptions.minRating || 0} stars+
            </Badge>
          </div>
          <Slider 
            value={[filterOptions.minRating || 0]} 
            min={0} 
            max={5} 
            step={0.5}
            onValueChange={(value) => onFilterChange({ minRating: value[0] })}
            className="py-4"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Tag size={16} className="text-mansagold" />
            <label className="text-sm font-medium text-gray-200">Min Discount (%)</label>
            <Badge variant="outline" className="ml-auto bg-mansagold/10 text-mansagold border-mansagold/30">
              {filterOptions.minDiscount || 0}%+
            </Badge>
          </div>
          <Slider 
            value={[filterOptions.minDiscount || 0]} 
            min={0} 
            max={50} 
            step={5}
            onValueChange={(value) => onFilterChange({ minDiscount: value[0] })}
            className="py-4"
          />
        </div>
        
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-mansagold/5 border border-mansagold/20">
            <Switch 
              id="featured-only" 
              checked={filterOptions.featured || false}
              onCheckedChange={(checked) => onFilterChange({ featured: checked })}
            />
            <Label htmlFor="featured-only" className="flex items-center gap-2 cursor-pointer font-medium text-gray-200">
              <CheckCircle size={18} className="text-mansagold" />
              <span>Featured businesses only</span>
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectoryFilter;
