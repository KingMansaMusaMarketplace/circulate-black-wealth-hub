import React from 'react';
import { useCachedSponsors } from '@/hooks/useCachedSponsors';
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
  // Use optimized cached sponsors hook
  const { data: allSponsors, isLoading } = useCachedSponsors();

  // Filter and sort sponsors based on placement
  const sponsors = React.useMemo(() => {
    if (!allSponsors) return [];
    
    const allowedTiers = placementTiers[placement];
    return allSponsors
      .filter(s => s.logo_url && allowedTiers.includes(s.tier))
      .sort((a, b) => tierOrder[a.tier as keyof typeof tierOrder] - tierOrder[b.tier as keyof typeof tierOrder])
      .slice(0, maxLogos);
  }, [allSponsors, placement, maxLogos]);

  if (isLoading || !sponsors || sponsors.length === 0) {
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
            tier={sponsor.tier as 'bronze' | 'silver' | 'gold' | 'platinum'}
            size={getSizeForPlacement()}
          />
        ))}
      </div>
    </div>
  );
};
