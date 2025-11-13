
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-12 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
        <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10 drop-shadow-glow" />
      </div>
    </div>
  );
};

export default LoadingState;
