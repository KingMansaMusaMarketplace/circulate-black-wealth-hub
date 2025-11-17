
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, BadgeDollarSign, Users, TrendingUp } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-5 rounded-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] mb-6 overflow-hidden group">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-mansablue/10 via-mansagold/10 to-mansablue/10 bg-[length:200%_100%] animate-[shimmer_4s_linear_infinite]" />
      
      <div className="relative z-10">
        <div className="flex items-center mb-3">
          <Badge className="bg-gradient-to-r from-mansagold via-amber-500 to-amber-600 text-white px-4 py-1.5 font-bold shadow-lg shadow-mansagold/30 animate-fade-in">
            Premium Benefits
          </Badge>
        </div>
        <h3 className="text-base font-bold text-transparent bg-gradient-to-r from-blue-300 via-white to-amber-300 bg-clip-text mb-4 animate-fade-in">
          Join the Mansa Musa Movement
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm font-medium">
          <div className="group/item flex items-center p-2 bg-gradient-to-br from-slate-700/50 to-slate-800/50 hover:from-mansablue/20 hover:to-blue-800/20 rounded-lg border border-white/5 hover:border-mansablue/30 transition-all duration-300">
            <MapPin size={14} className="text-blue-400 mr-2 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
            <span className="text-slate-200">Find Black-owned businesses</span>
          </div>
          <div className="group/item flex items-center p-2 bg-gradient-to-br from-slate-700/50 to-slate-800/50 hover:from-mansagold/20 hover:to-amber-800/20 rounded-lg border border-white/5 hover:border-mansagold/30 transition-all duration-300">
            <BadgeDollarSign size={14} className="text-amber-400 mr-2 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
            <span className="text-slate-200">Exclusive member discounts</span>
          </div>
          <div className="group/item flex items-center p-2 bg-gradient-to-br from-slate-700/50 to-slate-800/50 hover:from-mansablue/20 hover:to-blue-800/20 rounded-lg border border-white/5 hover:border-blue-400/30 transition-all duration-300">
            <Users size={14} className="text-blue-300 mr-2 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
            <span className="text-slate-200">Community events</span>
          </div>
          <div className="group/item flex items-center p-2 bg-gradient-to-br from-slate-700/50 to-slate-800/50 hover:from-mansagold/20 hover:to-amber-800/20 rounded-lg border border-white/5 hover:border-amber-400/30 transition-all duration-300">
            <TrendingUp size={14} className="text-amber-300 mr-2 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
            <span className="text-slate-200">Track economic impact</span>
          </div>
        </div>
      </div>
    </div>
  );
};
