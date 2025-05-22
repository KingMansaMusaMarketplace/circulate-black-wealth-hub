
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const DirectoryLoadingState: React.FC = () => {
  return (
    <>
      <div className="mb-10">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-4 w-full max-w-2xl mb-2" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
      
      <div className="mb-8">
        <Skeleton className="h-14 w-full mb-6 rounded-lg" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array(8).fill(0).map((_, i) => (
          <div key={i} className="border rounded-xl overflow-hidden">
            <Skeleton className="h-36 w-full" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-3" />
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DirectoryLoadingState;
