
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  className,
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const content = (
    <div className={cn(
      "flex flex-col items-center justify-center gap-4",
      fullScreen ? "min-h-screen bg-gradient-to-br from-background via-background to-primary/5" : "p-8",
      "animate-fade-in",
      className
    )}>
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
        <Loader2 className={cn(
          sizeClasses[size], 
          "text-primary animate-spin relative z-10",
          "drop-shadow-glow"
        )} />
      </div>
      {text && (
        <p className={cn(
          textSizeClasses[size], 
          "text-muted-foreground font-body",
          "animate-pulse"
        )}>
          {text}
        </p>
      )}
    </div>
  );

  return content;
};

export default Loading;
