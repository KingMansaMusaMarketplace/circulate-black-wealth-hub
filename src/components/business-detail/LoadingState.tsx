
import React from 'react';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';

const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-48 rounded-xl mb-6"></div>
          <div className="bg-gray-200 h-8 w-3/4 rounded mb-4"></div>
          <div className="bg-gray-200 h-4 w-1/2 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-gray-200 h-64 rounded-xl mb-6"></div>
            </div>
            <div>
              <div className="bg-gray-200 h-32 rounded-xl"></div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoadingState;
