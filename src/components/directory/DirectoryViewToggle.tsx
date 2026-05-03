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
  const activeBtn = "bg-mansagold text-black hover:bg-mansagold/90 border-0";
  const idleBtn = "border-white/10 bg-transparent text-slate-300 hover:bg-white/5 hover:text-white";

  return (
    <div className="border border-white/10 bg-slate-900/40 rounded-xl p-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center text-sm">
          <ListFilter className="h-4 w-4 mr-2 text-mansagold" />
          <span className="font-body text-white font-medium">
            {businessCount} {businessCount === 1 ? 'business' : 'businesses'}
            {selectedCity !== 'all' && (
              <span className="text-slate-400 ml-1.5 font-normal">
                in {selectedCity.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <CompareButton businesses={businesses} />
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className={viewMode === 'grid' ? activeBtn : idleBtn}
            aria-label="Grid view"
            aria-pressed={viewMode === 'grid'}
          >
            <Grid3X3 className="h-4 w-4 mr-1" />
            <span>Grid</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewModeChange('list')}
            className={viewMode === 'list' ? activeBtn : idleBtn}
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
              variant="outline"
              size="sm"
              onClick={() => onViewModeChange('map')}
              className={viewMode === 'map' ? activeBtn : idleBtn}
              aria-label="Map view"
              aria-pressed={viewMode === 'map'}
            >
              <MapPin className="h-4 w-4 mr-1" />
              Map
            </Button>
          </ContextualTooltip>
        </div>
      </div>
    </div>
  );
};

export default DirectoryViewToggle;
