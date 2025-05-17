
import React from 'react';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import FeaturedBusinesses from '../components/FeaturedBusinesses';
import WhySection from '../components/WhySection';
import TestimonialsSection from '../components/TestimonialsSection';
import CTASection from '../components/CTASection';
import VideoPlayer from '../components/VideoPlayer';

const HomePage = () => {
  return (
    <div className="min-h-screen">
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
            {/* Example of a direct MP4 video */}
            <VideoPlayer 
              src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" 
              title="The Future of Black Wealth Circulation" 
              posterImage="/placeholder.svg"
              className="aspect-video"
            />
            <div className="mt-4 text-center text-sm text-gray-500">
              This is a placeholder video. Replace with your actual content.
            </div>
            
            {/* Example of a YouTube video - uncommment to use */}
            {/* 
            <VideoPlayer 
              src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
              title="YouTube Example" 
              className="aspect-video mt-8"
              isYouTube={true}
            />
            <div className="mt-4 text-center text-sm text-gray-500">
              This is a YouTube example. Replace with your actual YouTube URL.
            </div>
            */}
          </div>
        </div>
      </section>
      
      <HowItWorks />
      <WhySection />
      <FeaturedBusinesses />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default HomePage;
