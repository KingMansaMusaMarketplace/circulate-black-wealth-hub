
import { useRef, useCallback } from 'react';

interface UseSwipeGesturesProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  threshold?: number;
}

export const useSwipeGestures = ({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50
}: UseSwipeGesturesProps) => {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    const touch = event.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  }, []);

  const handleTouchEnd = useCallback((event: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) {
      return;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;

    // Check if horizontal swipe is dominant
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  }, [onSwipeLeft, onSwipeRight, threshold]);

  return {
    handleTouchStart,
    handleTouchEnd
  };
};
