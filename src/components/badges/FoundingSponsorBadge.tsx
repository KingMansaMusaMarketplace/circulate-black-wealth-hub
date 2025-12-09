import { Building2, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface FoundingSponsorBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

export function FoundingSponsorBadge({ 
  size = 'md', 
  showTooltip = true,
  className 
}: FoundingSponsorBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const badge = (
    <Badge 
      className={cn(
        'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-white font-bold border-0',
        'shadow-[0_0_15px_rgba(20,184,166,0.4)] hover:shadow-[0_0_25px_rgba(20,184,166,0.6)]',
        'transition-all duration-300 hover:scale-105 cursor-default',
        'inline-flex items-center',
        sizeClasses[size],
        className
      )}
    >
      <Building2 className={cn(iconSizes[size], 'text-white')} />
      <span>Founding Sponsor</span>
      <Star className={cn(iconSizes[size], 'text-white fill-white')} />
    </Badge>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent 
          side="bottom" 
          className="bg-slate-900 text-white border-teal-500/30 max-w-xs"
        >
          <div className="space-y-1">
            <p className="font-semibold text-teal-400">🏆 Founding Sponsor</p>
            <p className="text-sm text-slate-300">
              This business joined during our free growth phase! They'll enjoy special perks and locked-in rates as a thank you for being an early believer.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default FoundingSponsorBadge;
