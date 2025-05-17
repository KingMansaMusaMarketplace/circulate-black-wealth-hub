
import React from 'react';
import { MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BusinessListProps } from './types';

const BusinessList: React.FC<BusinessListProps> = ({ nearbyBusinesses, onSelectBusiness }) => {
  if (nearbyBusinesses.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">No businesses found near your location.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm">Businesses by Distance:</h4>
      {nearbyBusinesses.map((business) => (
        <Card 
          key={business.id}
          className="p-3 cursor-pointer hover:border-mansablue transition-colors"
          onClick={() => onSelectBusiness && onSelectBusiness(business.id)}
        >
          <div className="flex items-start">
            <div className="h-8 w-8 rounded-full bg-mansablue/10 flex items-center justify-center mr-3">
              <MapPin size={16} className="text-mansablue" />
            </div>
            <div className="flex-grow">
              <h5 className="font-medium">{business.name}</h5>
              <p className="text-xs text-gray-500">{business.category}</p>
            </div>
            <Badge variant="outline" className="ml-2 whitespace-nowrap">
              {business.distance} mi
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default BusinessList;
