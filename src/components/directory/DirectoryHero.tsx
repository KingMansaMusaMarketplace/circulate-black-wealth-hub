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
    <div className="bg-black py-16 md:py-24 relative overflow-hidden border-b border-white/10">
      {/* Single subtle radial accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,179,0,0.06),transparent_60%)]" />

      <div className="container mx-auto text-center relative z-10 px-4 animate-fade-in">
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4 flex items-center justify-center gap-4 flex-wrap tracking-tight">
          <span className="font-mono tracking-wider text-mansagold">1325.AI</span>
          <span className="text-white/90">Global Business Directory</span>
          <img
            src={earthImage}
            alt="Global Network"
            className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-full opacity-90"
          />
        </h1>
        <p className="font-body text-lg sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto mb-3">
          The Economic Operating System for Community Businesses
        </p>
        <p className="font-body text-sm sm:text-base text-slate-500 max-w-3xl mx-auto mb-8 tracking-wide">
          Verified · Curated · Community-Powered
        </p>

        <div className="mb-10">
          <GlobalReachBanner />
        </div>

        <div className="relative max-w-2xl mx-auto" data-tour="search-businesses">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-mansagold z-10" />
          <Input
            type="text"
            placeholder="Search businesses across all cities…"
            className="pl-14 h-14 rounded-2xl w-full text-base md:text-lg font-body bg-slate-900/60 border border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-mansagold/50"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default DirectoryHero;
