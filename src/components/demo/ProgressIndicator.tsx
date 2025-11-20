
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
    <div className="flex items-center gap-4 mb-6 backdrop-blur-xl bg-white/10 p-4 rounded-xl shadow-md border border-white/20">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-blue-300">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span className="text-sm font-bold text-yellow-400">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress 
          value={progress} 
          className="h-3 bg-white/20"
        />
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleAutoPlay}
        className="p-2 border-2 border-white/30 hover:bg-white/10 hover:border-white/40 text-white transition-all duration-300"
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
