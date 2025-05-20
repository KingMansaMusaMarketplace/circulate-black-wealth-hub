
import React from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import SocialShareButtons from '@/components/common/SocialShareButtons';

const SponsorshipVideoSection = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Why Invest in Black Businesses?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn why corporate investment in Black businesses creates both social impact and economic returns.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl overflow-hidden shadow-xl">
            <VideoPlayer 
              src="dLnbDprZDfE" 
              title="The Business Case for Supporting Black Businesses" 
              description="This video explores why investing in Black businesses is not just a social good but makes strong business sense."
              uploadDate="2021-08-23"
              isYouTube={true}
              posterImage="https://img.youtube.com/vi/dLnbDprZDfE/maxresdefault.jpg"
              className="aspect-video"
            />
          </div>
          
          <div className="mt-8 flex flex-col items-center">
            <p className="mb-6 text-gray-700 text-center max-w-2xl">
              Corporate partnerships with Black businesses and marketplaces like Mansa Musa create mutual value while driving economic equity.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                onClick={() => document.getElementById('sponsorship-form')?.scrollIntoView({behavior: 'smooth'})}
                className="bg-mansablue hover:bg-mansablue-dark text-white gap-2"
              >
                Become a Partner <ArrowRight className="h-4 w-4" />
              </Button>
              
              <div className="mt-2">
                <SocialShareButtons 
                  title="The Business Case for Supporting Black Businesses" 
                  text="Learn why corporate investment in Black businesses creates both social impact and economic returns."
                  url={window.location.href}
                  showLabels={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorshipVideoSection;
