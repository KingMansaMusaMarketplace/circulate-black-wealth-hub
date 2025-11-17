
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
  onPauseAutoPlay?: () => void;
}

const DemoContent = ({ 
  demoSteps, 
  activeDemo, 
  nextDemo, 
  prevDemo, 
  onPauseAutoPlay 
}: DemoContentProps) => {
  const handleNext = () => {
    nextDemo();
    onPauseAutoPlay?.();
  };

  const handlePrev = () => {
    prevDemo();
    onPauseAutoPlay?.();
  };

  return (
    <div className="order-2 lg:order-1">
      <div className="mb-6">
        <Badge className="mb-4 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-600 text-white font-bold px-4 py-1 text-sm shadow-md">
          Step {activeDemo + 1} of {demoSteps.length}
        </Badge>
        <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-mansablue via-purple-600 to-mansablue-dark bg-clip-text text-transparent">
          {demoSteps[activeDemo].title}
        </h3>
        <p className="text-lg text-gray-700 mb-6 font-medium">
          {demoSteps[activeDemo].description}
        </p>
      </div>

      {/* Features List */}
      <div className="space-y-3 mb-8">
        {demoSteps[activeDemo].features.map((feature, index) => (
          <div key={index} className="flex items-center group">
            <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-mansagold to-orange-500 rounded-full flex items-center justify-center mr-3 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Star className="w-3 h-3 text-white fill-white" />
            </div>
            <span className="text-gray-700 font-medium">{feature}</span>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <Button
          onClick={handlePrev}
          variant="outline"
          className="flex items-center gap-2 border-2 border-purple-300 hover:bg-purple-50 hover:border-purple-400 font-semibold transition-all duration-300"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <div className="flex space-x-2">
          {demoSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeDemo === index ? 'bg-gradient-to-r from-mansagold to-orange-500 w-8' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          className="flex items-center gap-2 bg-gradient-to-r from-mansagold via-amber-500 to-orange-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-500 font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default DemoContent;
