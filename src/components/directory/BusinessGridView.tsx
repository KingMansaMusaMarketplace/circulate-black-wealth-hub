import React from 'react';
import { Business } from '@/types/business';
import PremiumBusinessCard from './PremiumBusinessCard';
import { getBusinessCardImage } from '@/utils/businessBanners';
import { cn } from '@/lib/utils';
import InlineSponsorCard from '@/components/sponsors/InlineSponsorCard';
import DirectoryEmptyState from './DirectoryEmptyState';

interface BusinessGridViewProps {
  businesses: Business[];
  onSelectBusiness: (id: string) => void;
  onResetFilters?: () => void;
}

const BusinessGridView: React.FC<BusinessGridViewProps> = ({ businesses, onSelectBusiness, onResetFilters }) => {
  
  if (businesses.length === 0) {
    return <DirectoryEmptyState onResetFilters={onResetFilters} />;
  }

  // Separate featured businesses for special treatment
  const featuredBusinesses = businesses.filter(b => b.isFeatured);
  const regularBusinesses = businesses.filter(b => !b.isFeatured);

  // Track letters for alphabet jump
  let lastLetterFeatured = '';
  let lastLetterRegular = '';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      {/* Featured businesses get larger cards */}
      {featuredBusinesses.map((business, index) => {
        const cardImageUrl = getBusinessCardImage(business.id, business.bannerUrl, business.website) || business.imageUrl;
        const firstChar = business.name.charAt(0).toUpperCase();
        const letter = /[A-Z]/.test(firstChar) ? firstChar : '#';
        const isNewLetter = letter !== lastLetterFeatured;
        if (isNewLetter) lastLetterFeatured = letter;
        
        return (
          <div 
            key={business.id} 
            id={`business-${business.id}`} 
            className={cn(
              "h-full",
              // First featured card spans 2 columns on larger screens
              index === 0 && "md:col-span-2 lg:col-span-2"
            )}
            {...(isNewLetter ? { 'data-letter-group': letter } : {})}
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
              city={business.city}
              state={business.state}
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
        const cardImageUrl = getBusinessCardImage(business.id, business.bannerUrl, business.website) || business.imageUrl;
        const firstChar = business.name.charAt(0).toUpperCase();
        const letter = /[A-Z]/.test(firstChar) ? firstChar : '#';
        const isNewLetter = letter !== lastLetterRegular;
        if (isNewLetter) lastLetterRegular = letter;
        
        return (
          <React.Fragment key={business.id}>
            {/* Inline sponsor card after 3rd regular business (mobile only) */}
            {index === 3 && (
              <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <InlineSponsorCard />
              </div>
            )}
            <div 
              id={`business-${business.id}`} 
              className="h-full"
              {...(isNewLetter ? { 'data-letter-group': letter } : {})}
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
                city={business.city}
                state={business.state}
                phone={business.phone}
                imageUrl={cardImageUrl}
                imageAlt={business.imageAlt}
                isFeatured={business.isFeatured}
                isSample={business.isSample}
                isVerified={business.isVerified}
                index={index + featuredBusinesses.length}
              />
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default BusinessGridView;
