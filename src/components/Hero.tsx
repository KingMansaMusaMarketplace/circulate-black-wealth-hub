
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="bg-gradient-to-b from-mansablue to-mansablue-dark py-16 md:py-20 relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Large blurred circles for depth */}
        <div className="absolute top-20 left-10 w-80 h-80 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-mansagold/10 blur-3xl"></div>
        
        {/* Smaller decorative elements */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 flex space-x-20">
          <div className="w-2 h-2 rounded-full bg-mansagold/40"></div>
          <div className="w-2 h-2 rounded-full bg-white/20"></div>
          <div className="w-2 h-2 rounded-full bg-mansagold/40"></div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 text-white mb-8 md:mb-0">
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block">Grow your business with</span>
              <span className="block text-mansagold">Mansa Musa Marketplace</span>
            </h1>
            <p className="mt-3 text-base text-white/80 sm:mt-5 sm:text-lg sm:max-w-xl md:mt-5 md:text-xl">
              Connect with customers, offer rewards, and watch your business thrive with our innovative loyalty program platform.
            </p>
            <div className="mt-4 bg-white/10 border border-white/30 rounded-md px-4 py-3">
              <p className="text-sm md:text-base font-medium text-white">
                <span className="font-bold text-mansagold">Special Offer:</span> First month FREE for business owners! 
                <span className="block mt-1">Members only pay $10 per month; Business owners $100 per month</span>
              </p>
            </div>
            <div className="mt-5 sm:mt-8 sm:flex sm:justify-start">
              <div className="rounded-md shadow">
                <Button 
                  onClick={() => navigate('/signup')}
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-mansablue bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10"
                >
                  Get started
                </Button>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <Button 
                  onClick={() => navigate('/directory')}
                  variant="outline"
                  className="w-full flex items-center justify-center px-8 py-3 border border-mansagold text-white bg-mansagold hover:bg-mansagold-dark md:py-4 md:text-lg md:px-10"
                >
                  Find Businesses
                </Button>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="relative max-w-md">
              {/* Decorative elements around image */}
              <div className="absolute -top-4 -left-4 w-full h-full bg-mansagold/20 rounded-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-mansablue-light/30 rounded-xl"></div>
              
              <img
                className="relative z-10 h-56 w-full object-cover sm:h-72 md:h-96 rounded-lg shadow-lg"
                src="https://images.unsplash.com/photo-1573164713712-03790a178651"
                alt="Black business professionals having a meeting in a modern conference room discussing strategy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
