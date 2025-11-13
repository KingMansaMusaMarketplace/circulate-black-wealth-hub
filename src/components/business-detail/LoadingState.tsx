import React from 'react';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 animate-fade-in">
        <div className="space-y-6">
          {/* Hero image skeleton */}
          <Skeleton className="glass-card h-64 md:h-80 w-full shimmer" />
          
          {/* Title and location */}
          <div className="space-y-3">
            <Skeleton className="h-10 w-3/4 glass-card shimmer" />
            <Skeleton className="h-5 w-1/2 glass-card shimmer" />
          </div>
          
          {/* Content grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {/* Main content */}
            <div className="md:col-span-2 space-y-6">
              <Skeleton className="glass-card h-64 w-full shimmer" />
              <Skeleton className="glass-card h-48 w-full shimmer" />
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <Skeleton className="glass-card h-48 w-full shimmer" />
              <Skeleton className="glass-card h-40 w-full shimmer" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoadingState;