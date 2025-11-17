
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, BadgeDollarSign, Users, TrendingUp } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 via-slate-50 to-amber-50 p-5 rounded-xl border-2 border-mansablue/30 shadow-md mb-6">
      <div className="flex items-center mb-3">
        <Badge className="bg-gradient-to-r from-mansagold via-amber-500 to-amber-600 text-white px-4 py-1.5 font-bold shadow-md">Premium Benefits</Badge>
      </div>
      <h3 className="text-base font-bold text-transparent bg-gradient-to-r from-mansablue via-blue-700 to-mansagold bg-clip-text mb-3">Join the Mansa Musa Movement</h3>
      <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 font-medium">
        <div className="flex items-center p-2 bg-white/80 rounded-lg">
          <MapPin size={14} className="text-mansablue mr-2 flex-shrink-0" />
          <span>Find Black-owned businesses</span>
        </div>
        <div className="flex items-center p-2 bg-white/80 rounded-lg">
          <BadgeDollarSign size={14} className="text-mansagold mr-2 flex-shrink-0" />
          <span>Exclusive member discounts</span>
        </div>
        <div className="flex items-center p-2 bg-white/80 rounded-lg">
          <Users size={14} className="text-blue-700 mr-2 flex-shrink-0" />
          <span>Community events</span>
        </div>
        <div className="flex items-center p-2 bg-white/80 rounded-lg">
          <TrendingUp size={14} className="text-amber-600 mr-2 flex-shrink-0" />
          <span>Track economic impact</span>
        </div>
      </div>
    </div>
  );
};
