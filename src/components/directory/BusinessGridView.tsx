
import React from 'react';
import { Business } from '@/types/business';
import BusinessCard from '@/components/BusinessCard';

interface BusinessGridViewProps {
  businesses: Business[];
  onSelectBusiness: (id: number) => void;
}

const BusinessGridView: React.FC<BusinessGridViewProps> = ({ businesses, onSelectBusiness }) => {
  if (businesses.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-gray-200 rounded-lg">
        <h3 className="text-lg font-bold text-gray-700 mb-2">No businesses found</h3>
        <p className="text-gray-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {businesses.map((business) => (
        <div 
          key={business.id} 
          id={`business-${business.id}`} 
          className="transition-all duration-300 h-full"
          onClick={() => onSelectBusiness(business.id)}
        >
          <BusinessCard {...business} />
        </div>
      ))}
    </div>
  );
};

export default BusinessGridView;
