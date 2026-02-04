import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  index?: number;
  isFeatured?: boolean;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ index = 0, isFeatured = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn(
        "bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden",
        isFeatured && "md:col-span-2 md:row-span-2"
      )}
    >
      {/* Image skeleton */}
      <div className="relative">
        <div className={cn(
          "bg-slate-800 animate-pulse",
          isFeatured ? "aspect-[16/9]" : "aspect-video"
        )}>
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-slate-800 rounded-md w-3/4 animate-pulse" />
            <div className="h-5 bg-slate-800 rounded-full w-20 animate-pulse" />
          </div>
          <div className="h-6 bg-emerald-900/30 rounded-full w-16 animate-pulse" />
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-slate-800 rounded w-full animate-pulse" />
          <div className="h-4 bg-slate-800 rounded w-2/3 animate-pulse" />
        </div>
        
        {/* Address */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-slate-800 rounded animate-pulse" />
          <div className="h-4 bg-slate-800 rounded w-1/2 animate-pulse" />
        </div>
        
        {/* Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-mansagold/30 rounded animate-pulse" />
            <div className="h-4 bg-slate-800 rounded w-20 animate-pulse" />
          </div>
          <div className="h-4 bg-slate-800 rounded w-16 animate-pulse" />
        </div>
        
        {/* Button */}
        <div className="h-10 bg-slate-800 rounded-md w-full animate-pulse mt-4" />
      </div>
    </motion.div>
  );
};

interface SkeletonGridProps {
  count?: number;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Featured skeleton - spans 2 columns */}
      <div className="md:col-span-2 lg:col-span-2 lg:row-span-1">
        <SkeletonCard index={0} isFeatured />
      </div>
      
      {/* Regular skeletons */}
      {Array.from({ length: count - 1 }).map((_, i) => (
        <SkeletonCard key={i} index={i + 1} />
      ))}
    </div>
  );
};

export default SkeletonCard;
