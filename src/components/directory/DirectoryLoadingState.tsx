
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const DirectoryLoadingState: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="mb-10">
        <Skeleton className="h-10 w-64 mb-4 glass-card" />
        <Skeleton className="h-4 w-full max-w-2xl mb-2 glass-card" />
        <Skeleton className="h-4 w-full max-w-xl glass-card" />
      </div>
      
      <div className="mb-8">
        <Skeleton className="h-14 w-full mb-6 rounded-lg glass-card" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array(8).fill(0).map((_, i) => (
          <div 
            key={i} 
            className="glass-card overflow-hidden animate-pulse"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <Skeleton className="h-36 w-full bg-muted/20" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4 bg-muted/30" />
              <Skeleton className="h-4 w-1/2 bg-muted/20" />
              <Skeleton className="h-4 w-full bg-muted/20" />
              <Skeleton className="h-10 w-full bg-muted/30 mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DirectoryLoadingState;
