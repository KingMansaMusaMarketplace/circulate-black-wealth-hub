
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DistanceRangesProps } from './types';
import { getDistanceRanges } from './utils';

const DistanceRanges: React.FC<DistanceRangesProps> = ({ nearbyBusinesses }) => {
  const distanceRanges = getDistanceRanges(nearbyBusinesses);

  if (!distanceRanges) return null;

  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium mb-2">Businesses Near You:</h4>
      <div className="grid grid-cols-2 gap-2">
        {distanceRanges.under1 > 0 && (
          <Badge variant="outline" className="flex justify-between px-3 py-1.5">
            <span>Under 1 mile:</span>
            <span className="font-bold text-mansablue">{distanceRanges.under1}</span>
          </Badge>
        )}
        {distanceRanges.under5 > 0 && (
          <Badge variant="outline" className="flex justify-between px-3 py-1.5">
            <span>1-5 miles:</span>
            <span className="font-bold text-mansablue">{distanceRanges.under5}</span>
          </Badge>
        )}
        {distanceRanges.under10 > 0 && (
          <Badge variant="outline" className="flex justify-between px-3 py-1.5">
            <span>5-10 miles:</span>
            <span className="font-bold text-mansablue">{distanceRanges.under10}</span>
          </Badge>
        )}
        {distanceRanges.over10 > 0 && (
          <Badge variant="outline" className="flex justify-between px-3 py-1.5">
            <span>10+ miles:</span>
            <span className="font-bold text-mansablue">{distanceRanges.over10}</span>
          </Badge>
        )}
      </div>
    </div>
  );
};

export default DistanceRanges;
