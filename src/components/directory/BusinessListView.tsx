
import React from 'react';
import { Business } from '@/types/business';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, Star } from 'lucide-react';
import { getBusinessImageUrl } from '@/lib/api/directory/utils';

interface BusinessListViewProps {
  businesses: Business[];
  onSelectBusiness: (id: number) => void;
}

const BusinessListView: React.FC<BusinessListViewProps> = ({ businesses, onSelectBusiness }) => {
  // Generate a placeholder image with the business initial
  const generatePlaceholderUrl = (businessName: string) => {
    const initial = businessName.charAt(0).toUpperCase();
    return `https://placehold.co/300x200/e0e0e0/808080?text=${initial}`;
  };

  // Add logging to debug image loading issues
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, businessName: string) => {
    console.log(`List view image failed to load: ${e.currentTarget.src}`);
    e.currentTarget.src = generatePlaceholderUrl(businessName);
  };

  if (businesses.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-gray-200 rounded-lg">
        <h3 className="text-lg font-bold text-gray-700 mb-2">No businesses found</h3>
        <p className="text-gray-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {businesses.map((business) => (
        <div 
          key={business.id} 
          id={`business-${business.id}`} 
          className="transition-all duration-300"
          onClick={() => onSelectBusiness(business.id)}
        >
          <div className="flex flex-col md:flex-row gap-4 border rounded-xl overflow-hidden bg-white">
            <div className="md:w-1/4 h-40 md:h-auto bg-gray-100 flex items-center justify-center relative overflow-hidden">
              {business.imageUrl ? (
                <img 
                  src={business.imageUrl} 
                  alt={business.imageAlt || `${business.name} image`}
                  width="300" 
                  height="200"
                  loading="eager"
                  className="w-full h-full object-cover"
                  onError={(e) => handleImageError(e, business.name)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400 text-3xl font-bold">{business.name.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            <div className="flex-1 p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">{business.name}</h3>
                  <p className="text-gray-500 text-sm">{business.category}</p>
                </div>
                <div className="bg-mansagold/10 text-mansagold text-xs font-medium px-2.5 py-1 rounded">
                  {business.discount}
                </div>
              </div>
              
              <div className="flex items-center text-gray-500 text-xs mb-3">
                <MapPin size={14} className="mr-1" />
                <span>{business.address}</span>
                <span className="ml-auto text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                  {business.distance} miles
                </span>
              </div>
              
              <Link to={`/business/${business.id}`}>
                <Button variant="outline" size="sm" className="w-full border-mansablue text-mansablue hover:bg-mansablue hover:text-white">
                  View Business
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BusinessListView;
