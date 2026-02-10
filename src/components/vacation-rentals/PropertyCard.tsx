
import React from 'react';
import { Star, MapPin, Users, Bed, Bath, Heart, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VacationProperty } from '@/types/vacation-rental';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface PropertyCardProps {
  property: VacationProperty;
  isHighlighted?: boolean;
  onHover?: (id: string | null) => void;
  onClick?: (id: string) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isHighlighted = false,
  onHover,
  onClick,
}) => {
  const navigate = useNavigate();
  const [currentPhotoIndex, setCurrentPhotoIndex] = React.useState(0);

  const handleClick = () => {
    if (onClick) {
      onClick(property.id);
    }
    navigate(`/stays/${property.id}`);
  };

  const photos = property.photos.length > 0 
    ? property.photos 
    : ['/placeholder.svg'];

  return (
    <div
      className={cn(
        'group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300',
        'bg-slate-900/80 backdrop-blur-xl border border-white/10',
        'hover:border-mansagold/40 hover:shadow-xl hover:shadow-mansagold/20 hover:-translate-y-1',
        isHighlighted && 'ring-2 ring-mansagold border-mansagold/30 shadow-lg shadow-mansagold/20'
      )}
      onMouseEnter={() => onHover?.(property.id)}
      onMouseLeave={() => onHover?.(null)}
      onClick={handleClick}
    >
      {/* Image carousel */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={photos[currentPhotoIndex]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Photo navigation dots */}
        {photos.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {photos.slice(0, 5).map((_, idx) => (
              <button
                key={idx}
                className={cn(
                  'w-1.5 h-1.5 rounded-full transition-all',
                  idx === currentPhotoIndex 
                    ? 'bg-white w-3' 
                    : 'bg-white/60 hover:bg-white/80'
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPhotoIndex(idx);
                }}
              />
            ))}
          </div>
        )}

        {/* Favorite button */}
        <button
          className="absolute top-3 right-3 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Toggle favorite
          }}
        >
          <Heart className="w-5 h-5 text-white" />
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {property.is_verified && (
            <Badge className="bg-mansagold text-black font-semibold">
              Verified
            </Badge>
          )}
          {property.is_instant_book && (
            <Badge variant="secondary" className="bg-white/90 text-slate-900">
              <Zap className="w-3 h-3 mr-1" />
              Instant Book
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Location */}
        <div className="flex items-center gap-1 text-white/60 text-sm mb-1">
          <MapPin className="w-3.5 h-3.5" />
          <span>{property.city}, {property.state}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-white text-lg line-clamp-1 group-hover:text-mansagold transition-colors">
          {property.title}
        </h3>

        {/* Property type */}
        <p className="text-sm text-white/50 capitalize mb-3">
          {property.property_type}
        </p>

        {/* Details row */}
        <div className="flex items-center gap-4 text-sm text-white/60 mb-3">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{property.max_guests} guests</span>
          </div>
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Rating and Price */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-mansagold text-mansagold" />
            <span className="font-medium text-white">
              {property.average_rating > 0 ? property.average_rating.toFixed(1) : 'New'}
            </span>
            {property.review_count > 0 && (
              <span className="text-white/50 text-sm">
                ({property.review_count} review{property.review_count !== 1 ? 's' : ''})
              </span>
            )}
          </div>

          {/* Price */}
          <div className="text-right">
            {(property.listing_mode === 'monthly' || property.listing_mode === 'both') && property.base_monthly_rate ? (
              <div>
                <span className="font-bold text-lg text-mansagold">
                  ${property.base_monthly_rate.toLocaleString()}
                </span>
                <span className="text-white/50 text-sm"> / mo</span>
                {property.listing_mode === 'both' && (
                  <div>
                    <span className="text-white/50 text-xs">
                      ${property.base_nightly_rate.toLocaleString()}/night
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <span className="font-bold text-lg text-mansagold">
                  ${property.base_nightly_rate.toLocaleString()}
                </span>
                <span className="text-white/50 text-sm"> / night</span>
              </div>
            )}
          </div>
        </div>

        {/* Pets badge */}
        {property.pets_allowed && (
          <div className="mt-3">
            <Badge variant="outline" className="text-xs text-white/70 border-white/20">
              🐾 Pet friendly
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
