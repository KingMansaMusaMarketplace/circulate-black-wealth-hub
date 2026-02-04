import React from 'react';
import { Business } from '@/types/business';
import PremiumBusinessCard from './PremiumBusinessCard';
import { getBusinessCardImage } from '@/utils/businessBanners';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-white/10">
          <span className="text-4xl">🔍</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">No businesses found</h3>
        <p className="text-gray-400 max-w-md mx-auto text-lg">
          Try adjusting your search or filters to discover more Black-owned businesses in your area
        </p>
      </motion.div>
    );
  }

  // Separate featured businesses for special treatment
  const featuredBusinesses = businesses.filter(b => b.isFeatured);
  const regularBusinesses = businesses.filter(b => !b.isFeatured);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      {/* Featured businesses get larger cards */}
      {featuredBusinesses.map((business, index) => {
        const cardImageUrl = getBusinessCardImage(business.id, business.bannerUrl) || business.imageUrl;
        
        return (
          <div 
            key={business.id} 
            id={`business-${business.id}`} 
            className={cn(
              "h-full",
              // First featured card spans 2 columns on larger screens
              index === 0 && "md:col-span-2 lg:col-span-2"
            )}
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
      
      {/* Regular businesses */}
      {regularBusinesses.map((business, index) => {
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
              index={index + featuredBusinesses.length}
            />
          </div>
        );
      })}
    </div>
  );
};

export default BusinessGridView;
