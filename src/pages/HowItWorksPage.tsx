
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AudioButton } from '@/components/ui/audio-button';
import { AUDIO_PATHS } from '@/utils/audio';
import { ArrowLeft } from 'lucide-react';

const HowItWorksPage = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Update page title
    document.title = 'How It Works | Mansa Musa Marketplace';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-mansablue to-mansablue-dark flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-3xl font-bold text-mansablue mb-8">How It Works</h1>
        
        <div className="space-y-8">
          <AudioButton 
            audioSrc={AUDIO_PATHS.welcome}
            className="bg-mansablue hover:bg-mansablue-dark text-white px-8 py-6 text-xl w-full"
          >
            Listen to Audio Guide
          </AudioButton>
          
          <Link to="/">
            <Button 
              variant="outline" 
              className="border-mansagold text-mansablue hover:bg-mansagold/10 px-8 py-6 text-xl w-full"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Return to Main Page
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-white/5 blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-60 h-60 rounded-full bg-mansagold/10 blur-3xl"></div>
    </div>
  );
};

export default HowItWorksPage;
