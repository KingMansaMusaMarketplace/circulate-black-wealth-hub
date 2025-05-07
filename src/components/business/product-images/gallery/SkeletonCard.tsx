
import React from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  layoutType: 'grid' | 'list';
  index: number;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ layoutType, index }) => {
  return (
    <Card 
      className={cn(
        "animate-pulse", 
        layoutType === 'list' ? 'flex flex-row' : ''
      )}
      style={{ 
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div 
        className={cn(
          "relative overflow-hidden",
          layoutType === 'grid' ? "aspect-video w-full" : "w-24 h-24"
        )}
      >
        <Skeleton className="w-full h-full" />
      </div>
      
      <div className={cn("flex flex-col", layoutType === 'list' && "flex-1")}>
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-[120px]" />
              <Skeleton className="h-4 w-[60px]" />
            </div>
            <Skeleton className="h-6 w-10 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        </div>
        <div className="px-4 pb-4 pt-0 flex justify-end gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </Card>
  );
};

export default SkeletonCard;
