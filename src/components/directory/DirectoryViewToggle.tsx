import React from 'react';
import { Button } from '@/components/ui/button';
import { ListFilter, Grid3X3, List, MapPin } from 'lucide-react';
import { CompareButton } from '@/components/business/comparison/CompareButton';
import { ContextualTooltip } from '@/components/ui/ContextualTooltip';
import { CONTEXTUAL_TIPS } from '@/lib/onboarding-constants';
import { Business } from '@/types/business';

type ViewMode = 'grid' | 'list' | 'map';

interface DirectoryViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  businessCount: number;
  selectedCity: string;
  businesses: Business[];
}

const DirectoryViewToggle: React.FC<DirectoryViewToggleProps> = ({
  viewMode,
  onViewModeChange,
  businessCount,
  selectedCity,
  businesses
}) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-mansablue/20 via-blue-500/20 to-mansagold/20 rounded-3xl blur-xl"></div>
      <div className="relative border border-white/10 bg-slate-800/60 backdrop-blur-xl rounded-3xl shadow-2xl p-6 mb-8 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-mansablue via-blue-500 to-mansagold"></div>
        <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <ListFilter className="h-6 w-6 mr-2 text-mansagold" />
            <span className="font-body text-white font-bold text-lg">
              {businessCount} businesses found 🎯
              {selectedCity !== 'all' && (
                <span className="text-slate-300 ml-2 font-normal">
                  in {selectedCity.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              )}
            </span>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <CompareButton businesses={businesses} />
            <Button 
              variant={viewMode === 'grid' ? "default" : "outline"} 
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className={`shadow-sm ${viewMode === 'grid' ? 'bg-gradient-to-r from-mansablue to-blue-500 hover:from-blue-600 hover:to-blue-600 text-white border-0' : 'border-white/10 text-slate-300 hover:bg-white/10'}`}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <Grid3X3 className="h-4 w-4 mr-1" />
              <span>Grid</span>
            </Button>
            <Button 
              variant={viewMode === 'list' ? "default" : "outline"} 
              size="sm"
              onClick={() => onViewModeChange('list')}
              className={`shadow-sm ${viewMode === 'list' ? 'bg-gradient-to-r from-blue-500 to-mansagold hover:from-blue-600 hover:to-amber-500 text-white border-0' : 'border-white/10 text-slate-300 hover:bg-white/10'}`}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
            >
              <List className="h-4 w-4 mr-1" />
              <span>List</span>
            </Button>
            <ContextualTooltip
              id="directory-map-view"
              title={CONTEXTUAL_TIPS['directory-map'].title}
              tip={CONTEXTUAL_TIPS['directory-map'].tip}
              trigger="hover"
            >
              <Button 
                variant={viewMode === 'map' ? "default" : "outline"} 
                size="sm"
                onClick={() => onViewModeChange('map')}
                className={`shadow-sm ${viewMode === 'map' ? 'bg-gradient-to-r from-mansagold to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white border-0' : 'border-white/10 text-slate-300 hover:bg-white/10'}`}
              >
                <MapPin className="h-4 w-4 mr-1" />
                Map
              </Button>
            </ContextualTooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectoryViewToggle;
