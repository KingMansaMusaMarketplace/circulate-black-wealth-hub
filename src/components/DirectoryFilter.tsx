
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
  Tag
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { businessCategories } from '@/data/businessData';

export interface FilterOptions {
  category: string;
  distance: number;
  rating: number;
  discount: number;
}

interface DirectoryFilterProps {
  categories: string[];
  filterOptions: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
}

const DirectoryFilter: React.FC<DirectoryFilterProps> = ({ 
  filterOptions, 
  onFilterChange 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Tag size={16} className="text-mansablue" />
            <label className="text-sm font-medium">Category</label>
          </div>
          <Select 
            value={filterOptions.category} 
            onValueChange={(value) => onFilterChange({ category: value })}
          >
            <SelectTrigger className="w-full bg-white border-gray-200">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <SelectItem value="all">All Categories</SelectItem>
              {businessCategories.map((cat) => (
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
            value={[filterOptions.distance]} 
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
              {filterOptions.rating} stars+
            </Badge>
          </div>
          <Slider 
            value={[filterOptions.rating]} 
            min={0} 
            max={5} 
            step={0.5}
            onValueChange={(value) => onFilterChange({ rating: value[0] })}
            className="py-4"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Tag size={16} className="text-mansablue" />
            <label className="text-sm font-medium">Min Discount (%)</label>
            <Badge variant="outline" className="ml-auto text-mansablue">
              {filterOptions.discount}%+
            </Badge>
          </div>
          <Slider 
            value={[filterOptions.discount]} 
            min={0} 
            max={50} 
            step={5}
            onValueChange={(value) => onFilterChange({ discount: value[0] })}
            className="py-4"
          />
        </div>
      </div>
    </div>
  );
};

export default DirectoryFilter;
