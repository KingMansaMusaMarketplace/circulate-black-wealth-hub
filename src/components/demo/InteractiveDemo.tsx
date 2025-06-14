
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Keyboard, Hand } from 'lucide-react';
import DemoNavigation from './DemoNavigation';
import DemoContent from './DemoContent';
import PhoneMockup from './PhoneMockup';
import ProgressIndicator from './ProgressIndicator';
import { demoSteps } from './demoData';
import { useDemoInteractions } from './hooks/useDemoInteractions';
import { useSwipeGestures } from './hooks/useSwipeGestures';

const InteractiveDemo = () => {
  const {
    activeDemo,
    isAutoPlaying,
    isPaused,
    nextDemo,
    prevDemo,
    goToDemo,
    pauseAutoPlay,
    resumeAutoPlay,
    toggleAutoPlay
  } = useDemoInteractions({ totalSteps: demoSteps.length });

  const { handleTouchStart, handleTouchEnd } = useSwipeGestures({
    onSwipeLeft: nextDemo,
    onSwipeRight: prevDemo
  });

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
            See How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Experience the Mansa Musa Marketplace through our interactive demo
          </p>
          
          {/* Interactive Controls Info */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-2">
              <Keyboard className="w-4 h-4" />
              <span>Use arrow keys to navigate</span>
            </div>
            <div className="flex items-center gap-2 md:hidden">
              <Hand className="w-4 h-4" />
              <span>Swipe to navigate</span>
            </div>
            <div className="hidden md:block">
              <span>Press spacebar to pause/resume</span>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator
          currentStep={activeDemo}
          totalSteps={demoSteps.length}
          isAutoPlaying={isAutoPlaying}
          isPaused={isPaused}
          onToggleAutoPlay={toggleAutoPlay}
        />

        {/* Demo Navigation */}
        <DemoNavigation 
          demoSteps={demoSteps} 
          activeDemo={activeDemo} 
          setActiveDemo={goToDemo}
          onPauseAutoPlay={pauseAutoPlay}
        />

        {/* Main Demo Display with Touch Support */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          onMouseEnter={pauseAutoPlay}
          onMouseLeave={resumeAutoPlay}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Demo Content */}
          <DemoContent 
            demoSteps={demoSteps} 
            activeDemo={activeDemo} 
            nextDemo={nextDemo} 
            prevDemo={prevDemo}
            onPauseAutoPlay={pauseAutoPlay}
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
