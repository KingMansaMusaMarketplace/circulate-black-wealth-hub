
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Business {
  id: number;
  name: string;
  category: string;
  discount: string;
  rating: number;
  reviewCount: number;
  distance: string;
}

interface NearbyBusinessesProps {
  businesses: Business[];
}

const NearbyBusinesses: React.FC<NearbyBusinessesProps> = ({ businesses }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nearby Businesses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {businesses.map((business) => (
            <Link key={business.id} to={`/business/${business.id}`}>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{business.name}</h3>
                    <Badge variant="secondary">{business.category}</Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{business.rating} ({business.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{business.distance} mi</span>
                    </div>
                  </div>
                </div>
                
                <Badge className="bg-green-100 text-green-800">
                  {business.discount}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NearbyBusinesses;
