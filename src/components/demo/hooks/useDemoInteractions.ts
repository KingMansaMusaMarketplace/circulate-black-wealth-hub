
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseDemoInteractionsProps {
  totalSteps: number;
  autoPlayInterval?: number;
}

export const useDemoInteractions = ({ 
  totalSteps, 
  autoPlayInterval = 4500 
}: UseDemoInteractionsProps) => {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextDemo = useCallback(() => {
    setActiveDemo((prev) => (prev + 1) % totalSteps);
  }, [totalSteps]);

  const prevDemo = useCallback(() => {
    setActiveDemo((prev) => (prev - 1 + totalSteps) % totalSteps);
  }, [totalSteps]);

  const goToDemo = useCallback((index: number) => {
    setActiveDemo(index);
  }, []);

  const pauseAutoPlay = useCallback(() => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resumeAutoPlay = useCallback(() => {
    setIsPaused(false);
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying(prev => !prev);
  }, []);

  // Auto-play logic
  useEffect(() => {
    if (isAutoPlaying && !isPaused) {
      intervalRef.current = setInterval(nextDemo, autoPlayInterval);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, isPaused, nextDemo, autoPlayInterval]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          prevDemo();
          pauseAutoPlay();
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextDemo();
          pauseAutoPlay();
          break;
        case ' ':
          event.preventDefault();
          toggleAutoPlay();
          break;
        case 'Escape':
          pauseAutoPlay();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextDemo, prevDemo, toggleAutoPlay, pauseAutoPlay]);

  return {
    activeDemo,
    isAutoPlaying,
    isPaused,
    nextDemo,
    prevDemo,
    goToDemo,
    pauseAutoPlay,
    resumeAutoPlay,
    toggleAutoPlay
  };
};
