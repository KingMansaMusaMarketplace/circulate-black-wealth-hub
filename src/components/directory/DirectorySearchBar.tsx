
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Sliders, LayoutGrid, List } from 'lucide-react';

interface DirectorySearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showFilters: boolean;
  toggleFilters: () => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

const DirectorySearchBar: React.FC<DirectorySearchBarProps> = ({
  searchTerm,
  onSearchChange,
  showFilters,
  toggleFilters,
  viewMode,
  setViewMode
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          placeholder="Search businesses by name, category, or location" 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          onClick={toggleFilters}
          className="flex items-center gap-2"
        >
          <Sliders size={16} />
          Filters
          {showFilters && <Badge variant="outline" className="ml-1">On</Badge>}
        </Button>
        
        <div className="border rounded-md flex">
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'ghost'} 
            size="icon"
            onClick={() => setViewMode('grid')} 
            className="rounded-r-none border-r"
          >
            <LayoutGrid size={16} />
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'ghost'} 
            size="icon"
            onClick={() => setViewMode('list')} 
            className="rounded-l-none"
          >
            <List size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DirectorySearchBar;
