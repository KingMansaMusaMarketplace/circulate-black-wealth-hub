
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(({ 
  className, 
  size = 'md',
  ...rest
}, ref) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-[3px]',
    lg: 'h-12 w-12 border-4'
  };

  return (
    <div ref={ref} className="flex items-center justify-center" {...rest}>
      <div
        className={cn(
          "rounded-full border-border/30 border-t-primary animate-spin",
          "shadow-glow",
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
