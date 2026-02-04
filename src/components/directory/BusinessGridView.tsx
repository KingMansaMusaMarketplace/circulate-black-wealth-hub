import React from 'react';
import { Business } from '@/types/business';
import PremiumBusinessCard from './PremiumBusinessCard';
import { getBusinessCardImage } from '@/utils/businessBanners';
import { motion } from 'framer-motion';

interface BusinessGridViewProps {
  businesses: Business[];
  onSelectBusiness: (id: string) => void;
}

const BusinessGridView: React.FC<BusinessGridViewProps> = ({ businesses, onSelectBusiness }) => {
  
  if (businesses.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 border border-dashed border-white/20 rounded-2xl bg-slate-900/50 backdrop-blur-sm"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
          <span className="text-3xl">🔍</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No businesses found</h3>
        <p className="text-gray-400 max-w-md mx-auto">Try adjusting your search or filters to discover more Black-owned businesses in your area</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {businesses.map((business, index) => {
        // Use card-specific image if available, otherwise fall back to business imageUrl
        const cardImageUrl = getBusinessCardImage(business.id, business.bannerUrl) || business.imageUrl;
        
        return (
          <div 
            key={business.id} 
            id={`business-${business.id}`} 
            className="h-full"
          >
            <PremiumBusinessCard 
              id={business.id}
              name={business.name}
              category={business.category}
              rating={business.rating}
              reviewCount={business.reviewCount}
              discount={business.discount}
              distance={business.distance}
              address={business.address}
              phone={business.phone}
              imageUrl={cardImageUrl}
              imageAlt={business.imageAlt}
              isFeatured={business.isFeatured}
              isSample={business.isSample}
              isVerified={business.isVerified}
              index={index}
            />
          </div>
        );
      })}
    </div>
  );
};

export default BusinessGridView;
