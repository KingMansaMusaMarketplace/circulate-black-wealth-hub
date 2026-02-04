import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Map, List, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Business } from '@/types/business';
import { BusinessLocation } from '@/components/MapView/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import CompactBusinessCard from './CompactBusinessCard';
import MobileMapSheet from './MobileMapSheet';
import MapboxMap from '@/components/MapView/MapboxMap';
import { Button } from '@/components/ui/button';

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
  const [highlightedBusinessId, setHighlightedBusinessId] = useState<string | null>(null);
  const [showMobileMap, setShowMobileMap] = useState(false);
  const [showSplitView, setShowSplitView] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  const handleMarkerClick = useCallback((businessId: string) => {
    setHighlightedBusinessId(businessId);
    
    // Scroll to the business card in the list
    const element = document.getElementById(`business-${businessId}`);
    if (element && listRef.current) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Clear highlight after animation
    setTimeout(() => setHighlightedBusinessId(null), 3000);
  }, []);

  const handleCardHover = useCallback((businessId: string | null) => {
    setHighlightedBusinessId(businessId);
  }, []);

  const handleCardClick = useCallback((businessId: string) => {
    onSelectBusiness?.(businessId);
  }, [onSelectBusiness]);

  // Mobile view with floating map button
  if (isMobile) {
    return (
      <>
        {/* Business list */}
        <div className="space-y-3">
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
        <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 h-[calc(100vh-400px)] min-h-[600px]">
          {/* Left Panel - Scrollable Business List */}
          <div className="relative">
            <ScrollArea className="h-full rounded-xl border border-white/5 bg-slate-900/30 backdrop-blur-sm">
              <div ref={listRef} className="p-4 space-y-3">
                <div className="flex items-center justify-between mb-4 sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10 py-2 -mt-2 -mx-4 px-4">
                  <h3 className="text-sm font-medium text-gray-400">
                    {businesses.length} businesses
                  </h3>
                </div>
                
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
            </ScrollArea>
          </div>

          {/* Right Panel - Sticky Map */}
          <div className="relative rounded-xl overflow-hidden border border-white/5">
            <div className="absolute inset-0">
              <MapboxMap
                apiKey={mapApiKey}
                userLocation={userLocation}
                businesses={mapData}
                onBusinessClick={handleMarkerClick}
                highlightedBusinessId={highlightedBusinessId}
                onMarkerHover={handleCardHover}
              />
            </div>
            
            {/* Map overlay gradient at top */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-900/50 to-transparent pointer-events-none z-10" />
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
