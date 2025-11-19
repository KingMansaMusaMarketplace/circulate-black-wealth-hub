
import React from 'react';
import { MapPin, Info } from 'lucide-react';

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
  isFiltered
}) => {
  return (
    <div className="flex items-center text-sm text-slate-300 mt-4 mb-2">
      <Info size={16} className="mr-2 text-slate-400" />
      {totalResults === 0 ? (
        <p>No businesses found. Try adjusting your search criteria.</p>
      ) : (
        <p>
          <span className="font-medium">{totalResults}</span>{' '}
          {totalResults === 1 ? 'business' : 'businesses'} found
          {searchTerm && (
            <> matching "<span className="font-medium">{searchTerm}</span>"</>
          )}
          {nearMeActive && (
            <span className="inline-flex items-center ml-1">
              <MapPin size={14} className="mr-1" /> near you
            </span>
          )}
          {isFiltered && !searchTerm && (
            <> with selected filters</>
          )}
        </p>
      )}
    </div>
  );
};

export default DirectoryResultsSummary;
