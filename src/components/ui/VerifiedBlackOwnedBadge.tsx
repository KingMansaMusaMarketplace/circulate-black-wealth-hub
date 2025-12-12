import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, Crown, Shield, Clock, AlertTriangle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';

export type BadgeTier = 'basic' | 'verified' | 'certified' | 'premium';
export type BadgeVariant = 'compact' | 'standard' | 'detailed';

interface VerifiedBlackOwnedBadgeProps {
  tier?: BadgeTier;
  variant?: BadgeVariant;
  certificateNumber?: string;
  expiresAt?: string;
  isExpired?: boolean;
  isPending?: boolean;
  className?: string;
  showTooltip?: boolean;
}

const tierConfig = {
  basic: {
    label: 'Listed',
    icon: Shield,
    bgClass: 'bg-muted',
    textClass: 'text-muted-foreground',
    borderClass: 'border-muted-foreground/30',
    description: 'This business is listed on Mansa Musa Marketplace',
  },
  verified: {
    label: 'Verification Pending',
    icon: Clock,
    bgClass: 'bg-amber-500/20',
    textClass: 'text-amber-600 dark:text-amber-400',
    borderClass: 'border-amber-500/30',
    description: 'Verification documents submitted and under review',
  },
  certified: {
    label: 'Certified Black-Owned',
    icon: CheckCircle,
    bgClass: 'bg-gradient-to-r from-emerald-500/20 to-green-500/20',
    textClass: 'text-emerald-500 dark:text-emerald-400',
    borderClass: 'border-emerald-500/50',
    description: 'Verified 51%+ Black-owned business',
  },
  premium: {
    label: 'Premium Certified',
    icon: Crown,
    bgClass: 'bg-gradient-to-r from-amber-500/30 to-yellow-400/30',
    textClass: 'text-amber-800 dark:text-amber-200',
    borderClass: 'border-amber-500/70',
    description: 'Verified Black-owned business with premium membership',
  },
};

const VerifiedBlackOwnedBadge: React.FC<VerifiedBlackOwnedBadgeProps> = ({
  tier = 'basic',
  variant = 'compact',
  certificateNumber,
  expiresAt,
  isExpired = false,
  isPending = false,
  className,
  showTooltip = true,
}) => {
  const config = tierConfig[tier];
  const Icon = isExpired ? AlertTriangle : config.icon;

  // Handle expired state
  const effectiveClasses = isExpired
    ? {
        bgClass: 'bg-red-500/10',
        textClass: 'text-red-600 dark:text-red-400',
        borderClass: 'border-red-500/30',
      }
    : config;

  const formattedExpiry = expiresAt
    ? format(new Date(expiresAt), 'MMM yyyy')
    : null;

  const BadgeContent = () => {
    switch (variant) {
      case 'compact':
        return (
          <div
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
              effectiveClasses.bgClass,
              effectiveClasses.textClass,
              effectiveClasses.borderClass,
              className
            )}
          >
            <Icon className="h-3 w-3" />
            {isExpired ? 'Expired' : tier === 'certified' || tier === 'premium' ? '✓ Certified' : config.label}
          </div>
        );

      case 'standard':
        return (
          <div
            className={cn(
              'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border',
              effectiveClasses.bgClass,
              effectiveClasses.textClass,
              effectiveClasses.borderClass,
              className
            )}
          >
            <Icon className="h-4 w-4" />
            <span>
              {isExpired ? 'Certification Expired' : config.label}
            </span>
            {tier === 'premium' && !isExpired && (
              <Crown className="h-3 w-3 text-amber-500" />
            )}
          </div>
        );

      case 'detailed':
        return (
          <div
            className={cn(
              'inline-flex flex-col gap-1 px-4 py-3 rounded-xl border-2',
              effectiveClasses.bgClass,
              effectiveClasses.borderClass,
              className
            )}
          >
            <div className={cn('flex items-center gap-2', effectiveClasses.textClass)}>
              <Icon className="h-5 w-5" />
              <span className="font-bold text-base">
                {isExpired ? 'Certification Expired' : config.label}
              </span>
              {tier === 'premium' && !isExpired && (
                <Crown className="h-4 w-4 text-amber-500" />
              )}
            </div>
            {certificateNumber && (
              <div className="text-xs text-muted-foreground">
                Certificate: {certificateNumber}
              </div>
            )}
            {formattedExpiry && (
              <div className={cn(
                'text-xs',
                isExpired ? 'text-red-500' : 'text-muted-foreground'
              )}>
                {isExpired ? 'Expired' : 'Valid through'} {formattedExpiry}
              </div>
            )}
          </div>
        );
    }
  };

  if (!showTooltip || variant === 'detailed') {
    return <BadgeContent />;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help">
            <BadgeContent />
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="font-semibold">{config.label}</p>
          <p className="text-xs text-muted-foreground">{config.description}</p>
          {certificateNumber && (
            <p className="text-xs mt-1">Certificate: {certificateNumber}</p>
          )}
          {formattedExpiry && (
            <p className="text-xs">
              {isExpired ? 'Expired' : 'Valid through'}: {formattedExpiry}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VerifiedBlackOwnedBadge;
