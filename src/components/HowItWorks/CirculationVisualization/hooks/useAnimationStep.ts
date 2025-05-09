
import { useState, useEffect } from 'react';

interface UseAnimationStepProps {
  isVisible: boolean;
  steps?: number;
  interval?: number;
}

export const useAnimationStep = ({
  isVisible,
  steps = 4,
  interval = 2000
}: UseAnimationStepProps) => {
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isVisible) {
      // Start the animation sequence when component becomes visible
      timer = setInterval(() => {
        setAnimationStep((prev) => (prev + 1) % steps);
      }, interval);
      
      return () => clearInterval(timer);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isVisible, steps, interval]);

  return animationStep;
};

export default useAnimationStep;
