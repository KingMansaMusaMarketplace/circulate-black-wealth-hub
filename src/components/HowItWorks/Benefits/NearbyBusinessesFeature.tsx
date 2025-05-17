
import React from 'react';
import { MapPin, Navigation, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface NearbyBusinessesFeatureProps {
  isVisible: boolean;
}

const NearbyBusinessesFeature: React.FC<NearbyBusinessesFeatureProps> = ({ isVisible }) => {
  return (
    <motion.div 
      className="bg-mansablue text-white rounded-xl overflow-hidden shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay: 0.5 }}
    >
      <div className="p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-white/20 p-3">
            <Navigation className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Find Nearby Black-Owned Businesses</h3>
            <p className="text-white/80 mb-4">
              Our GPS-powered directory shows you exactly how many Black-owned businesses 
              from the Mansa Musa Marketplace are near your current location.
            </p>
          </div>
        </div>
        
        <div className="mt-4 bg-white/10 rounded-lg p-4">
          <div className="text-sm font-medium mb-3 flex items-center gap-2">
            <Target className="h-4 w-4" /> How It Works:
          </div>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-xs">1</div>
              <span>Enable location services when browsing the directory</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-xs">2</div>
              <span>View businesses sorted by distance from your location</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-xs">3</div>
              <span>See at-a-glance how many businesses are within different distance ranges</span>
            </li>
          </ul>
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-2 text-center text-sm">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="font-bold text-xl mb-1">
              <MapPin className="h-5 w-5 mx-auto mb-1" />
            </div>
            <p>Find businesses under 1 mile away</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="font-bold text-xl mb-1">
              <MapPin className="h-5 w-5 mx-auto mb-1" />
            </div>
            <p>Easily filter by distance ranges</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="font-bold text-xl mb-1">
              <MapPin className="h-5 w-5 mx-auto mb-1" />
            </div>
            <p>Get directions to any business</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NearbyBusinessesFeature;
