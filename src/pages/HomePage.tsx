
import React from 'react';
import { Navbar } from '@/components/navbar';
import Hero from '@/components/Hero';
import HomePageSections from '@/components/HomePage/HomePageSections';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <HomePageSections />
    </div>
  );
};

export default HomePage;
