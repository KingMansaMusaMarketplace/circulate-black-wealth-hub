
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
      "flex flex-col items-center justify-center space-y-2",
      fullScreen ? "min-h-screen" : "p-8",
      className
    )}>
      <Loader2 className={cn(sizeClasses[size], "animate-spin text-mansablue")} />
      {text && (
        <p className={cn(textSizeClasses[size], "text-gray-600")}>
          {text}
        </p>
      )}
    </div>
  );

  return content;
};

export default Loading;
