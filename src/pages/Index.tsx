
import React from 'react';
import { Navbar } from '@/components/navbar';
import Hero from '../components/Hero';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
    </div>
  );
};

export default HomePage;
