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
  const [isVisible, setIsVisible] = useState(false);

  const steps: TourStep[] = [
    {
      target: '[role="tablist"]',
      title: 'Dashboard Navigation',
      content: 'Use these tabs to navigate between different admin sections: Users, Verifications, Agents, Financial reports, and more.',
      position: 'bottom',
    },
    {
      target: '[value="overview"]',
      title: 'Overview Tab',
      content: 'See key metrics at a glance - total users, businesses, and verification status.',
      position: 'bottom',
    },
    {
      target: '[value="users"]',
      title: 'User Management',
      content: 'View and manage all registered users. Search, filter, and take actions on user accounts.',
      position: 'bottom',
    },
    {
      target: '[value="verifications"]',
      title: 'Business Verifications',
      content: 'Review and approve business verification requests. Ensure all businesses meet your standards.',
      position: 'bottom',
    },
    {
      target: '[value="agents"]',
      title: 'Sales Agents',
      content: 'Monitor agent performance, commissions, and referral statistics.',
      position: 'bottom',
    },
    {
      target: '[value="financial"]',
      title: 'Financial Reports',
      content: 'Track revenue, commissions, and financial health of the platform.',
      position: 'bottom',
    },
    {
      target: '[value="ai-tools"]',
      title: 'AI Tools',
      content: 'Access AI-powered analytics, insights, content moderation, and predictive tools.',
      position: 'bottom',
    },
  ];

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    const target = document.querySelector(steps[currentStep].target);
    if (target) {
      const rect = target.getBoundingClientRect();
      setTargetRect(rect);
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // If target not found, try again after a short delay
      const retryTimer = setTimeout(() => {
        const retryTarget = document.querySelector(steps[currentStep].target);
        if (retryTarget) {
          const rect = retryTarget.getBoundingClientRect();
          setTargetRect(rect);
        }
      }, 300);
      return () => clearTimeout(retryTimer);
    }
  }, [currentStep, isVisible]);

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
    if (!targetRect) {
      // Default center position if no target found
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }
    
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

  if (!isVisible) return null;

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
        className="fixed z-[102] w-80 bg-slate-900 border border-yellow-500/50 rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200"
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
