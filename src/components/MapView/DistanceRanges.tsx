
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { BusinessLocation } from './types';

interface DistanceRangesProps {
  nearbyBusinesses: BusinessLocation[];
}

const DistanceRanges: React.FC<DistanceRangesProps> = ({ nearbyBusinesses }) => {
  const getDistanceRanges = () => {
    const ranges = {
      'under-1': nearbyBusinesses.filter(b => b.distanceValue && b.distanceValue < 1).length,
      '1-3': nearbyBusinesses.filter(b => b.distanceValue && b.distanceValue >= 1 && b.distanceValue < 3).length,
      '3-5': nearbyBusinesses.filter(b => b.distanceValue && b.distanceValue >= 3 && b.distanceValue < 5).length,
      '5-plus': nearbyBusinesses.filter(b => b.distanceValue && b.distanceValue >= 5).length,
    };
    
    return ranges;
  };

  const ranges = getDistanceRanges();
  const total = nearbyBusinesses.length;

  if (total === 0) {
    return (
      <div className="text-center py-4">
        <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">No businesses found nearby</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-sm text-mansablue">Distance Breakdown</h4>
      
      <div className="space-y-2">
        {ranges['under-1'] > 0 && (
          <div className="flex items-center justify-between p-2 bg-green-50 rounded">
            <span className="text-sm">Under 1 mile</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {ranges['under-1']}
            </Badge>
          </div>
        )}
        
        {ranges['1-3'] > 0 && (
          <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
            <span className="text-sm">1-3 miles</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {ranges['1-3']}
            </Badge>
          </div>
        )}
        
        {ranges['3-5'] > 0 && (
          <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
            <span className="text-sm">3-5 miles</span>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              {ranges['3-5']}
            </Badge>
          </div>
        )}
        
        {ranges['5-plus'] > 0 && (
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm">5+ miles</span>
            <Badge variant="secondary" className="bg-gray-100 text-gray-800">
              {ranges['5-plus']}
            </Badge>
          </div>
        )}
      </div>
      
      <div className="pt-2 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Total businesses</span>
          <Badge variant="default" className="bg-mansablue">
            {total}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default DistanceRanges;
