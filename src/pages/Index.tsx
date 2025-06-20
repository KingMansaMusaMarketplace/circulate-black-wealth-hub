
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import Hero from '../components/Hero';

const HomePage = () => {
  const [isReady, setIsReady] = useState(false);

  // Ensure React is properly initialized before rendering components
  useEffect(() => {
    setIsReady(true);
  }, []);

  // Show loading state until React is ready
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-mansablue">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
    </div>
  );
};

export default HomePage;
