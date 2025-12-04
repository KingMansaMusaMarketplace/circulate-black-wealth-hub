import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface TourStep {
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface OnboardingTourProps {
  onComplete: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const steps: TourStep[] = [
    {
      target: '[data-tour="breadcrumb"]',
      title: 'Navigation Breadcrumbs',
      content: 'Always know where you are in the dashboard. Click to navigate back.',
      position: 'bottom',
    },
    {
      target: '[data-tour="live-counters"]',
      title: 'Live Data Counters',
      content: 'Real-time metrics that update automatically. Watch your platform grow!',
      position: 'bottom',
    },
    {
      target: '[data-tour="health-monitor"]',
      title: 'System Health Monitor',
      content: 'Monitor database, API, and authentication status with live latency.',
      position: 'bottom',
    },
    {
      target: '[data-tour="global-search"]',
      title: 'Global Search',
      content: 'Press "/" to search across users, businesses, and transactions instantly.',
      position: 'bottom',
    },
    {
      target: '[data-tour="command-palette"]',
      title: 'Command Palette',
      content: 'Press ⌘K to access quick commands and navigate anywhere.',
      position: 'bottom',
    },
    {
      target: '[data-tour="notifications"]',
      title: 'Notification Center',
      content: 'Real-time alerts for new users, businesses, and important events.',
      position: 'bottom',
    },
    {
      target: '[data-tour="theme-toggle"]',
      title: 'Theme Toggle',
      content: 'Switch between dark and light mode for your preference.',
      position: 'bottom',
    },
    {
      target: '[data-tour="keyboard-shortcuts"]',
      title: 'Keyboard Shortcuts',
      content: 'Press "?" anytime to see all available keyboard shortcuts.',
      position: 'bottom',
    },
    {
      target: '[data-tour="tabs"]',
      title: 'Dashboard Sections',
      content: 'Navigate between Overview, Users, Businesses, Financials, and more.',
      position: 'bottom',
    },
    {
      target: '[data-tour="fab"]',
      title: 'Quick Actions',
      content: 'Floating button for quick access to AI Dashboard, Verification, and Exports.',
      position: 'left',
    },
  ];

  useEffect(() => {
    const target = document.querySelector(steps[currentStep].target);
    if (target) {
      const rect = target.getBoundingClientRect();
      setTargetRect(rect);
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getTooltipPosition = () => {
    if (!targetRect) return {};
    
    const step = steps[currentStep];
    const padding = 16;
    
    switch (step.position) {
      case 'bottom':
        return {
          top: targetRect.bottom + padding,
          left: Math.max(16, Math.min(targetRect.left, window.innerWidth - 340)),
        };
      case 'top':
        return {
          bottom: window.innerHeight - targetRect.top + padding,
          left: Math.max(16, Math.min(targetRect.left, window.innerWidth - 340)),
        };
      case 'left':
        return {
          top: targetRect.top,
          right: window.innerWidth - targetRect.left + padding,
        };
      case 'right':
        return {
          top: targetRect.top,
          left: targetRect.right + padding,
        };
      default:
        return {};
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-[100]" onClick={onComplete} />
      
      {/* Highlight */}
      {targetRect && (
        <div
          className="fixed z-[101] border-2 border-yellow-400 rounded-lg pointer-events-none animate-pulse"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
          }}
        />
      )}
      
      {/* Tooltip */}
      <div
        className="fixed z-[102] w-80 bg-slate-900 border border-yellow-500/50 rounded-xl shadow-2xl animate-scale-in"
        style={getTooltipPosition()}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span className="text-xs text-yellow-400 font-medium">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <button
              onClick={onComplete}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <h3 className="text-lg font-bold text-white mb-2">
            {steps[currentStep].title}
          </h3>
          <p className="text-blue-200/80 text-sm mb-4">
            {steps[currentStep].content}
          </p>
          
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="text-white/60 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    i === currentStep ? 'bg-yellow-400' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
            
            <Button
              size="sm"
              onClick={handleNext}
              className="bg-yellow-500 text-slate-900 hover:bg-yellow-400"
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
              {currentStep < steps.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnboardingTour;
