
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import WelcomeBanner from './WelcomeBanner';
import { AudioButton } from '@/components/ui/audio-button';
import { AUDIO_PATHS } from '@/utils/audio';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-mansablue to-mansablue-dark text-white py-24 md:py-32">
      {/* Welcome Banner */}
      <WelcomeBanner siteUrl="Circulate Black Wealth Hub" />
      
      {/* Abstract shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-mansablue-light opacity-10"></div>
        <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-mansablue-light opacity-10"></div>
        <div className="absolute top-40 right-10 w-40 h-40 rounded-full bg-mansagold opacity-10"></div>
      </div>
      
      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-8 mb-10 md:mb-0">
            <h1 className="heading-xl mb-6">
              Circulate Black Wealth <span className="text-mansagold">—</span> <br className="hidden md:block" />
              Build Our Future.
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-100 max-w-xl">
              Discover and support Black-owned businesses near you.
              Save money. Earn rewards. Build generational legacy together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button className="bg-mansagold hover:bg-mansagold-dark text-white font-medium text-lg px-8 py-6">
                  Get Early Access
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="outline" className="border-mansagold text-mansagold hover:bg-mansagold/10 hover:text-white font-medium text-lg px-8 py-6">
                  Learn More
                </Button>
              </Link>
            </div>
            
            {/* Audio Button */}
            <div className="mt-4">
              <AudioButton
                audioSrc={AUDIO_PATHS.welcome}
                className="bg-mansablue-light hover:bg-mansablue text-white border border-white/20 font-medium text-lg px-8 py-6"
              >
                Hear Our Story
              </AudioButton>
            </div>
          </div>
          
          {/* Keep the existing right side of the hero */}
          <div className="md:w-1/2 relative">
            <div className="relative bg-white rounded-2xl shadow-xl p-4 max-w-sm mx-auto animate-float">
              <div className="bg-mansablue/10 rounded-xl p-3">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-mansablue flex items-center justify-center">
                      <span className="text-white font-bold text-sm">MM</span>
                    </div>
                    <span className="ml-2 font-medium text-mansablue">Mansa Musa</span>
                  </div>
                  <div className="text-mansablue font-medium">$120 saved</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-gray-800">Loyalty Points</h3>
                    <span className="text-mansagold font-bold">350 pts</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-mansagold h-2.5 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">150 points until your next reward</p>
                </div>
                <div className="mt-4">
                  <h3 className="font-bold text-gray-800 mb-3">Nearby Businesses</h3>
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center bg-white rounded-lg p-3 mb-2 shadow-sm">
                      <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center mr-3">
                        <span className="text-mansablue font-bold text-xs">B{item}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 text-sm">Business Name {item}</h4>
                        <p className="text-xs text-gray-500">0.{item} miles away</p>
                      </div>
                      <span className="text-xs font-medium text-mansablue-light">15% off</span>
                    </div>
                  ))}
                </div>
                <button className="w-full bg-mansablue text-white rounded-lg py-3 mt-4 font-medium">
                  Scan QR Code
                </button>
              </div>
            </div>
            
            {/* QR code floating element */}
            <div className="absolute -top-16 -right-8 w-24 h-24 bg-white rounded-lg shadow-lg p-2 rotate-12 hidden md:block">
              <div className="w-full h-full bg-gray-800 rounded grid grid-cols-4 grid-rows-4 gap-0.5 p-1">
                {Array(16).fill(0).map((_, i) => (
                  <div key={i} className={`${Math.random() > 0.3 ? 'bg-white' : 'bg-transparent'} rounded-sm`}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
