import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface OnboardingToggleProps {
  onStartTour: () => void;
}

/**
 * A button that allows users to restart the onboarding tour at any time
 * Place this in your app's header or settings menu
 */
export const OnboardingToggle: React.FC<OnboardingToggleProps> = ({ onStartTour }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onStartTour}
            className="rounded-full"
            aria-label="Start guided tour"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Start guided tour</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
