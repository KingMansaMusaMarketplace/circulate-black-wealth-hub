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
        .select('company_name, website_url, tier')
        .eq('status', 'active')
        .in('tier', ['platinum', 'gold'])
        .order('tier', { ascending: true })
        .limit(1)
        .single();

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
    <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">
            This platform is powered by {featuredSponsor.company_name}
          </span>
          {featuredSponsor.website_url && (
            <a
              href={featuredSponsor.website_url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="text-primary hover:underline"
            >
              Learn more →
            </a>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDismiss}
          className="h-6 w-6"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
