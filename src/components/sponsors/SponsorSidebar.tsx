import React, { useState, useEffect, useCallback } from 'react';
import { useFeaturedSponsors } from '@/hooks/useCachedSponsors';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const ROTATION_INTERVAL = 10000; // 10 seconds

const tierBadgeStyles: Record<string, string> = {
  platinum: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
  gold: 'bg-gradient-to-r from-mansagold to-amber-600 text-slate-900',
};

const SponsorSidebar: React.FC = () => {
  const { data: sponsors, isLoading } = useFeaturedSponsors();
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate sponsors
  useEffect(() => {
    if (!sponsors || sponsors.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % sponsors.length);
    }, ROTATION_INTERVAL);
    return () => clearInterval(interval);
  }, [sponsors]);

  // Track impression
  useEffect(() => {
    if (!sponsors || sponsors.length === 0) return;
    const sponsor = sponsors[activeIndex];
    if (sponsor) {
      supabase.rpc('increment_sponsor_impression', {
        p_subscription_id: sponsor.id,
      });
    }
  }, [sponsors, activeIndex]);

  const handleClick = useCallback(async (sponsor: typeof sponsors extends (infer T)[] ? T : never) => {
    if (!sponsor) return;
    await supabase.rpc('increment_sponsor_click', {
      p_subscription_id: sponsor.id,
    });
    if (sponsor.website_url) {
      window.open(sponsor.website_url, '_blank', 'noopener,noreferrer');
    }
  }, []);

  if (isLoading || !sponsors || sponsors.length === 0) return null;

  const activeSponsor = sponsors[activeIndex];
  if (!activeSponsor) return null;

  return (
    <div className="hidden lg:block w-[280px] flex-shrink-0">
      <div className="sticky top-24">
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl overflow-hidden shadow-2xl">
          {/* Sponsored label */}
          <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
            <span className="text-[11px] font-medium tracking-widest uppercase text-gray-500">
              Sponsored
            </span>
            {sponsors.length > 1 && (
              <div className="flex gap-1">
                {sponsors.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={cn(
                      'w-1.5 h-1.5 rounded-full transition-all duration-300',
                      i === activeIndex ? 'bg-mansagold w-4' : 'bg-white/20 hover:bg-white/40'
                    )}
                    aria-label={`Show sponsor ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sponsor card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSponsor.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="p-5 cursor-pointer group"
              onClick={() => handleClick(activeSponsor)}
            >
              {/* Logo */}
              <div className="flex items-center justify-center h-28 mb-4 rounded-xl bg-white/5 border border-white/5 group-hover:border-mansagold/30 transition-colors">
                {activeSponsor.logo_url ? (
                  <img
                    src={activeSponsor.logo_url}
                    alt={activeSponsor.company_name}
                    className="max-h-20 max-w-[200px] object-contain transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-2xl font-bold text-white/80">{activeSponsor.company_name}</span>
                )}
              </div>

              {/* Company name + tier */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white text-sm truncate flex-1 mr-2">
                  {activeSponsor.company_name}
                </h3>
                <span className={cn(
                  'text-[10px] font-bold uppercase px-2 py-0.5 rounded-full tracking-wide',
                  tierBadgeStyles[activeSponsor.tier] || tierBadgeStyles.gold
                )}>
                  {activeSponsor.tier}
                </span>
              </div>

              {/* CTA */}
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-mansagold to-amber-500 text-slate-900 font-semibold text-sm hover:shadow-lg hover:shadow-mansagold/20 transition-all duration-300 group-hover:scale-[1.02]">
                <span>Visit Website</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          </AnimatePresence>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-white/5 text-center">
            <a
              href="/sponsor-pricing"
              className="text-[11px] text-gray-500 hover:text-mansagold transition-colors"
            >
              Become a sponsor →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorSidebar;
