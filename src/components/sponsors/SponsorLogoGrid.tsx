import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SponsorLogo } from './SponsorLogo';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface SponsorLogoGridProps {
  placement: 'homepage' | 'footer' | 'sidebar' | 'directory';
  maxLogos?: number;
  className?: string;
}

interface Sponsor {
  id: string;
  company_name: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  logo_url?: string;
  website_url?: string;
}

const tierOrder = { platinum: 0, gold: 1, silver: 2, bronze: 3 };

const placementTiers = {
  homepage: ['platinum', 'gold', 'silver', 'bronze'],
  footer: ['platinum', 'gold', 'silver', 'bronze'],
  sidebar: ['platinum', 'gold', 'silver'],
  directory: ['platinum', 'gold', 'silver'],
};

export const SponsorLogoGrid: React.FC<SponsorLogoGridProps> = ({
  placement,
  maxLogos = 12,
  className,
}) => {
  const { data: sponsors, isLoading } = useQuery({
    queryKey: ['active-sponsors', placement],
    queryFn: async () => {
      const { data: subscriptions, error } = await supabase
        .from('corporate_subscriptions')
        .select('id, company_name, tier, logo_url, website_url')
        .eq('status', 'active')
        .not('logo_url', 'is', null)
        .in('tier', placementTiers[placement]);

      if (error) throw error;

      // Sort by tier
      const sorted = (subscriptions || [])
        .sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier])
        .slice(0, maxLogos) as Sponsor[];

      return sorted;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-6', className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!sponsors || sponsors.length === 0) {
    return null;
  }

  const getSizeForPlacement = () => {
    switch (placement) {
      case 'homepage':
        return 'large';
      case 'sidebar':
        return 'small';
      default:
        return 'medium';
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Proudly supported by</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-items-center">
        {sponsors.map((sponsor) => (
          <SponsorLogo
            key={sponsor.id}
            logoUrl={sponsor.logo_url!}
            companyName={sponsor.company_name}
            websiteUrl={sponsor.website_url}
            tier={sponsor.tier}
            size={getSizeForPlacement()}
          />
        ))}
      </div>
    </div>
  );
};
