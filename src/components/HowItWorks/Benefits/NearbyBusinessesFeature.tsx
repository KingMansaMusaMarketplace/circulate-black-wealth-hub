
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Smartphone, BadgeDollarSign, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface NearbyBusinessesFeatureProps {
  isVisible?: boolean;
}

const NearbyBusinessesFeature: React.FC<NearbyBusinessesFeatureProps> = ({ isVisible = true }) => {
  return (
    <motion.div 
      className="bg-white rounded-xl p-6 shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <Badge className="bg-mansablue text-white mb-4">Core Feature</Badge>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-full md:w-1/2">
          <div className="text-xl font-semibold text-mansablue mb-3 flex items-center">
            <MapPin className="mr-2 text-mansagold" /> Find Nearby Black-Owned Businesses
          </div>
          <p className="text-gray-600 mb-4">
            Discover and support local Black-owned businesses in your neighborhood. Our interactive map 
            helps you locate, engage with, and directly contribute to wealth circulation in your community.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-mansablue/5 p-4 rounded-lg border border-mansablue/10">
              <div className="flex items-center mb-2">
                <MapPin size={18} className="text-mansablue mr-2" />
                <h4 className="font-medium">Location-Based</h4>
              </div>
              <p className="text-sm text-gray-600">Find businesses within your selected radius and get distance calculations</p>
            </div>
            <div className="bg-mansablue/5 p-4 rounded-lg border border-mansablue/10">
              <div className="flex items-center mb-2">
                <BadgeDollarSign size={18} className="text-mansablue mr-2" />
                <h4 className="font-medium">Exclusive Discounts</h4>
              </div>
              <p className="text-sm text-gray-600">Scan QR codes for immediate discounts and rewards points</p>
            </div>
            <div className="bg-mansablue/5 p-4 rounded-lg border border-mansablue/10">
              <div className="flex items-center mb-2">
                <Smartphone size={18} className="text-mansablue mr-2" />
                <h4 className="font-medium">Mobile Optimized</h4>
              </div>
              <p className="text-sm text-gray-600">Seamless experience on your mobile device with quick navigation</p>
            </div>
            <div className="bg-mansablue/5 p-4 rounded-lg border border-mansablue/10">
              <div className="flex items-center mb-2">
                <TrendingUp size={18} className="text-mansablue mr-2" />
                <h4 className="font-medium">Economic Impact</h4>
              </div>
              <p className="text-sm text-gray-600">Track your contribution to circulating Black wealth</p>
            </div>
          </div>
          <Link to="/directory">
            <Button className="bg-mansablue hover:bg-mansablue-dark text-white w-full sm:w-auto">
              Explore Business Directory <ArrowRight size={16} className="ml-1" />
            </Button>
          </Link>
        </div>
        <div className="w-full md:w-1/2">
          <div className="relative bg-slate-50 rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="absolute -top-3 -right-3 bg-mansagold text-white text-xs px-2 py-1 rounded-full">
              Mobile App Preview
            </div>
            
            {/* Mobile phone frame */}
            <div className="bg-gray-800 rounded-xl p-3 max-w-xs mx-auto shadow-lg">
              <div className="bg-mansablue/10 rounded-lg overflow-hidden pt-4 pb-10 relative">
                {/* App header */}
                <div className="flex justify-between items-center px-4 mb-3">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-mansablue flex items-center justify-center">
                      <span className="text-white text-xs">M</span>
                    </div>
                    <span className="ml-1 text-xs font-medium">Mansa Musa</span>
                  </div>
                  <div className="text-xs font-medium flex items-center">
                    <MapPin size={12} className="mr-1 text-mansablue" />
                    Near Me
                  </div>
                </div>
                
                {/* Map visualization */}
                <div className="h-32 bg-white/80 mb-3 relative overflow-hidden">
                  {/* Simplified map */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="absolute top-1/2 left-1/4 w-4 h-4 rounded-full bg-mansagold border-2 border-white shadow-sm"></div>
                    <div className="absolute top-1/4 right-1/3 w-3 h-3 rounded-full bg-mansablue border-2 border-white shadow-sm"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-3 h-3 rounded-full bg-mansablue border-2 border-white shadow-sm"></div>
                    {/* Roads */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300"></div>
                    <div className="absolute top-0 bottom-0 left-1/3 w-0.5 bg-gray-300"></div>
                  </div>
                  {/* User location */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping absolute"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full relative z-10"></div>
                  </div>
                  {/* Radius circle */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border-2 border-mansagold/40"></div>
                </div>
                
                {/* Business listings */}
                <div className="px-3">
                  <div className="bg-white rounded-lg shadow-sm p-2 mb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-medium">Soul Food Kitchen</h4>
                        <div className="flex items-center text-[10px] text-gray-500">
                          <MapPin size={8} className="mr-0.5" /> 0.3 miles away
                        </div>
                      </div>
                      <Badge className="bg-mansagold/90 text-white text-[10px] px-1.5">15% OFF</Badge>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-2 mb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-medium">Heritage Bookstore</h4>
                        <div className="flex items-center text-[10px] text-gray-500">
                          <MapPin size={8} className="mr-0.5" /> 0.5 miles away
                        </div>
                      </div>
                      <Badge className="bg-mansablue/90 text-white text-[10px] px-1.5">25 PTS</Badge>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-medium">Nubian Wellness Spa</h4>
                        <div className="flex items-center text-[10px] text-gray-500">
                          <MapPin size={8} className="mr-0.5" /> 0.7 miles away
                        </div>
                      </div>
                      <Badge className="bg-green-500/90 text-white text-[10px] px-1.5">POPULAR</Badge>
                    </div>
                  </div>
                </div>
                
                {/* Bottom app navigation */}
                <div className="absolute bottom-0 inset-x-0 h-8 bg-white flex justify-around items-center">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-1 bg-mansablue rounded-full mb-0.5"></div>
                    <div className="w-3 h-3 bg-mansablue rounded-full"></div>
                  </div>
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Mobile app USP */}
            <div className="mt-4 text-center">
              <p className="text-sm font-medium text-mansablue">Scan QR codes to earn points & save money</p>
              <p className="text-xs text-gray-500 mt-1">Download our mobile app for the best experience</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NearbyBusinessesFeature;
