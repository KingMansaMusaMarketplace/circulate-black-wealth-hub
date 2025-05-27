
import React from 'react';
import { Business } from '@/types/business';
import BusinessCard from '@/components/BusinessCard';

interface BusinessListViewProps {
  businesses: Business[];
  onSelectBusiness: (id: number) => void;
}

const BusinessListView: React.FC<BusinessListViewProps> = ({ businesses, onSelectBusiness }) => {
  if (businesses.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-gray-200 rounded-lg">
        <h3 className="text-lg font-bold text-gray-700 mb-2">No businesses found</h3>
        <p className="text-gray-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  console.log('BusinessListView rendering businesses:', businesses.length);
  console.log('Sample business with image:', businesses[0]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {businesses.map((business) => (
        <div 
          key={business.id} 
          id={`business-${business.id}`} 
          className="transition-all duration-300 h-full"
        >
          <BusinessCard {...business} />
        </div>
      ))}
    </div>
  );
};

export default BusinessListView;
