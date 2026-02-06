import React from 'react';
import { GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HBCUBadgeProps {
  variant?: 'default' | 'compact' | 'overlay';
  className?: string;
}

/**
 * HBCU Badge - Displays a gold graduation cap badge for HBCU institutions
 * Use this to identify Historically Black Colleges and Universities in the directory
 */
const HBCUBadge: React.FC<HBCUBadgeProps> = ({ variant = 'default', className }) => {
  if (variant === 'overlay') {
    return (
      <div
        className={cn(
          'absolute top-2 right-2 z-10',
          'flex items-center gap-1 px-2 py-1 rounded-full',
          'bg-mansagold/95 backdrop-blur-sm text-slate-900',
          'text-xs font-bold shadow-lg',
          'ring-1 ring-white/20',
          className
        )}
      >
        <GraduationCap className="h-3.5 w-3.5" />
        <span>HBCU</span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded',
          'bg-mansagold/20 text-mansagold',
          'text-[10px] font-bold',
          className
        )}
      >
        <GraduationCap className="h-2.5 w-2.5" />
        <span>HBCU</span>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-full',
        'bg-mansagold/20 text-mansagold border border-mansagold/30',
        'text-xs font-semibold',
        className
      )}
    >
      <GraduationCap className="h-3 w-3" />
      <span>HBCU</span>
    </div>
  );
};

// Helper function to determine if a business is an HBCU based on category
export const isHBCUCategory = (category: string | undefined | null): boolean => {
  if (!category) return false;
  const hbcuCategories = ['University', 'College', 'Medical School', 'Community College'];
  return hbcuCategories.includes(category);
};

export default HBCUBadge;
