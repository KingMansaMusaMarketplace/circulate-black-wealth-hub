import { Crown, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface FoundingMemberBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

export function FoundingMemberBadge({ 
  size = 'md', 
  showTooltip = true,
  className 
}: FoundingMemberBadgeProps) {
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
        'bg-gradient-to-r from-mansagold via-amber-400 to-yellow-500 text-slate-900 font-bold border-0',
        'shadow-[0_0_15px_rgba(251,191,36,0.4)] hover:shadow-[0_0_25px_rgba(251,191,36,0.6)]',
        'transition-all duration-300 hover:scale-105 cursor-default',
        'inline-flex items-center',
        sizeClasses[size],
        className
      )}
    >
      <Crown className={cn(iconSizes[size], 'text-slate-900')} />
      <span>Founding Member</span>
      <Sparkles className={cn(iconSizes[size], 'text-slate-900')} />
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
          className="bg-slate-900 text-white border-mansagold/30 max-w-xs"
        >
          <div className="space-y-1">
            <p className="font-semibold text-mansagold">🎉 Founding Member</p>
            <p className="text-sm text-slate-300">
              You joined during our free growth phase! This badge is yours forever as a thank you for being an early supporter.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default FoundingMemberBadge;
