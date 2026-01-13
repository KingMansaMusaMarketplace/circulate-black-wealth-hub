import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2,
  Home,
  Download,
  Presentation,
  Keyboard
} from 'lucide-react';
import PitchSlide1Cover from '@/components/pitch-deck/PitchSlide1Cover';
import PitchSlide2Problem from '@/components/pitch-deck/PitchSlide2Problem';
import PitchSlide3Solution from '@/components/pitch-deck/PitchSlide3Solution';
import PitchSlide4Technology from '@/components/pitch-deck/PitchSlide4Technology';
import PitchSlide5Platform from '@/components/pitch-deck/PitchSlide5Platform';
import PitchSlide6BusinessModel from '@/components/pitch-deck/PitchSlide6BusinessModel';
import PitchSlide7DataMoat from '@/components/pitch-deck/PitchSlide7DataMoat';
import PitchSlide8Competitive from '@/components/pitch-deck/PitchSlide8Competitive';
import PitchSlide9Traction from '@/components/pitch-deck/PitchSlide9Traction';
import PitchSlide10Market from '@/components/pitch-deck/PitchSlide10Market';
import PitchSlide11Vision from '@/components/pitch-deck/PitchSlide11Vision';
import PitchSlide12Team from '@/components/pitch-deck/PitchSlide12Team';
import PitchSlide13Ask from '@/components/pitch-deck/PitchSlide13Ask';
import PitchSlide14Why776 from '@/components/pitch-deck/PitchSlide14Why776';
import { useNavigate } from 'react-router-dom';

const SLIDES = [
  { id: 1, title: 'Cover', component: PitchSlide1Cover },
  { id: 2, title: 'The Problem', component: PitchSlide2Problem },
  { id: 3, title: 'The Solution', component: PitchSlide3Solution },
  { id: 4, title: 'Patent-Pending Tech', component: PitchSlide4Technology },
  { id: 5, title: 'Platform Demo', component: PitchSlide5Platform },
  { id: 6, title: 'Business Model', component: PitchSlide6BusinessModel },
  { id: 7, title: 'The Data Moat', component: PitchSlide7DataMoat },
  { id: 8, title: 'Competitive Edge', component: PitchSlide8Competitive },
  { id: 9, title: 'Traction & Metrics', component: PitchSlide9Traction },
  { id: 10, title: 'Market Opportunity', component: PitchSlide10Market },
  { id: 11, title: 'Vision 2030', component: PitchSlide11Vision },
  { id: 12, title: 'The Team', component: PitchSlide12Team },
  { id: 13, title: 'The Ask', component: PitchSlide13Ask },
  { id: 14, title: 'Why 776?', component: PitchSlide14Why776 },
];

const PitchDeckPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showKeyboardHint, setShowKeyboardHint] = useState(true);
  const navigate = useNavigate();

  const goToNextSlide = useCallback(() => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  }, [currentSlide]);

  const goToPrevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  }, [currentSlide]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goToNextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevSlide();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        }
      } else if (e.key === 'Home') {
        setCurrentSlide(0);
      } else if (e.key === 'End') {
        setCurrentSlide(SLIDES.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextSlide, goToPrevSlide, toggleFullscreen, isFullscreen]);

  // Hide keyboard hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowKeyboardHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const CurrentSlideComponent = SLIDES[currentSlide].component;
  const progress = ((currentSlide + 1) / SLIDES.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-mansablue-dark via-[hsl(210,100%,12%)] to-[hsl(210,100%,8%)] flex flex-col">
      <Helmet>
        <title>Investor Pitch Deck - Mansa Musa Marketplace | 776 Presentation</title>
        <meta name="description" content="Mansa Musa Marketplace investor pitch deck. The economic operating system for the Black business economy." />
      </Helmet>

      {/* Top Navigation Bar */}
      <header className={`bg-black/30 backdrop-blur-sm border-b border-white/10 px-4 py-3 flex items-center justify-between ${isFullscreen ? 'hidden' : ''}`}>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="text-white/70 hover:text-white"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
          <div className="h-4 w-px bg-white/20" />
          <Badge className="bg-mansagold/20 text-mansagold border-mansagold/30">
            <Presentation className="w-3 h-3 mr-1" />
            Investor Pitch Deck
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-white/60 text-sm">
            Slide {currentSlide + 1} of {SLIDES.length}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="text-white/70 hover:text-white"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className={`h-1 bg-white/10 ${isFullscreen ? 'fixed top-0 left-0 right-0 z-50' : ''}`}>
        <motion.div 
          className="h-full bg-gradient-to-r from-mansagold to-mansagold-light"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Main Slide Area */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <CurrentSlideComponent />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="absolute inset-y-0 left-0 flex items-center">
          <Button
            variant="ghost"
            size="lg"
            onClick={goToPrevSlide}
            disabled={currentSlide === 0}
            className="h-24 w-12 rounded-r-xl bg-black/20 hover:bg-black/40 text-white disabled:opacity-20 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>
        </div>

        <div className="absolute inset-y-0 right-0 flex items-center">
          <Button
            variant="ghost"
            size="lg"
            onClick={goToNextSlide}
            disabled={currentSlide === SLIDES.length - 1}
            className="h-24 w-12 rounded-l-xl bg-black/20 hover:bg-black/40 text-white disabled:opacity-20 disabled:pointer-events-none"
          >
            <ChevronRight className="w-8 h-8" />
          </Button>
        </div>

        {/* Keyboard Hint */}
        <AnimatePresence>
          {showKeyboardHint && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 text-white/70 text-sm"
            >
              <Keyboard className="w-4 h-4" />
              Use arrow keys to navigate • Press F for fullscreen
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Slide Navigator */}
      <footer className={`bg-black/30 backdrop-blur-sm border-t border-white/10 px-4 py-3 ${isFullscreen ? 'hidden' : ''}`}>
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(index)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                index === currentSlide
                  ? 'bg-mansagold text-mansablue-dark'
                  : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
              }`}
            >
              {slide.id}. {slide.title}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default PitchDeckPage;
