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
  ListFilter
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
  // Use the comprehensive business categories instead of the passed categories
  const allCategories = businessCategories.map(cat => cat.name).sort();

  return (
    <div className="bg-gradient-to-br from-white via-indigo-50 to-purple-50 rounded-xl shadow-xl border-2 border-indigo-200/50 p-6 mb-4 space-y-6 backdrop-blur-sm">
      <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
        <ListFilter className="h-5 w-5 text-indigo-600" />
        Filter Businesses
      </h3>
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
            <Tag size={16} className="text-indigo-600" />
            <label className="text-sm font-semibold text-gray-700">Category</label>
          </div>
          <Select 
            value={filterOptions.category || 'all'} 
            onValueChange={(value) => onFilterChange({ category: value === 'all' ? undefined : value })}
          >
            <SelectTrigger className="w-full bg-white/80 border-indigo-200 hover:border-indigo-300 transition-colors">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-green-600" />
            <label className="text-sm font-semibold text-gray-700">Distance (miles)</label>
            <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 border-green-300">
              {filterOptions.distance === 0 ? 'Any' : `< ${filterOptions.distance}`}
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
            <Star size={16} className="text-yellow-600" />
            <label className="text-sm font-semibold text-gray-700">Min Rating</label>
            <Badge variant="outline" className="ml-auto bg-yellow-50 text-yellow-700 border-yellow-300">
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
            <Tag size={16} className="text-orange-600" />
            <label className="text-sm font-semibold text-gray-700">Min Discount (%)</label>
            <Badge variant="outline" className="ml-auto bg-orange-50 text-orange-700 border-orange-300">
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
        
        <div className="pt-4 border-t-2 border-indigo-100">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
            <Switch 
              id="featured-only" 
              checked={filterOptions.featured || false}
              onCheckedChange={(checked) => onFilterChange({ featured: checked })}
            />
            <Label htmlFor="featured-only" className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
              <CheckCircle size={18} className="text-orange-500" />
              <span>Featured businesses only</span>
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectoryFilter;
