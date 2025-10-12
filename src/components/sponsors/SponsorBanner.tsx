import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SponsorBanner: React.FC = () => {
  const [dismissed, setDismissed] = React.useState(() => {
    return localStorage.getItem('sponsor-banner-dismissed') === 'true';
  });

  const { data: featuredSponsor } = useQuery({
    queryKey: ['featured-sponsor'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('corporate_subscriptions')
        .select('id, company_name, logo_url, website_url, tier')
        .eq('status', 'active')
        .in('tier', ['platinum', 'gold'])
        .not('logo_url', 'is', null)
        .order('tier', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !dismissed,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('sponsor-banner-dismissed', 'true');
  };

  if (dismissed || !featuredSponsor) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Sponsored by
            </span>
            {featuredSponsor.logo_url && (
              <a
                href={featuredSponsor.website_url || '#'}
                target="_blank"
                rel="noopener noreferrer sponsored"
                title={`Visit ${featuredSponsor.company_name}`}
              >
                <img
                  src={featuredSponsor.logo_url}
                  alt={`${featuredSponsor.company_name} logo`}
                  className="h-12 w-auto max-w-[180px] object-contain transition-all duration-300 hover:scale-105"
                />
              </a>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
