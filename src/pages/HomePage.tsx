
import React from 'react';
import Navbar from '@/components/navbar/Navbar';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import FeaturedBusinesses from '../components/FeaturedBusinesses';
import WhySection from '../components/WhySection';
import TestimonialsSection from '../components/TestimonialsSection';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import VideoPlayer from '../components/VideoPlayer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      
      {/* Featured Video Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-mansablue mb-4">See Our Vision in Action</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Watch how Mansa Musa Marketplace is revolutionizing Black wealth circulation
              and empowering communities through economic collaboration.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {/* YouTube video with enhanced SEO */}
            <VideoPlayer 
              src="https://www.youtube.com/watch?v=71FmkfENYDI" 
              title="Mansa Musa Marketplace - Circulating Black Wealth" 
              className="aspect-video shadow-xl rounded-lg"
              isYouTube={true}
              description="Learn how Mansa Musa Marketplace helps circulate wealth within Black communities, creating economic opportunities and building generational wealth."
              uploadDate="2024-05-16"
            />
          </div>
        </div>
      </section>
      
      <HowItWorks />
      <WhySection />
      <FeaturedBusinesses />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default HomePage;
