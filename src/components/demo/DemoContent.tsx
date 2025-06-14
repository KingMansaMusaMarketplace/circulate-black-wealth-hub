
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
}

interface DemoContentProps {
  demoSteps: DemoStep[];
  activeDemo: number;
  nextDemo: () => void;
  prevDemo: () => void;
}

const DemoContent = ({ demoSteps, activeDemo, nextDemo, prevDemo }: DemoContentProps) => {
  return (
    <div className="order-2 lg:order-1">
      <div className="mb-6">
        <Badge className="mb-4 bg-mansagold text-mansablue">
          Step {activeDemo + 1} of {demoSteps.length}
        </Badge>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {demoSteps[activeDemo].title}
        </h3>
        <p className="text-lg text-gray-600 mb-6">
          {demoSteps[activeDemo].description}
        </p>
      </div>

      {/* Features List */}
      <div className="space-y-3 mb-8">
        {demoSteps[activeDemo].features.map((feature, index) => (
          <div key={index} className="flex items-center">
            <div className="flex-shrink-0 w-6 h-6 bg-mansablue rounded-full flex items-center justify-center mr-3">
              <Star className="w-3 h-3 text-white" />
            </div>
            <span className="text-gray-700">{feature}</span>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <Button
          onClick={prevDemo}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <div className="flex space-x-2">
          {demoSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                activeDemo === index ? 'bg-mansablue' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={nextDemo}
          className="flex items-center gap-2 bg-mansablue hover:bg-mansablue-dark"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default DemoContent;
