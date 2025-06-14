
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import DemoNavigation from './DemoNavigation';
import DemoContent from './DemoContent';
import PhoneMockup from './PhoneMockup';
import { demoSteps } from './demoData';

const InteractiveDemo = () => {
  const [activeDemo, setActiveDemo] = useState(0);

  const nextDemo = () => {
    setActiveDemo((prev) => (prev + 1) % demoSteps.length);
  };

  const prevDemo = () => {
    setActiveDemo((prev) => (prev - 1 + demoSteps.length) % demoSteps.length);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
            See How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the Mansa Musa Marketplace through our interactive demo
          </p>
        </div>

        {/* Demo Navigation */}
        <DemoNavigation 
          demoSteps={demoSteps} 
          activeDemo={activeDemo} 
          setActiveDemo={setActiveDemo} 
        />

        {/* Main Demo Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Demo Content */}
          <DemoContent 
            demoSteps={demoSteps} 
            activeDemo={activeDemo} 
            nextDemo={nextDemo} 
            prevDemo={prevDemo} 
          />

          {/* Demo Visual */}
          <PhoneMockup 
            demoSteps={demoSteps} 
            activeDemo={activeDemo} 
          />
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-mansablue hover:bg-mansablue-dark text-white px-8 py-4"
          >
            <Play className="w-5 h-5 mr-2" />
            Try It Now - Sign Up Free
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;
