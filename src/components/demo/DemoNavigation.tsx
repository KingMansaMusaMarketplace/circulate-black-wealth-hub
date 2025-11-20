
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
      <div className="flex space-x-2 backdrop-blur-xl bg-white/10 rounded-xl p-2 shadow-lg border-2 border-white/20">
        {demoSteps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => handleStepClick(index)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
              activeDemo === index
                ? 'bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-slate-900 shadow-md scale-105'
                : 'text-white/80 hover:text-white hover:bg-white/10'
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
