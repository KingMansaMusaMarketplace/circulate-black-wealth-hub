
import React from 'react';
import {
  Wifi,
  Car,
  Waves,
  Snowflake,
  Flame,
  Tv,
  Utensils,
  Dumbbell,
  Laptop,
  Zap,
  Bath,
  Wind,
  Sun,
  Umbrella,
  Anchor,
  Mountain,
  TreePine,
  ChefHat,
  Shirt,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AMENITY_ICONS: Record<string, LucideIcon> = {
  wifi: Wifi,
  kitchen: ChefHat,
  washer: Shirt,
  dryer: Wind,
  ac: Snowflake,
  heating: Flame,
  pool: Waves,
  hot_tub: Bath,
  parking: Car,
  gym: Dumbbell,
  bbq: Utensils,
  fireplace: Flame,
  tv: Tv,
  workspace: Laptop,
  ev_charger: Zap,
  beach_access: Umbrella,
  lake_access: Anchor,
  ski_access: Mountain,
  patio: Sun,
  garden: TreePine,
};

const AMENITY_LABELS: Record<string, string> = {
  wifi: 'WiFi',
  kitchen: 'Kitchen',
  washer: 'Washer',
  dryer: 'Dryer',
  ac: 'Air Conditioning',
  heating: 'Heating',
  pool: 'Pool',
  hot_tub: 'Hot Tub',
  parking: 'Free Parking',
  gym: 'Gym',
  bbq: 'BBQ Grill',
  fireplace: 'Fireplace',
  tv: 'TV',
  workspace: 'Dedicated Workspace',
  ev_charger: 'EV Charger',
  beach_access: 'Beach Access',
  lake_access: 'Lake Access',
  ski_access: 'Ski-in/Ski-out',
  patio: 'Patio/Balcony',
  garden: 'Garden',
};

interface AmenitiesListProps {
  amenities: string[];
  variant?: 'compact' | 'full' | 'grid';
  maxItems?: number;
  className?: string;
}

const AmenitiesList: React.FC<AmenitiesListProps> = ({
  amenities,
  variant = 'full',
  maxItems,
  className,
}) => {
  const displayAmenities = maxItems ? amenities.slice(0, maxItems) : amenities;
  const remainingCount = maxItems && amenities.length > maxItems 
    ? amenities.length - maxItems 
    : 0;

  if (variant === 'compact') {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {displayAmenities.map((amenity) => {
          const Icon = AMENITY_ICONS[amenity];
          if (!Icon) return null;
          return (
            <div
              key={amenity}
              className="flex items-center gap-1.5 text-sm text-white/70"
            >
              <Icon className="w-4 h-4 text-mansagold" />
              <span>{AMENITY_LABELS[amenity] || amenity}</span>
            </div>
          );
        })}
        {remainingCount > 0 && (
          <span className="text-sm text-white/60">
            +{remainingCount} more
          </span>
        )}
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={cn('grid grid-cols-2 gap-4', className)}>
        {displayAmenities.map((amenity) => {
          const Icon = AMENITY_ICONS[amenity];
          if (!Icon) return null;
          return (
            <div
              key={amenity}
              className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-white/10"
            >
              <Icon className="w-5 h-5 text-mansagold" />
              <span className="text-sm font-medium text-white">
                {AMENITY_LABELS[amenity] || amenity}
              </span>
            </div>
          );
        })}
        {remainingCount > 0 && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-white/10 text-white/60">
            <span className="text-sm">+{remainingCount} more amenities</span>
          </div>
        )}
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={cn('space-y-3', className)}>
      {displayAmenities.map((amenity) => {
        const Icon = AMENITY_ICONS[amenity];
        if (!Icon) return null;
        return (
          <div
            key={amenity}
            className="flex items-center gap-4"
          >
            <Icon className="w-6 h-6 text-mansagold" />
            <span className="text-white">
              {AMENITY_LABELS[amenity] || amenity}
            </span>
          </div>
        );
      })}
      {remainingCount > 0 && (
        <span className="text-sm text-white/60">
          +{remainingCount} more amenities
        </span>
      )}
    </div>
  );
};

export default AmenitiesList;
