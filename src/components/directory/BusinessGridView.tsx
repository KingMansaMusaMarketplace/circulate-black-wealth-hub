
import React from 'react';
import { Business } from '@/types/business';
import BusinessCard from '@/components/BusinessCard';

interface BusinessGridViewProps {
  businesses: Business[];
  onSelectBusiness: (id: string) => void;
}

const BusinessGridView: React.FC<BusinessGridViewProps> = ({ businesses, onSelectBusiness }) => {
  
  if (businesses.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-gray-300 rounded-2xl bg-gray-50">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-3xl">🔍</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No businesses found</h3>
        <p className="text-gray-600 max-w-md mx-auto">Try adjusting your search or filters to discover more Black-owned businesses in your area</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {businesses.map((business) => (
          <div 
            key={business.id} 
            id={`business-${business.id}`} 
            className="transition-all duration-300 h-full"
          >
            <BusinessCard 
              id={business.id}
              name={business.name}
              category={business.category}
              rating={business.rating}
              reviewCount={business.reviewCount}
              discount={business.discount}
              distance={business.distance}
              address={business.address}
              imageUrl={business.imageUrl}
              imageAlt={business.imageAlt}
              isFeatured={business.isFeatured}
              isSample={business.isSample}
              isVerified={business.isVerified}
            />
          </div>
        )
      )}
    </div>
  );
};

export default BusinessGridView;

