import React from 'react';
import { Star, MapPin, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Business } from '@/types/business';
import { useNavigate } from 'react-router-dom';

interface CompactBusinessCardProps {
  business: Business;
  isHighlighted?: boolean;
  onHover?: (id: string | null) => void;
  onClick?: (id: string) => void;
}

const CompactBusinessCard: React.FC<CompactBusinessCardProps> = ({
  business,
  isHighlighted = false,
  onHover,
  onClick,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(business.id);
    }
    navigate(`/business/${business.id}`);
  };

  return (
    <div
      id={`business-${business.id}`}
      className={cn(
        'group flex gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300',
        'bg-slate-800/50 hover:bg-slate-800/80 border border-white/5 hover:border-mansagold/30',
        isHighlighted && 'ring-2 ring-mansagold bg-slate-800/80 border-mansagold/30'
      )}
      onMouseEnter={() => onHover?.(business.id)}
      onMouseLeave={() => onHover?.(null)}
      onClick={handleClick}
    >
      {/* Image */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
        <img
          src={business.imageUrl || business.logoUrl || '/placeholder.svg'}
          alt={business.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {business.isFeatured && (
          <div className="absolute top-1 left-1 bg-mansagold text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-white text-base sm:text-lg truncate group-hover:text-mansagold transition-colors">
            {business.name}
          </h3>
          <ExternalLink className="w-3.5 h-3.5 text-gray-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <p className="text-xs text-mansagold/80 font-medium mt-0.5">
          {business.category}
        </p>

        <div className="flex items-center gap-3 mt-2">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-mansagold text-mansagold" />
            <span className="text-xs text-white font-medium">
              {business.averageRating?.toFixed(1) || business.rating?.toFixed(1) || 'New'}
            </span>
            {business.reviewCount > 0 && (
              <span className="text-xs text-gray-500">({business.reviewCount})</span>
            )}
          </div>

          {/* Distance */}
          {business.distance && (
            <div className="flex items-center gap-1 text-gray-400">
              <MapPin className="w-3 h-3" />
              <span className="text-xs">{business.distance}</span>
            </div>
          )}
        </div>

        {/* Discount badge */}
        {business.discount && business.discountValue > 0 && (
          <div className="mt-2">
            <span className="inline-block text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
              {business.discount}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompactBusinessCard;
