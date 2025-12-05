import React from 'react';
import { useCachedSponsors } from '@/hooks/useCachedSponsors';
import { SponsorLogo } from './SponsorLogo';
import { cn } from '@/lib/utils';

interface SponsorLogoGridProps {
  placement: 'homepage' | 'footer' | 'sidebar' | 'directory';
  maxLogos?: number;
  className?: string;
  variant?: 'light' | 'dark';
}

interface Sponsor {
  id: string;
  company_name: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  logo_url?: string;
  website_url?: string;
  display_priority: number;
}

const tierOrder = { platinum: 0, gold: 1, silver: 2, bronze: 3 };

const placementTiers = {
  homepage: ['platinum', 'gold', 'silver', 'bronze'],
  footer: ['platinum', 'gold', 'silver', 'bronze'],
  sidebar: ['platinum', 'gold', 'silver'],
  directory: ['platinum', 'gold'],
};

export const SponsorLogoGrid: React.FC<SponsorLogoGridProps> = ({
  placement,
  maxLogos = 12,
  className,
  variant = 'light',
}) => {
  // Use optimized cached sponsors hook (already filters by is_visible and logo_approved)
  const { data: allSponsors, isLoading } = useCachedSponsors();

  // Filter and sort sponsors based on placement
  const sponsors = React.useMemo(() => {
    if (!allSponsors) return [];
    
    const allowedTiers = placementTiers[placement];
    return allSponsors
      .filter(s => s.logo_url && allowedTiers.includes(s.tier))
      .sort((a, b) => {
        // First sort by display_priority (higher first)
        if (b.display_priority !== a.display_priority) {
          return b.display_priority - a.display_priority;
        }
        // Then by tier
        return tierOrder[a.tier as keyof typeof tierOrder] - tierOrder[b.tier as keyof typeof tierOrder];
      })
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

  const getGridCols = () => {
    switch (placement) {
      case 'sidebar':
        return 'grid-cols-2';
      case 'footer':
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6';
      case 'directory':
        return 'grid-cols-2 md:grid-cols-3';
      default:
        return 'grid-cols-2 md:grid-cols-4';
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="text-center">
        <p className={cn(
          'text-sm',
          variant === 'dark' ? 'text-zinc-400' : 'text-muted-foreground'
        )}>
          Proudly supported by
        </p>
      </div>
      <div className={cn('grid gap-4 md:gap-6 items-center justify-items-center', getGridCols())}>
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