import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import GlobalReachBanner from './GlobalReachBanner';
import earthImage from '@/assets/earth.png';

interface DirectoryHeroProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const DirectoryHero: React.FC<DirectoryHeroProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-16 md:py-24 relative overflow-hidden border-b border-white/10">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.08),transparent_50%)]" />
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-mansablue via-blue-500 to-mansagold"></div>
      
      <div className="container mx-auto text-center relative z-10 px-4 animate-fade-in">
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg flex items-center justify-center gap-4 flex-wrap">
          <span className="font-mono tracking-wider bg-gradient-to-r from-mansagold via-amber-400 to-orange-400 bg-clip-text text-transparent">1325.AI</span> Business Directory
          <img 
            src={earthImage} 
            alt="Global Network" 
            className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 drop-shadow-[0_0_15px_rgba(255,193,7,0.5)] rounded-full" 
          />
        </h1>
        <p className="font-body text-xl sm:text-2xl text-slate-300 leading-relaxed max-w-4xl mx-auto mb-4 font-medium">
          The Economic Operating System for Black-Owned Businesses
        </p>
        <p className="font-body text-base sm:text-lg text-slate-400 max-w-3xl mx-auto mb-6">
          Verified • Curated • Community-Powered
        </p>
        
        <div className="mb-10">
          <GlobalReachBanner />
        </div>
        
        <div className="relative max-w-2xl mx-auto" data-tour="search-businesses">
          <div className="absolute inset-0 bg-gradient-to-r from-mansablue/30 via-blue-500/30 to-mansagold/30 rounded-3xl blur-xl"></div>
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-mansagold" />
            <Input
              type="text" 
              placeholder="Search businesses across all cities... 🔍"
              className="pl-14 h-16 rounded-3xl w-full text-xl md:text-2xl font-body shadow-2xl bg-slate-800/60 border border-white/10 text-white placeholder:text-slate-400 focus-visible:ring-4 focus-visible:ring-mansagold/50"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectoryHero;
