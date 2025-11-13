
import React from 'react';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="space-y-6">
          <Skeleton className="glass-card h-48 w-full" />
          <Skeleton className="h-8 w-3/4 glass-card" />
          <Skeleton className="h-4 w-1/2 glass-card" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="md:col-span-2 space-y-6">
              <Skeleton className="glass-card h-64 w-full" />
              <Skeleton className="glass-card h-48 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="glass-card h-32 w-full" />
              <Skeleton className="glass-card h-40 w-full" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoadingState;
