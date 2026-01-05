import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Star, Sparkles, Zap, ExternalLink } from 'lucide-react';
import type { FoundingSponsor } from './useFoundingMembers';

interface FoundingSponsorCardProps {
  sponsor: FoundingSponsor;
  index: number;
}

const getTierIcon = (tier: string) => {
  switch (tier) {
    case 'platinum': return <Zap className="w-5 h-5" />;
    case 'gold': return <Crown className="w-5 h-5" />;
    case 'silver': return <Sparkles className="w-5 h-5" />;
    default: return <Star className="w-5 h-5" />;
  }
};

const getTierGradient = (tier: string) => {
  switch (tier) {
    case 'platinum': return 'from-violet-400 via-purple-400 to-fuchsia-400';
    case 'gold': return 'from-amber-400 via-yellow-400 to-orange-400';
    case 'silver': return 'from-slate-300 via-slate-200 to-slate-400';
    default: return 'from-amber-600 to-amber-700';
  }
};

const FoundingSponsorCard = ({ sponsor, index }: FoundingSponsorCardProps) => {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <div className={`relative bg-gradient-to-br ${getTierGradient(sponsor.tier)} p-0.5 rounded-2xl`}>
        <div className="bg-slate-900/95 backdrop-blur-xl rounded-[14px] p-6 h-full">
          {/* Tier badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${getTierGradient(sponsor.tier)} text-slate-900 text-xs font-bold uppercase mb-4`}>
            {getTierIcon(sponsor.tier)}
            <span>{sponsor.tier} Founding Sponsor</span>
          </div>

          {/* Logo/Name */}
          <div className="flex items-center gap-4 mb-3">
            {sponsor.logo_url ? (
              <img 
                src={sponsor.logo_url} 
                alt={sponsor.company_name}
                className="w-14 h-14 rounded-xl object-contain bg-white/10 p-2"
              />
            ) : (
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getTierGradient(sponsor.tier)} flex items-center justify-center`}>
                {getTierIcon(sponsor.tier)}
              </div>
            )}
            <div>
              <h3 className="text-white font-bold text-lg group-hover:text-mansagold transition-colors">
                {sponsor.company_name}
              </h3>
              <p className="text-blue-200/60 text-sm">
                Founding Sponsor
              </p>
            </div>
          </div>

          {sponsor.website_url && (
            <div className="flex items-center gap-1 text-mansagold text-sm">
              <ExternalLink className="w-3 h-3" />
              <span>Visit Website</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (sponsor.website_url) {
    return (
      <a href={sponsor.website_url} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return content;
};

export default FoundingSponsorCard;
