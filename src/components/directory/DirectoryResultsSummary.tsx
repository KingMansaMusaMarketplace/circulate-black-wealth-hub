
import React from 'react';
import { MapPin } from 'lucide-react';

interface DirectoryResultsSummaryProps {
  totalResults: number;
  currentPage?: number;
  itemsPerPage?: number;
}

const DirectoryResultsSummary: React.FC<DirectoryResultsSummaryProps> = ({ 
  totalResults,
  currentPage = 1,
  itemsPerPage = 8
}) => {
  const startItem = totalResults === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalResults);
  
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-gray-500">
        {totalResults === 0 ? (
          <span>No businesses found</span>
        ) : (
          <span>
            Showing {startItem}-{endItem} of {totalResults} businesses
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 text-sm text-mansablue">
        <MapPin size={16} />
        <span>Atlanta, GA</span>
        <button className="text-xs underline">Change</button>
      </div>
    </div>
  );
};

export default DirectoryResultsSummary;
