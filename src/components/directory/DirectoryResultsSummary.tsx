import React from 'react';
import { MapPin, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DirectoryResultsSummaryProps {
  totalResults: number;
  nearMeActive: boolean;
  searchTerm: string;
  isFiltered: boolean;
}

const DirectoryResultsSummary: React.FC<DirectoryResultsSummaryProps> = ({
  totalResults,
  nearMeActive,
  searchTerm,
  isFiltered,
}) => {
  const hasResults = totalResults > 0;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4 mb-2 text-sm text-slate-300">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-mansagold" />
        {hasResults ? (
          <span>
            <span className="font-semibold text-white">{totalResults.toLocaleString()}</span>{' '}
            {totalResults === 1 ? 'business' : 'businesses'}
          </span>
        ) : (
          <span className="text-slate-400">No businesses match your criteria yet.</span>
        )}
      </div>

      {searchTerm && (
        <Badge
          variant="outline"
          className="bg-mansagold/10 text-mansagold border-mansagold/30 gap-1"
        >
          <Search size={12} />
          "{searchTerm}"
        </Badge>
      )}

      {nearMeActive && (
        <Badge
          variant="outline"
          className="bg-mansablue/20 text-blue-300 border-mansablue/40 gap-1"
        >
          <MapPin size={12} />
          Near you
        </Badge>
      )}

      {isFiltered && !searchTerm && (
        <Badge
          variant="outline"
          className="bg-white/5 text-slate-300 border-white/10 gap-1"
        >
          <SlidersHorizontal size={12} />
          Filtered
        </Badge>
      )}
    </div>
  );
};

export default DirectoryResultsSummary;
