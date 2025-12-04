import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface HelpTooltipProps {
  content: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({ content, side = 'top', children }) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          className="max-w-xs bg-slate-900 border-yellow-500/30 text-white"
        >
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface FeatureHelpBadgeProps {
  tooltip: string;
}

export const FeatureHelpBadge: React.FC<FeatureHelpBadgeProps> = ({ tooltip }) => {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-500/20 hover:bg-blue-500/30 transition-colors">
            <Info className="h-2.5 w-2.5 text-blue-400" />
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-xs bg-slate-900 border-blue-500/30 text-white"
        >
          <p className="text-sm">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HelpTooltip;
