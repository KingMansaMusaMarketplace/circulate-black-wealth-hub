import { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

interface UseCountUpProps {
  end: number;
  duration?: number;
  startOnView?: boolean;
}

export const useCountUp = ({ end, duration = 2000, startOnView = true }: UseCountUpProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if ((!startOnView || isInView) && !hasStarted) {
      setHasStarted(true);
      const startTime = Date.now();
      const endTime = startTime + duration;

      const updateCount = () => {
        const now = Date.now();
        const remaining = endTime - now;

        if (remaining <= 0) {
          setCount(end);
          return;
        }

        const progress = (duration - remaining) / duration;
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(end * easeOutQuart));

        requestAnimationFrame(updateCount);
      };

      requestAnimationFrame(updateCount);
    }
  }, [end, duration, isInView, startOnView, hasStarted]);

  return { count, ref };
};
