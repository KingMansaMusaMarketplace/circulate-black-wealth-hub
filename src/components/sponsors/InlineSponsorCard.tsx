import React, { useEffect, useCallback } from 'react';
import { useFeaturedSponsors } from '@/hooks/useCachedSponsors';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

const tierBadgeStyles: Record<string, string> = {
  platinum: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
  gold: 'bg-gradient-to-r from-mansagold to-amber-600 text-slate-900',
};

const InlineSponsorCard: React.FC<{ className?: string }> = ({ className }) => {
  const { data: sponsors } = useFeaturedSponsors();

  const sponsor = sponsors?.[0];

  // Track impression
  useEffect(() => {
    if (sponsor) {
      supabase.rpc('increment_sponsor_impression', {
        p_subscription_id: sponsor.id,
      });
    }
  }, [sponsor]);

  const handleClick = useCallback(async () => {
    if (!sponsor) return;
    await supabase.rpc('increment_sponsor_click', {
      p_subscription_id: sponsor.id,
    });
    if (sponsor.website_url) {
      window.open(sponsor.website_url, '_blank', 'noopener,noreferrer');
    }
  }, [sponsor]);

  if (!sponsor) return null;

  return (
    <div
      className={cn(
        'lg:hidden rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-sm p-4 cursor-pointer group hover:border-mansagold/30 transition-all',
        className
      )}
      onClick={handleClick}
    >
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
          {sponsor.logo_url ? (
            <img
              src={sponsor.logo_url}
              alt={sponsor.company_name}
              className="max-h-12 max-w-[56px] object-contain"
              loading="lazy"
            />
          ) : (
            <span className="text-sm font-bold text-white/80">{sponsor.company_name?.charAt(0)}</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Sponsored</span>
            <span className={cn(
              'text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full',
              tierBadgeStyles[sponsor.tier] || tierBadgeStyles.gold
            )}>
              {sponsor.tier}
            </span>
          </div>
          <h4 className="text-white font-semibold text-sm truncate">{sponsor.company_name}</h4>
        </div>

        {/* CTA */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-mansagold/20 flex items-center justify-center group-hover:bg-mansagold/30 transition-colors">
            <ExternalLink className="h-3.5 w-3.5 text-mansagold" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InlineSponsorCard;
