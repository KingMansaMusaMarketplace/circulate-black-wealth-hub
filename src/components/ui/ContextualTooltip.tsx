import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Lightbulb } from 'lucide-react';

interface ContextualTooltipProps {
  id: string;
  title: string;
  tip: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'auto';
  children: React.ReactNode;
  delay?: number;
}

export const ContextualTooltip: React.FC<ContextualTooltipProps> = ({
  id,
  title,
  tip,
  position = 'top',
  trigger = 'hover',
  children,
  delay = 500
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showTimeout, setShowTimeout] = useState<NodeJS.Timeout | null>(null);

  // Check if this tooltip has been dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem(`tooltip-dismissed-${id}`);
    setIsDismissed(dismissed === 'true');
  }, [id]);

  // Auto-show logic for first-time users
  useEffect(() => {
    if (trigger === 'auto' && !isDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [trigger, isDismissed, delay]);

  const handleMouseEnter = () => {
    if (trigger === 'hover' && !isDismissed) {
      const timeout = setTimeout(() => {
        setIsVisible(true);
      }, 300);
      setShowTimeout(timeout);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      if (showTimeout) {
        clearTimeout(showTimeout);
        setShowTimeout(null);
      }
      setIsVisible(false);
    }
  };

  const handleClick = () => {
    if (trigger === 'click' && !isDismissed) {
      setIsVisible(!isVisible);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem(`tooltip-dismissed-${id}`, 'true');
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-white';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-white';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-white';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-white';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-white';
    }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
      
      {isVisible && !isDismissed && (
        <div className={`absolute z-50 ${getPositionClasses()}`}>
          <Card className="w-64 bg-white shadow-lg border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-mansagold" />
                  <h4 className="font-semibold text-sm text-gray-900">{title}</h4>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="h-auto p-1 hover:bg-gray-100"
                >
                  <X className="w-3 h-3 text-gray-500" />
                </Button>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{tip}</p>
            </CardContent>
          </Card>
          
          {/* Arrow */}
          <div 
            className={`absolute w-0 h-0 border-4 ${getArrowClasses()}`}
          />
        </div>
      )}
    </div>
  );
};