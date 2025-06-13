
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
  CheckCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BusinessFilters } from '@/lib/api/directory/types';
import { businessCategories } from '@/data/businessCategories';

// Export the interface for use in other components
export interface DirectoryFilterProps {
  categories: string[];
  filterOptions: BusinessFilters;
  onFilterChange: (filters: Partial<BusinessFilters>) => void;
}

const DirectoryFilter: React.FC<DirectoryFilterProps> = ({ 
  categories,
  filterOptions, 
  onFilterChange 
}) => {
  // Use the comprehensive business categories instead of the passed categories
  const allCategories = businessCategories.map(cat => cat.name).sort();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4 space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Tag size={16} className="text-mansablue" />
            <label className="text-sm font-medium">Category</label>
          </div>
          <Select 
            value={filterOptions.category || 'all'} 
            onValueChange={(value) => onFilterChange({ category: value === 'all' ? undefined : value })}
          >
            <SelectTrigger className="w-full bg-white border-gray-200">
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
            <MapPin size={16} className="text-mansablue" />
            <label className="text-sm font-medium">Distance (miles)</label>
            <Badge variant="outline" className="ml-auto text-mansablue">
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
            <Star size={16} className="text-mansablue" />
            <label className="text-sm font-medium">Min Rating</label>
            <Badge variant="outline" className="ml-auto text-mansablue">
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
            <Tag size={16} className="text-mansablue" />
            <label className="text-sm font-medium">Min Discount (%)</label>
            <Badge variant="outline" className="ml-auto text-mansablue">
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
        
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <Switch 
              id="featured-only" 
              checked={filterOptions.featured || false}
              onCheckedChange={(checked) => onFilterChange({ featured: checked })}
            />
            <Label htmlFor="featured-only" className="flex items-center gap-2 cursor-pointer">
              <CheckCircle size={16} className="text-mansagold" />
              <span>Featured businesses only</span>
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectoryFilter;
