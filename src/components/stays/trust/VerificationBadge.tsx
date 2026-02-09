import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Shield, ShieldCheck, BadgeCheck, UserCheck, MapPin, FileCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export type VerificationType = 'identity' | 'address' | 'background_check' | 'superhost';

interface VerificationBadgeProps {
  type: VerificationType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const BADGE_CONFIG: Record<VerificationType, {
  icon: typeof Shield;
  label: string;
  description: string;
  colorClass: string;
}> = {
  identity: {
    icon: UserCheck,
    label: 'ID Verified',
    description: 'This host has verified their identity with a government-issued ID',
    colorClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  address: {
    icon: MapPin,
    label: 'Address Verified',
    description: 'This host has verified their physical address',
    colorClass: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
  background_check: {
    icon: FileCheck,
    label: 'Background Checked',
    description: 'This host has passed a background check',
    colorClass: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  },
  superhost: {
    icon: ShieldCheck,
    label: 'Superhost',
    description: 'This host has excellent reviews and a proven track record',
    colorClass: 'bg-mansagold/20 text-mansagold border-mansagold/30',
  },
};

const SIZE_CONFIG = {
  sm: { icon: 'w-3 h-3', text: 'text-xs', padding: 'px-1.5 py-0.5' },
  md: { icon: 'w-4 h-4', text: 'text-sm', padding: 'px-2 py-1' },
  lg: { icon: 'w-5 h-5', text: 'text-base', padding: 'px-3 py-1.5' },
};

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  type,
  size = 'md',
  showLabel = true,
  className,
}) => {
  const config = BADGE_CONFIG[type];
  const sizeConfig = SIZE_CONFIG[size];
  const Icon = config.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={cn(
              config.colorClass,
              sizeConfig.padding,
              sizeConfig.text,
              'gap-1 cursor-help',
              className
            )}
          >
            <Icon className={sizeConfig.icon} />
            {showLabel && <span>{config.label}</span>}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p>{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface VerificationBadgesProps {
  badges: VerificationType[];
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const VerificationBadges: React.FC<VerificationBadgesProps> = ({
  badges,
  size = 'sm',
  showLabel = false,
  className,
}) => {
  if (!badges || badges.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {badges.map((badge) => (
        <VerificationBadge key={badge} type={badge} size={size} showLabel={showLabel} />
      ))}
    </div>
  );
};

interface HostTrustScoreProps {
  isVerified: boolean;
  badges?: VerificationType[];
  reviewCount: number;
  averageRating: number;
  className?: string;
}

export const HostTrustScore: React.FC<HostTrustScoreProps> = ({
  isVerified,
  badges = [],
  reviewCount,
  averageRating,
  className,
}) => {
  // Calculate trust score (0-100)
  let score = 0;
  if (isVerified) score += 30;
  score += badges.length * 15; // Up to 45 for 3 badges
  if (reviewCount >= 5) score += 10;
  if (reviewCount >= 10) score += 5;
  if (averageRating >= 4.5) score += 10;
  score = Math.min(score, 100);

  const getTrustLevel = () => {
    if (score >= 80) return { label: 'Excellent', color: 'text-green-400' };
    if (score >= 60) return { label: 'Good', color: 'text-blue-400' };
    if (score >= 40) return { label: 'Fair', color: 'text-yellow-400' };
    return { label: 'New', color: 'text-slate-400' };
  };

  const trustLevel = getTrustLevel();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center gap-1">
        <Shield className={cn('w-4 h-4', trustLevel.color)} />
        <span className={cn('text-sm font-medium', trustLevel.color)}>
          {trustLevel.label}
        </span>
      </div>
      {isVerified && (
        <Badge variant="outline" className="bg-mansagold/20 text-mansagold border-mansagold/30 text-xs">
          <BadgeCheck className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      )}
    </div>
  );
};

export default VerificationBadge;
