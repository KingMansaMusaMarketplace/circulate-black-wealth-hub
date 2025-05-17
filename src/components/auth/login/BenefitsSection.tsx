
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, BadgeDollarSign, Users, TrendingUp } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  return (
    <div className="bg-mansablue/5 p-4 rounded-lg border border-mansablue/10 mb-6">
      <div className="flex items-center mb-2">
        <Badge className="bg-mansagold text-white">Premium Benefits</Badge>
      </div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Join the Mansa Musa Movement</h3>
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
        <div className="flex items-center">
          <MapPin size={12} className="text-mansablue mr-1" />
          <span>Find Black-owned businesses</span>
        </div>
        <div className="flex items-center">
          <BadgeDollarSign size={12} className="text-mansablue mr-1" />
          <span>Exclusive member discounts</span>
        </div>
        <div className="flex items-center">
          <Users size={12} className="text-mansablue mr-1" />
          <span>Community events</span>
        </div>
        <div className="flex items-center">
          <TrendingUp size={12} className="text-mansablue mr-1" />
          <span>Track economic impact</span>
        </div>
      </div>
    </div>
  );
};
