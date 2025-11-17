
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
    <div className="flex items-center gap-4 mb-6 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md border border-purple-100">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span className="text-sm font-bold bg-gradient-to-r from-mansagold to-orange-500 bg-clip-text text-transparent">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress 
          value={progress} 
          className="h-3 bg-gradient-to-r from-purple-100 to-blue-100"
        />
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleAutoPlay}
        className="p-2 border-2 border-purple-300 hover:bg-purple-50 hover:border-purple-400 transition-all duration-300"
        title={isAutoPlaying ? 'Pause auto-play' : 'Resume auto-play'}
      >
        {isAutoPlaying && !isPaused ? (
          <Pause className="w-4 h-4 text-purple-600" />
        ) : (
          <Play className="w-4 h-4 text-purple-600" />
        )}
      </Button>
    </div>
  );
};

export default ProgressIndicator;
