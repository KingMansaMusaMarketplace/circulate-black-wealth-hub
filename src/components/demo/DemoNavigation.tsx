
import React from 'react';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
}

interface DemoNavigationProps {
  demoSteps: DemoStep[];
  activeDemo: number;
  setActiveDemo: (index: number) => void;
  onPauseAutoPlay?: () => void;
}

const DemoNavigation = ({ 
  demoSteps, 
  activeDemo, 
  setActiveDemo, 
  onPauseAutoPlay 
}: DemoNavigationProps) => {
  const handleStepClick = (index: number) => {
    setActiveDemo(index);
    onPauseAutoPlay?.();
  };

  return (
    <div className="flex justify-center mb-8">
      <div className="flex space-x-2 bg-white rounded-lg p-1 shadow-sm border">
        {demoSteps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => handleStepClick(index)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeDemo === index
                ? 'bg-mansablue text-white shadow-sm'
                : 'text-gray-600 hover:text-mansablue'
            }`}
          >
            {step.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DemoNavigation;
