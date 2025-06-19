
import React from 'react';
import { Navbar } from '@/components/navbar';
import Hero from '@/components/Hero';
import HomePageSections from '@/components/HomePage/HomePageSections';

console.log('HomePage.tsx: HomePage component loaded');

const HomePage = () => {
  console.log('HomePage.tsx: HomePage component rendering');
  
  try {
    return (
      <div className="min-h-screen">
        <Navbar />
        <Hero />
        <HomePageSections />
      </div>
    );
  } catch (error) {
    console.error('HomePage.tsx: Error rendering HomePage:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h1>
          <p className="text-gray-600">Please check the console for details.</p>
        </div>
      </div>
    );
  }
};

export default HomePage;
