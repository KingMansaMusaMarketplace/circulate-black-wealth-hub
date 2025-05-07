
import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

type Business = {
  id: number;
  name: string;
  category: string;
  discount: string;
  rating: number;
  reviewCount: number;
  distance: string;
};

interface NearbyBusinessesProps {
  businesses: Business[];
}

const NearbyBusinesses: React.FC<NearbyBusinessesProps> = ({ businesses }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900">Nearby Businesses</h2>
        <Link to="/directory" className="text-mansablue text-sm font-medium hover:underline">
          View All
        </Link>
      </div>

      <div className="relative mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-[18px] w-[18px]"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input 
          type="text" 
          placeholder="Search for a business" 
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {businesses.map(business => (
          <div key={business.id} className="border border-gray-100 rounded-lg p-4 flex items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-gray-500 font-bold text-lg">{business.name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{business.name}</h3>
              <div className="flex items-center text-gray-500 text-xs">
                <span>{business.category}</span>
                <span className="mx-2">•</span>
                <span>{business.distance} miles away</span>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-mansagold font-bold">{business.discount}</span>
              <div className="flex items-center justify-end mt-1">
                <Star size={12} className="text-mansagold fill-mansagold" />
                <span className="text-xs text-gray-500 ml-1">{business.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyBusinesses;
