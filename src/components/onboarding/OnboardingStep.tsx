import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Check } from 'lucide-react';

interface OnboardingStepProps {
  title: string;
  description: string;
  illustration: React.ComponentType<any>;
  features: string[];
  stepNumber: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onComplete: () => void;
  isLastStep: boolean;
  action?: {
    text: string;
    href?: string;
  };
}

export const OnboardingStep: React.FC<OnboardingStepProps> = ({
  title,
  description,
  illustration: Icon,
  features,
  stepNumber,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
  onComplete,
  isLastStep,
  action
}) => {
  const handleActionClick = () => {
    if (action?.href) {
      // If there's an action link, navigate to it
      window.location.href = action.href;
    }
    
    if (isLastStep) {
      onComplete();
    } else {
      onNext();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg mx-auto bg-white">
        <CardContent className="p-6 text-center">
          {/* Progress indicator */}
          <div className="flex justify-center mb-6">
            <Badge variant="secondary" className="px-3 py-1">
              Step {stepNumber} of {totalSteps}
            </Badge>
          </div>

          {/* Illustration */}
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-mansablue to-mansagold rounded-full flex items-center justify-center">
              <Icon className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {title}
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              {description}
            </p>

            {/* Features list */}
            <div className="space-y-3 text-left">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-mansablue to-mansagold h-2 rounded-full transition-all duration-300"
                style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 justify-between">
            <div className="flex gap-2">
              {stepNumber > 1 && (
                <Button variant="outline" onClick={onPrev}>
                  Back
                </Button>
              )}
              <Button variant="ghost" onClick={onSkip} className="text-gray-500">
                Skip Tour
              </Button>
            </div>
            
            <Button 
              onClick={handleActionClick}
              className="bg-gradient-to-r from-mansablue to-mansagold hover:from-mansablue-dark hover:to-mansagold-dark text-white"
            >
              {isLastStep ? 'Get Started!' : action?.text || 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};