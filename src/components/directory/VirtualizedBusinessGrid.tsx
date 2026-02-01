import React, { useRef, useCallback, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Business } from '@/types/business';
import BusinessCard from '@/components/BusinessCard';
import { getBusinessCardImage } from '@/utils/businessBanners';

interface VirtualizedBusinessGridProps {
  businesses: Business[];
  onSelectBusiness: (id: string) => void;
}

const VirtualizedBusinessGrid: React.FC<VirtualizedBusinessGridProps> = ({ 
  businesses, 
  onSelectBusiness 
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  
  // Calculate columns based on container width
  const getColumnCount = useCallback(() => {
    if (typeof window === 'undefined') return 4;
    const width = parentRef.current?.offsetWidth || window.innerWidth;
    if (width < 768) return 1;
    if (width < 1024) return 2;
    if (width < 1280) return 3;
    return 4;
  }, []);

  const columnCount = useMemo(() => getColumnCount(), [getColumnCount]);
  const rowCount = Math.ceil(businesses.length / columnCount);
  
  // Estimate row height (card height + gap)
  const estimatedRowHeight = 420;
  
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimatedRowHeight,
    overscan: 3, // Render 3 extra rows for smoother scrolling
  });

  if (businesses.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-white/20 rounded-lg bg-slate-800/40">
        <h3 className="text-lg font-bold text-white mb-2">No businesses found</h3>
        <p className="text-slate-400">Try adjusting your search or filters</p>
      </div>
    );
  }

  // For smaller lists, render without virtualization for better UX
  if (businesses.length <= 20) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {businesses.map((business) => {
          const cardImageUrl = getBusinessCardImage(business.id, business.bannerUrl) || business.imageUrl;
          return (
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
                phone={business.phone}
                imageUrl={cardImageUrl}
                imageAlt={business.imageAlt}
                isFeatured={business.isFeatured}
                isSample={business.isSample}
                isVerified={business.isVerified}
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div 
      ref={parentRef}
      className="h-[800px] overflow-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent"
      style={{ contain: 'strict' }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const startIndex = virtualRow.index * columnCount;
          const rowBusinesses = businesses.slice(startIndex, startIndex + columnCount);
          
          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-1">
                {rowBusinesses.map((business) => {
                  const cardImageUrl = getBusinessCardImage(business.id, business.bannerUrl) || business.imageUrl;
                  return (
                    <div 
                      key={business.id} 
                      id={`business-${business.id}`} 
                      className="transition-all duration-300 h-full"
                      onClick={() => onSelectBusiness(business.id)}
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
                        phone={business.phone}
                        imageUrl={cardImageUrl}
                        imageAlt={business.imageAlt}
                        isFeatured={business.isFeatured}
                        isSample={business.isSample}
                        isVerified={business.isVerified}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(VirtualizedBusinessGrid);
