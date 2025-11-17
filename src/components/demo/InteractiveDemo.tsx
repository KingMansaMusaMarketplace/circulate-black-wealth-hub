
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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

  const handleSignUpClick = () => {
    navigate('/auth');
  };

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold sm:text-5xl mb-6 bg-gradient-to-r from-mansagold via-amber-500 to-orange-500 bg-clip-text text-transparent animate-fade-in">
            See How It Works
          </h2>
          <p className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-mansablue via-purple-600 to-mansablue-dark bg-clip-text text-transparent max-w-3xl mx-auto mb-6 animate-fade-in">
            Experience the Mansa Musa Marketplace through our interactive demo
          </p>
          
          {/* Interactive Controls Info */}
          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium mb-6">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-purple-200">
              <Keyboard className="w-4 h-4 text-purple-600" />
              <span className="text-gray-700">Use arrow keys to navigate</span>
            </div>
            <div className="flex items-center gap-2 md:hidden bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-blue-200">
              <Hand className="w-4 h-4 text-blue-600" />
              <span className="text-gray-700">Swipe to navigate</span>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-amber-200">
              <Play className="w-4 h-4 text-amber-600" />
              <span className="text-gray-700">Press spacebar to pause/resume</span>
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
            className="bg-gradient-to-r from-mansagold via-amber-500 to-orange-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-500 text-white px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={handleSignUpClick}
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
