
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
      <div className="flex space-x-2 bg-white/90 backdrop-blur-md rounded-xl p-2 shadow-lg border-2 border-gradient-to-r from-purple-200 to-blue-200">
        {demoSteps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => handleStepClick(index)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
              activeDemo === index
                ? 'bg-gradient-to-r from-mansagold via-amber-500 to-orange-500 text-white shadow-md scale-105'
                : 'text-gray-600 hover:text-mansagold hover:bg-amber-50'
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
