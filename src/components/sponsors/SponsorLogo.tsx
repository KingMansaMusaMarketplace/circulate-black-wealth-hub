import React from 'react';
import { cn } from '@/lib/utils';

interface SponsorLogoProps {
  logoUrl: string;
  companyName: string;
  websiteUrl?: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const sizeClasses = {
  small: 'h-8 w-auto max-w-[120px]',
  medium: 'h-12 w-auto max-w-[180px]',
  large: 'h-16 w-auto max-w-[240px]',
};

const tierClasses = {
  bronze: 'opacity-80 grayscale hover:grayscale-0 hover:opacity-100',
  silver: 'opacity-90 hover:opacity-100',
  gold: 'hover:scale-105',
  platinum: 'hover:scale-110 drop-shadow-lg',
};

export const SponsorLogo: React.FC<SponsorLogoProps> = ({
  logoUrl,
  companyName,
  websiteUrl,
  tier,
  size = 'medium',
  className,
}) => {
  const logoElement = (
    <img
      src={logoUrl}
      alt={`${companyName} logo`}
      className={cn(
        sizeClasses[size],
        tierClasses[tier],
        'object-contain transition-all duration-300',
        className
      )}
      loading="lazy"
    />
  );

  if (websiteUrl) {
    return (
      <a
        href={websiteUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="inline-block"
        title={`Visit ${companyName}`}
      >
        {logoElement}
      </a>
    );
  }

  return logoElement;
};
