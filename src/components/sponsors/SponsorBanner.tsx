import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const ROTATION_INTERVAL = 8000; // 8 seconds

export const SponsorBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('sponsor-banner-dismissed') === 'true';
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { data: sponsors } = useQuery({
    queryKey: ['featured-sponsors-banner'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('corporate_subscriptions')
        .select('id, company_name, logo_url, website_url, tier')
        .eq('status', 'active')
        .eq('approval_status', 'approved')
        .eq('is_visible', true)
        .in('tier', ['platinum', 'gold'])
        .not('logo_url', 'is', null)
        .order('display_priority', { ascending: false })
        .order('tier', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !dismissed,
    staleTime: 10 * 60 * 1000,
  });

  const sponsorCount = sponsors?.length || 0;

  const nextSponsor = useCallback(() => {
    if (sponsorCount > 1) {
      setCurrentIndex((prev) => (prev + 1) % sponsorCount);
    }
  }, [sponsorCount]);

  const prevSponsor = useCallback(() => {
    if (sponsorCount > 1) {
      setCurrentIndex((prev) => (prev - 1 + sponsorCount) % sponsorCount);
    }
  }, [sponsorCount]);

  useEffect(() => {
    if (isPaused || sponsorCount <= 1) return;
    const timer = setInterval(nextSponsor, ROTATION_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, sponsorCount, nextSponsor]);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('sponsor-banner-dismissed', 'true');
  };

  if (dismissed || !sponsors || sponsors.length === 0) {
    return null;
  }

  const currentSponsor = sponsors[currentIndex];

  return (
    <div
      className="bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-amber-500/10 border-b border-amber-500/20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left nav arrow */}
          {sponsorCount > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={prevSponsor}
              className="shrink-0 h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Sponsor content */}
          <div className="flex items-center gap-4 flex-1 justify-center min-h-[48px]">
            <span className="text-sm text-muted-foreground hidden sm:inline whitespace-nowrap">
              Sponsored by
            </span>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSponsor.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3"
              >
                {currentSponsor.logo_url && (
                  <a
                    href={currentSponsor.website_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    title={`Visit ${currentSponsor.company_name}`}
                    className="flex items-center gap-3 group"
                  >
                    <img
                      src={currentSponsor.logo_url}
                      alt={`${currentSponsor.company_name} logo`}
                      className="h-10 md:h-12 w-auto max-w-[180px] object-contain transition-all duration-300 group-hover:scale-105"
                    />
                    <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors hidden md:inline">
                      {currentSponsor.company_name}
                    </span>
                  </a>
                )}
                {currentSponsor.tier === 'platinum' && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-semibold uppercase tracking-wider">
                    Platinum
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots indicator */}
          {sponsorCount > 1 && (
            <div className="hidden sm:flex items-center gap-1.5">
              {sponsors.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={cn(
                    'w-1.5 h-1.5 rounded-full transition-all duration-300',
                    i === currentIndex
                      ? 'bg-amber-500 w-4'
                      : 'bg-foreground/20 hover:bg-foreground/40'
                  )}
                />
              ))}
            </div>
          )}

          {/* Right nav arrow */}
          {sponsorCount > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={nextSponsor}
              className="shrink-0 h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="shrink-0 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
