
import React from 'react';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DirectoryResultsSummaryProps {
  totalResults: number;
  nearMeActive?: boolean;
}

const DirectoryResultsSummary: React.FC<DirectoryResultsSummaryProps> = ({ totalResults, nearMeActive }) => {
  return (
    <div className="flex justify-between items-center py-3 px-4 bg-slate-50 rounded-md mb-4">
      <div>
        <p className="text-sm font-medium text-gray-700">
          {totalResults === 0 
            ? 'No businesses found' 
            : `${totalResults} ${totalResults === 1 ? 'business' : 'businesses'} found`}
        </p>
      </div>
      
      {nearMeActive && (
        <Badge variant="outline" className="flex items-center gap-1 bg-white">
          <MapPin size={12} />
          <span>Near Me</span>
        </Badge>
      )}
    </div>
  );
};

export default DirectoryResultsSummary;
