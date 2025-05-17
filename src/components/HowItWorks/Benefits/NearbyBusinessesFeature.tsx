
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NearbyBusinessesFeature = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-full md:w-1/2">
          <div className="text-xl font-semibold text-mansablue mb-3 flex items-center">
            <MapPin className="mr-2 text-mansagold" /> Find Nearby Black-Owned Businesses
          </div>
          <p className="text-gray-600 mb-4">
            Discover local Black-owned businesses right in your neighborhood. Our interactive map 
            helps you locate, support, and engage with businesses around you.
          </p>
          <ul className="mb-4 space-y-2">
            <li className="flex items-start">
              <div className="bg-mansablue/10 p-1 rounded mr-2 mt-0.5">
                <MapPin size={14} className="text-mansablue" />
              </div>
              <span className="text-sm text-gray-600">Find businesses within your selected radius</span>
            </li>
            <li className="flex items-start">
              <div className="bg-mansablue/10 p-1 rounded mr-2 mt-0.5">
                <MapPin size={14} className="text-mansablue" />
              </div>
              <span className="text-sm text-gray-600">Get instant distance calculations</span>
            </li>
            <li className="flex items-start">
              <div className="bg-mansablue/10 p-1 rounded mr-2 mt-0.5">
                <MapPin size={14} className="text-mansablue" />
              </div>
              <span className="text-sm text-gray-600">Navigate directly to business locations</span>
            </li>
          </ul>
          <Link to="/directory">
            <Button className="bg-mansablue hover:bg-mansablue-dark text-white">
              Explore Directory <ArrowRight size={16} className="ml-1" />
            </Button>
          </Link>
        </div>
        <div className="w-full md:w-1/2 bg-slate-50 rounded-lg p-4">
          <div className="aspect-[4/3] bg-slate-100 rounded relative overflow-hidden border border-gray-200">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="max-w-[90%] w-full">
                <div className="bg-white shadow-md rounded-lg p-3 mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <MapPin size={18} className="text-mansablue mr-2" />
                      <span className="font-medium text-sm">Nearby Businesses</span>
                    </div>
                    <span className="bg-mansablue/10 text-mansablue text-xs px-2 py-1 rounded-full">3 found</span>
                  </div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex justify-between items-center bg-slate-50 p-2 rounded">
                        <span className="text-xs font-medium">Business Name {i}</span>
                        <span className="text-xs text-gray-500">{i * 0.5} miles</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-4 bg-mansagold/20 rounded-full overflow-hidden">
                  <div className="h-full bg-mansagold w-3/4 rounded-full"></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>Your location</span>
                  <span className="text-mansagold">Scan radius: 5 miles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyBusinessesFeature;
