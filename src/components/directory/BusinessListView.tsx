
import React from 'react';
import { Business } from '@/types/business';
import BusinessCard from '@/components/BusinessCard';

interface BusinessListViewProps {
  businesses: Business[];
  onSelectBusiness: (id: string) => void;
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

  // Group businesses by first letter for alphabet jump
  let lastLetter = '';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {businesses.map((business) => {
        const firstChar = business.name.charAt(0).toUpperCase();
        const letter = /[A-Z]/.test(firstChar) ? firstChar : '#';
        const isNewLetter = letter !== lastLetter;
        if (isNewLetter) lastLetter = letter;

        return (
          <div 
            key={business.id} 
            id={`business-${business.id}`} 
            className="transition-all duration-300 h-full"
            {...(isNewLetter ? { 'data-letter-group': letter } : {})}
          >
            <BusinessCard {...business} />
          </div>
        );
      })}
    </div>
  );
};

export default BusinessListView;
