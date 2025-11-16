
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, TrendingUp, Settings } from 'lucide-react';
import UserPreferencesDialog from './UserPreferencesDialog';

interface DesktopHeroSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  location: any;
  handleGetLocation: () => void;
  locationLoading: boolean;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (show: boolean) => void;
  categories: string[];
}

const DesktopHeroSection: React.FC<DesktopHeroSectionProps> = ({
  searchTerm,
  onSearchChange,
  location,
  handleGetLocation,
  locationLoading,
  showAdvancedFilters,
  setShowAdvancedFilters,
  categories
}) => {
  return (
    <div className="bg-gradient-to-r from-mansablue to-mansablue-dark py-12">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Discover Amazing Black-Owned Businesses
        </h1>
        <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg">
          Powered by AI recommendations, smart filtering, and real-time location data
        </p>
        
        <div className="relative max-w-xl mx-auto mb-6">
          <Search className="absolute left-3 top-3 h-5 w-5 text-primary-foreground/70" />
          <Input
            type="text" 
            placeholder="Search businesses, categories, or locations..."
            className="pl-10 h-12 w-full text-xl rounded-lg bg-background/10 text-primary-foreground placeholder:text-primary-foreground/70 border border-primary-foreground/30 focus-visible:ring-offset-0"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex justify-center gap-4">
          <Button
            variant="secondary"
            onClick={handleGetLocation}
            disabled={locationLoading}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <MapPin className="h-4 w-4 mr-2" />
            {location ? 'Update Location' : 'Find Near Me'}
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Smart Filters
          </Button>

          <UserPreferencesDialog categories={categories}>
            <Button
              variant="secondary"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Settings className="h-4 w-4 mr-2" />
              Preferences
            </Button>
          </UserPreferencesDialog>
        </div>
      </div>
    </div>
  );
};

export default DesktopHeroSection;
