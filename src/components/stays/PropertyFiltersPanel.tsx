import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  SlidersHorizontal, 
  Home, 
  Bed, 
  Bath, 
  DollarSign, 
  Wifi, 
  Car, 
  Waves, 
  Snowflake,
  ChefHat,
  Tv,
  Laptop,
  Dumbbell,
  Flame,
  Zap,
  PawPrint,
  ShieldCheck,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { PropertySearchFilters, PropertyType, PROPERTY_TYPES, AMENITIES_LIST } from '@/types/vacation-rental';

interface PropertyFiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: PropertySearchFilters;
  onFilterChange: (filters: Partial<PropertySearchFilters>) => void;
  onApply: () => void;
  onReset: () => void;
  propertyCount?: number;
}

const AMENITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  kitchen: ChefHat,
  parking: Car,
  pool: Waves,
  ac: Snowflake,
  heating: Flame,
  tv: Tv,
  workspace: Laptop,
  gym: Dumbbell,
  ev_charger: Zap,
};

const PropertyFiltersPanel: React.FC<PropertyFiltersPanelProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onApply,
  onReset,
  propertyCount,
}) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice || 0,
    filters.maxPrice || 1000,
  ]);

  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
    onFilterChange({ minPrice: values[0], maxPrice: values[1] });
  };

  const toggleAmenity = (amenityId: string) => {
    const currentAmenities = filters.amenities || [];
    const newAmenities = currentAmenities.includes(amenityId)
      ? currentAmenities.filter(a => a !== amenityId)
      : [...currentAmenities, amenityId];
    onFilterChange({ amenities: newAmenities });
  };

  const handleReset = () => {
    setPriceRange([0, 1000]);
    onReset();
  };

  const activeFilterCount = [
    filters.propertyType,
    filters.bedrooms,
    filters.bathrooms,
    filters.petsAllowed,
    filters.instantBook,
    filters.minPrice || filters.maxPrice,
    (filters.amenities?.length || 0) > 0,
  ].filter(Boolean).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-900 border-l border-white/10 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="w-5 h-5 text-mansagold" />
                <h2 className="text-lg font-semibold text-white">Filters</h2>
                {activeFilterCount > 0 && (
                  <Badge className="bg-mansagold text-slate-900 text-xs">
                    {activeFilterCount} active
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Scrollable Content */}
            <ScrollArea className="flex-1 px-4">
              <div className="py-6 space-y-8">
                {/* Property Type */}
                <div className="space-y-4">
                  <Label className="text-white font-medium flex items-center gap-2">
                    <Home className="w-4 h-4 text-mansagold" />
                    Property Type
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {PROPERTY_TYPES.map((type) => (
                      <Button
                        key={type.value}
                        variant="outline"
                        size="sm"
                        onClick={() => 
                          onFilterChange({ 
                            propertyType: filters.propertyType === type.value ? undefined : type.value 
                          })
                        }
                        className={cn(
                          'border-white/20 transition-all',
                          filters.propertyType === type.value
                            ? 'bg-mansagold text-slate-900 border-mansagold hover:bg-mansagold/90'
                            : 'bg-transparent text-white/80 hover:bg-white/10 hover:text-white'
                        )}
                      >
                        {type.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator className="bg-white/10" />

                {/* Price Range */}
                <div className="space-y-4">
                  <Label className="text-white font-medium flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-mansagold" />
                    Price per night
                  </Label>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      min={0}
                      max={1000}
                      step={25}
                      onValueChange={handlePriceChange}
                      className="[&_[role=slider]]:bg-mansagold [&_[role=slider]]:border-mansagold [&_.bg-primary]:bg-mansagold"
                    />
                    <div className="flex justify-between mt-3 text-sm">
                      <span className="text-white bg-slate-800 px-3 py-1 rounded-full">
                        ${priceRange[0]}
                      </span>
                      <span className="text-white/60">to</span>
                      <span className="text-white bg-slate-800 px-3 py-1 rounded-full">
                        ${priceRange[1]}+
                      </span>
                    </div>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                {/* Rooms */}
                <div className="space-y-4">
                  <Label className="text-white font-medium">Rooms</Label>
                  
                  {/* Bedrooms */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Bed className="w-4 h-4" />
                      <span>Bedrooms</span>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <Button
                          key={num}
                          variant="outline"
                          size="sm"
                          onClick={() => 
                            onFilterChange({ 
                              bedrooms: filters.bedrooms === num ? undefined : num 
                            })
                          }
                          className={cn(
                            'w-10 h-10 p-0 border-white/20',
                            filters.bedrooms === num
                              ? 'bg-mansagold text-slate-900 border-mansagold'
                              : 'bg-transparent text-white/80 hover:bg-white/10'
                          )}
                        >
                          {num === 5 ? '5+' : num}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Bathrooms */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Bath className="w-4 h-4" />
                      <span>Bathrooms</span>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((num) => (
                        <Button
                          key={num}
                          variant="outline"
                          size="sm"
                          onClick={() => 
                            onFilterChange({ 
                              bathrooms: filters.bathrooms === num ? undefined : num 
                            })
                          }
                          className={cn(
                            'w-10 h-10 p-0 border-white/20',
                            filters.bathrooms === num
                              ? 'bg-mansagold text-slate-900 border-mansagold'
                              : 'bg-transparent text-white/80 hover:bg-white/10'
                          )}
                        >
                          {num === 4 ? '4+' : num}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                {/* Quick Filters */}
                <div className="space-y-4">
                  <Label className="text-white font-medium">Quick Filters</Label>
                  
                  <div className="space-y-3">
                    {/* Instant Book */}
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-mansagold" />
                        <div>
                          <p className="text-white font-medium text-sm">Instant Book</p>
                          <p className="text-white/60 text-xs">Book without waiting for approval</p>
                        </div>
                      </div>
                      <Switch
                        checked={filters.instantBook || false}
                        onCheckedChange={(checked) => onFilterChange({ instantBook: checked || undefined })}
                        className="data-[state=checked]:bg-mansagold"
                      />
                    </div>

                    {/* Pets Allowed */}
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3">
                        <PawPrint className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-white font-medium text-sm">Pets Allowed</p>
                          <p className="text-white/60 text-xs">Bring your furry friends</p>
                        </div>
                      </div>
                      <Switch
                        checked={filters.petsAllowed || false}
                        onCheckedChange={(checked) => onFilterChange({ petsAllowed: checked || undefined })}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>

                    {/* Verified Host */}
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-white font-medium text-sm">Verified Host</p>
                          <p className="text-white/60 text-xs">ID-verified trusted hosts</p>
                        </div>
                      </div>
                      <Switch
                        checked={filters.verifiedOnly || false}
                        onCheckedChange={(checked) => onFilterChange({ verifiedOnly: checked || undefined })}
                        className="data-[state=checked]:bg-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                {/* Amenities */}
                <div className="space-y-4">
                  <Label className="text-white font-medium">Amenities</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {AMENITIES_LIST.slice(0, 12).map((amenity) => {
                      const Icon = AMENITY_ICONS[amenity.id] || Wifi;
                      const isSelected = filters.amenities?.includes(amenity.id);
                      
                      return (
                        <Button
                          key={amenity.id}
                          variant="outline"
                          onClick={() => toggleAmenity(amenity.id)}
                          className={cn(
                            'justify-start gap-2 h-auto py-3 border-white/20',
                            isSelected
                              ? 'bg-mansagold/20 border-mansagold/50 text-mansagold'
                              : 'bg-transparent text-white/70 hover:bg-white/10 hover:text-white'
                          )}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm">{amenity.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom padding for buttons */}
                <div className="h-24" />
              </div>
            </ScrollArea>

            {/* Footer Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent pt-8">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={() => {
                    onApply();
                    onClose();
                  }}
                  className="flex-1 bg-gradient-to-r from-mansagold to-amber-500 text-slate-900 hover:from-amber-400 hover:to-mansagold font-bold"
                >
                  Show {propertyCount !== undefined ? propertyCount : ''} Properties
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PropertyFiltersPanel;
