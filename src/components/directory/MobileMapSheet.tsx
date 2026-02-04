import React, { useState } from 'react';
import { X, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Business } from '@/types/business';
import { BusinessLocation } from '@/components/MapView/types';
import MapboxMap from '@/components/MapView/MapboxMap';
import CompactBusinessCard from './CompactBusinessCard';
import { cn } from '@/lib/utils';

interface MobileMapSheetProps {
  isOpen: boolean;
  onClose: () => void;
  businesses: Business[];
  mapData: BusinessLocation[];
  userLocation?: { lat: number; lng: number } | null;
  mapApiKey?: string;
  onSelectBusiness?: (id: string) => void;
  highlightedBusinessId?: string | null;
  onMarkerClick?: (id: string) => void;
}

const MobileMapSheet: React.FC<MobileMapSheetProps> = ({
  isOpen,
  onClose,
  businesses,
  mapData,
  userLocation = null,
  mapApiKey = '',
  onSelectBusiness,
  highlightedBusinessId,
  onMarkerClick,
}) => {
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);

  const selectedBusiness = selectedBusinessId 
    ? businesses.find(b => b.id === selectedBusinessId) 
    : null;

  const handleMarkerClick = (id: string) => {
    setSelectedBusinessId(id);
    onMarkerClick?.(id);
  };

  const handleCardClick = (id: string) => {
    onClose();
    onSelectBusiness?.(id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute inset-0 top-12 bg-slate-900 rounded-t-3xl overflow-hidden flex flex-col"
          >
            {/* Handle bar */}
            <div className="flex items-center justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-white/20 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-3 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">Explore Map</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative">
              <MapboxMap
                apiKey={mapApiKey}
                userLocation={userLocation}
                businesses={mapData}
                onBusinessClick={handleMarkerClick}
                highlightedBusinessId={highlightedBusinessId || selectedBusinessId}
                onMarkerHover={() => {}}
              />

              {/* Selected Business Preview Card */}
              <AnimatePresence>
                {selectedBusiness && (
                  <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25 }}
                    className="absolute bottom-4 left-4 right-4"
                  >
                    <div className="relative">
                      {/* Close button for card */}
                      <button
                        onClick={() => setSelectedBusinessId(null)}
                        className="absolute -top-2 -right-2 z-10 p-1.5 rounded-full bg-slate-800 border border-white/10 hover:bg-slate-700 transition-colors"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                      
                      <CompactBusinessCard
                        business={selectedBusiness}
                        isHighlighted
                        onClick={handleCardClick}
                      />

                      {/* Get Directions Button */}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${selectedBusiness.name} ${selectedBusiness.address} ${selectedBusiness.city} ${selectedBusiness.state}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'flex items-center justify-center gap-2 mt-2 w-full py-2.5 rounded-lg',
                          'bg-mansablue text-white font-medium text-sm',
                          'hover:bg-mansablue/90 active:scale-98 transition-all'
                        )}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Navigation className="w-4 h-4" />
                        Get Directions
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMapSheet;
