import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TourStep {
  target: string; // CSS selector for the element to highlight
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void; // Optional action to perform when reaching this step
}

interface OnboardingTourProps {
  steps: TourStep[];
  onComplete: () => void;
  onSkip: () => void;
  tourKey: string; // Unique key for localStorage
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  steps,
  onComplete,
  onSkip,
  tourKey,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  useEffect(() => {
    // Check if tour has been completed
    const hasCompleted = localStorage.getItem(`tour-${tourKey}-completed`);
    if (!hasCompleted) {
      setIsVisible(true);
    }
  }, [tourKey]);

  useEffect(() => {
    if (!isVisible || !step) return;

    // Find and highlight target element
    const updateTargetPosition = () => {
      const target = document.querySelector(step.target);
      if (target) {
        const rect = target.getBoundingClientRect();
        setTargetRect(rect);
        
        // Scroll target into view
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add highlight class
        target.classList.add('onboarding-highlight');
      }
    };

    updateTargetPosition();
    window.addEventListener('resize', updateTargetPosition);
    window.addEventListener('scroll', updateTargetPosition);

    // Execute step action if provided
    if (step.action) {
      step.action();
    }

    return () => {
      // Remove highlight from all elements
      document.querySelectorAll('.onboarding-highlight').forEach(el => {
        el.classList.remove('onboarding-highlight');
      });
      window.removeEventListener('resize', updateTargetPosition);
      window.removeEventListener('scroll', updateTargetPosition);
    };
  }, [currentStep, isVisible, step]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(`tour-${tourKey}-completed`, 'true');
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem(`tour-${tourKey}-completed`, 'true');
    setIsVisible(false);
    onSkip();
  };

  if (!isVisible || !targetRect) return null;

  // Calculate tooltip position
  const getTooltipPosition = () => {
    const position = step.position || 'bottom';
    const padding = 16;
    
    const styles: React.CSSProperties = {
      position: 'fixed',
      zIndex: 9999,
    };

    switch (position) {
      case 'top':
        styles.bottom = `${window.innerHeight - targetRect.top + padding}px`;
        styles.left = `${targetRect.left + targetRect.width / 2}px`;
        styles.transform = 'translateX(-50%)';
        break;
      case 'bottom':
        styles.top = `${targetRect.bottom + padding}px`;
        styles.left = `${targetRect.left + targetRect.width / 2}px`;
        styles.transform = 'translateX(-50%)';
        break;
      case 'left':
        styles.right = `${window.innerWidth - targetRect.left + padding}px`;
        styles.top = `${targetRect.top + targetRect.height / 2}px`;
        styles.transform = 'translateY(-50%)';
        break;
      case 'right':
        styles.left = `${targetRect.right + padding}px`;
        styles.top = `${targetRect.top + targetRect.height / 2}px`;
        styles.transform = 'translateY(-50%)';
        break;
    }

    return styles;
  };

  return (
    <>
      {/* Overlay with spotlight effect */}
      <div 
        className="fixed inset-0 bg-black/50 pointer-events-none"
        style={{ zIndex: 9998 }}
      >
        {/* Spotlight cutout */}
        <div
          className="absolute bg-transparent border-4 border-primary rounded-lg pointer-events-none animate-pulse"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
          }}
        />
      </div>

      {/* Tooltip card */}
      <Card 
        className="w-80 pointer-events-auto shadow-2xl animate-in fade-in slide-in-from-bottom-4"
        style={getTooltipPosition()}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">{step.title}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 -mt-1"
              onClick={handleSkip}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Progress value={progress} className="h-1.5" />
        </CardHeader>

        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground">{step.description}</p>
        </CardContent>

        <CardFooter className="flex justify-between pt-3">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button size="sm" onClick={handleNext}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button size="sm" onClick={handleComplete}>
                <Check className="h-4 w-4 mr-1" />
                Finish
              </Button>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            {currentStep + 1} of {steps.length}
          </div>
        </CardFooter>
      </Card>
    </>
  );
};
