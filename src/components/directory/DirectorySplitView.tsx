import React, { useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, List, X, Navigation, Star, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Business } from '@/types/business';
import { BusinessLocation } from '@/components/MapView/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import CompactBusinessCard from './CompactBusinessCard';
import MobileMapSheet from './MobileMapSheet';
import MapboxMap from '@/components/MapView/MapboxMap';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface DirectorySplitViewProps {
  businesses: Business[];
  mapData: BusinessLocation[];
  onSelectBusiness?: (id: string) => void;
  isLoading?: boolean;
  userLocation?: { lat: number; lng: number } | null;
  mapApiKey?: string;
}

const DirectorySplitView: React.FC<DirectorySplitViewProps> = ({
  businesses,
  mapData,
  onSelectBusiness,
  isLoading = false,
  userLocation = null,
  mapApiKey = '',
}) => {
  const isMobile = useIsMobile();
  // Treat iPads / tablets (≤1024px) as mobile for split-view purposes
  const [isTablet, setIsTablet] = useState(false);
  React.useEffect(() => {
    const check = () => setIsTablet(window.innerWidth <= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  const usesMobileLayout = isMobile || isTablet;
  const navigate = useNavigate();
  const [highlightedBusinessId, setHighlightedBusinessId] = useState<string | null>(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [showMobileMap, setShowMobileMap] = useState(false);
  const [showSplitView, setShowSplitView] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedBusiness = useMemo(() => {
    if (!selectedBusinessId) return null;
    // First check paginated businesses for full data
    const fromBusinesses = businesses.find(b => b.id === selectedBusinessId);
    if (fromBusinesses) return fromBusinesses;
    // Fallback to mapData (lightweight) for markers not on current page
    const fromMap = mapData.find(m => m.id === selectedBusinessId);
    if (fromMap) {
      return {
        id: fromMap.id,
        name: fromMap.name,
        category: fromMap.category,
        latitude: fromMap.lat,
        longitude: fromMap.lng,
        distance: fromMap.distance,
      } as unknown as Business;
    }
    return null;
  }, [selectedBusinessId, businesses, mapData]);

  const handleMarkerClick = useCallback((businessId: string) => {
    setSelectedBusinessId(businessId);
    setHighlightedBusinessId(businessId);
    
    // Scroll to the business card in the list
    // Use requestAnimationFrame to ensure DOM is ready (fixes iPad Safari timing)
    requestAnimationFrame(() => {
      const element = document.getElementById(`business-${businessId}`);
      if (element) {
        // Find the nearest scroll container (Radix ScrollArea viewport)
        const scrollContainer = element.closest('[data-radix-scroll-area-viewport]') || listRef.current;
        if (scrollContainer) {
          const containerRect = scrollContainer.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();
          const offsetTop = elementRect.top - containerRect.top + scrollContainer.scrollTop;
          scrollContainer.scrollTo({
            top: offsetTop - containerRect.height / 2 + elementRect.height / 2,
            behavior: 'smooth',
          });
        } else {
          // Fallback
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }, []);

  const handleCardHover = useCallback((businessId: string | null) => {
    setHighlightedBusinessId(businessId);
  }, []);

  const handleCardClick = useCallback((businessId: string) => {
    onSelectBusiness?.(businessId);
  }, [onSelectBusiness]);

  const handleViewBusiness = useCallback((businessId: string) => {
    navigate(`/business/${businessId}`);
  }, [navigate]);

  // Mobile / tablet view with floating map button
  if (usesMobileLayout) {
    return (
      <>
        {/* Business list */}
        <div className="space-y-3">
          {businesses.map((business, index) => {
            const firstChar = business.name.charAt(0).toUpperCase();
            const letter = /[A-Z]/.test(firstChar) ? firstChar : '#';
            const isNewLetter = index === 0 || (() => {
              const prevChar = businesses[index - 1].name.charAt(0).toUpperCase();
              const prevLetter = /[A-Z]/.test(prevChar) ? prevChar : '#';
              return prevLetter !== letter;
            })();
            return (
              <div key={business.id} {...(isNewLetter ? { 'data-letter-group': letter } : {})}>
                <CompactBusinessCard
                  business={business}
                  isHighlighted={highlightedBusinessId === business.id}
                  onHover={handleCardHover}
                  onClick={handleCardClick}
                />
              </div>
            );
          })}
        </div>

        {/* Floating Map Button */}
        <motion.button
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => setShowMobileMap(true)}
          className={cn(
            'fixed bottom-6 left-1/2 -translate-x-1/2 z-40',
            'flex items-center gap-2 px-6 py-3 rounded-full',
            'bg-mansagold text-black font-semibold shadow-lg shadow-mansagold/25',
            'hover:bg-mansagold/90 active:scale-95 transition-all'
          )}
        >
          <Map className="w-5 h-5" />
          <span>Show Map</span>
        </motion.button>

        {/* Mobile Map Sheet */}
        <MobileMapSheet
          isOpen={showMobileMap}
          onClose={() => setShowMobileMap(false)}
          businesses={businesses}
          mapData={mapData}
          userLocation={userLocation}
          mapApiKey={mapApiKey}
          onSelectBusiness={handleCardClick}
          highlightedBusinessId={highlightedBusinessId}
          onMarkerClick={handleMarkerClick}
        />
      </>
    );
  }

  // Desktop split view
  return (
    <div className="relative">
      {/* Toggle button */}
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSplitView(!showSplitView)}
          className="bg-slate-800/50 border-white/10 hover:bg-slate-800 hover:border-mansagold/30 text-white"
        >
          {showSplitView ? (
            <>
              <List className="w-4 h-4 mr-2" />
              List Only
            </>
          ) : (
            <>
              <Map className="w-4 h-4 mr-2" />
              Show Map
            </>
          )}
        </Button>
      </div>

      {showSplitView ? (
        <div className="flex gap-4 lg:gap-6 h-[600px]">
          {/* Left Panel - Scrollable Business List */}
          <div className="w-[340px] ipad:w-[400px] lg:w-[440px] flex-shrink-0">
            <ScrollArea className="h-full rounded-xl border border-white/5 bg-slate-900/30 backdrop-blur-sm">
              <div ref={listRef} className="p-4 space-y-3">
                <div className="flex items-center justify-between mb-4 sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10 py-2 -mt-2 -mx-4 px-4">
                  <h3 className="text-sm font-medium text-gray-400">
                    {businesses.length} businesses
                  </h3>
                </div>
                
                {businesses.map((business, index) => {
                  const firstChar = business.name.charAt(0).toUpperCase();
                  const letter = /[A-Z]/.test(firstChar) ? firstChar : '#';
                  const isNewLetter = index === 0 || (() => {
                    const prevChar = businesses[index - 1].name.charAt(0).toUpperCase();
                    const prevLetter = /[A-Z]/.test(prevChar) ? prevChar : '#';
                    return prevLetter !== letter;
                  })();
                  return (
                    <div key={business.id} {...(isNewLetter ? { 'data-letter-group': letter } : {})}>
                      <CompactBusinessCard
                        business={business}
                        isHighlighted={highlightedBusinessId === business.id}
                        onHover={handleCardHover}
                        onClick={handleCardClick}
                      />
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel - Map */}
          <div className="flex-1 rounded-xl overflow-hidden border border-white/5 relative">
            <MapboxMap
              apiKey={mapApiKey}
              userLocation={userLocation}
              businesses={mapData}
              onBusinessClick={handleMarkerClick}
              highlightedBusinessId={highlightedBusinessId}
              onMarkerHover={handleCardHover}
              flyToOnClick
            />
            
            {/* Map overlay gradient at top */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-slate-900/40 to-transparent pointer-events-none z-10" />

            {/* Selected Business Info Panel - appears when a dot is clicked */}
            <AnimatePresence>
              {selectedBusiness && (
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="absolute bottom-4 left-4 right-4 z-20"
                >
                  <div className="bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-2xl">
                    {/* Close button */}
                    <button
                      onClick={() => setSelectedBusinessId(null)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>

                    <div className="flex gap-4">
                      {/* Image / initials fallback */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-mansagold/30 to-mansablue/30 border border-white/10 flex items-center justify-center">
                        {(selectedBusiness.imageUrl || selectedBusiness.logoUrl) ? (
                          <img
                            src={selectedBusiness.imageUrl || selectedBusiness.logoUrl}
                            alt={selectedBusiness.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Hide broken image so the initials fallback shows
                              (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <span className="text-mansagold text-xl font-bold">
                            {selectedBusiness.name
                              ?.split(' ')
                              .filter(Boolean)
                              .slice(0, 2)
                              .map((w) => w[0]?.toUpperCase())
                              .join('') || '•'}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-lg truncate">{selectedBusiness.name}</h3>
                        <p className="text-xs text-mansagold font-medium mt-0.5">{selectedBusiness.category}</p>
                        
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-mansagold text-mansagold" />
                            <span className="text-xs text-white">
                              {selectedBusiness.averageRating?.toFixed(1) || selectedBusiness.rating?.toFixed(1) || 'New'}
                            </span>
                          </div>
                          {selectedBusiness.distance && (
                            <div className="flex items-center gap-1 text-gray-400">
                              <MapPin className="w-3 h-3" />
                              <span className="text-xs">{selectedBusiness.distance}</span>
                            </div>
                          )}
                        </div>

                        {selectedBusiness.address && (
                          <p className="text-xs text-gray-400 mt-1 truncate">
                            {selectedBusiness.address}{selectedBusiness.city || selectedBusiness.state ? `, ${[selectedBusiness.city, selectedBusiness.state].filter(Boolean).join(', ')}` : ''}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleViewBusiness(selectedBusiness.id)}
                        className={cn(
                          'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg',
                          'bg-mansagold text-black font-semibold text-sm',
                          'hover:bg-mansagold/90 active:scale-[0.98] transition-all'
                        )}
                      >
                        View Business
                      </button>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${selectedBusiness.name} ${selectedBusiness.address || ''} ${selectedBusiness.city || ''} ${selectedBusiness.state || ''}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg',
                          'bg-white/10 text-white text-sm font-medium',
                          'hover:bg-white/20 active:scale-[0.98] transition-all'
                        )}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Navigation className="w-4 h-4" />
                        Directions
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        // List-only view
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {businesses.map((business) => (
            <CompactBusinessCard
              key={business.id}
              business={business}
              isHighlighted={highlightedBusinessId === business.id}
              onHover={handleCardHover}
              onClick={handleCardClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DirectorySplitView;