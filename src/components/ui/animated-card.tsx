import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  hoverY?: number;
  delay?: number;
  onClick?: () => void;
}

/**
 * Card with smooth hover animations
 * Scales up and lifts on hover for tactile feedback
 */
export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className,
  hoverScale = 1.02,
  hoverY = -4,
  delay = 0,
  onClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] // Custom easing for premium feel
      }}
      whileHover={{ 
        scale: hoverScale, 
        y: hoverY,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'rounded-xl border bg-card text-card-foreground shadow-sm',
        'transition-shadow duration-300 hover:shadow-lg',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
