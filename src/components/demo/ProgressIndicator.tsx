
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  isAutoPlaying: boolean;
  isPaused: boolean;
  onToggleAutoPlay: () => void;
}

const ProgressIndicator = ({
  currentStep,
  totalSteps,
  isAutoPlaying,
  isPaused,
  onToggleAutoPlay
}: ProgressIndicatorProps) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span className="text-sm font-medium text-mansablue">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress 
          value={progress} 
          className="h-2"
        />
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleAutoPlay}
        className="p-2"
        title={isAutoPlaying ? 'Pause auto-play' : 'Resume auto-play'}
      >
        {isAutoPlaying && !isPaused ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};

export default ProgressIndicator;
