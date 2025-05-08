
import React from 'react';
import { MapPin } from 'lucide-react';

interface DirectoryResultsSummaryProps {
  totalResults: number;
}

const DirectoryResultsSummary: React.FC<DirectoryResultsSummaryProps> = ({ totalResults }) => {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-gray-500">
        Showing {totalResults} businesses
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
