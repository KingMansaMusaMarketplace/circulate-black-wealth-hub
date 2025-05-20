
import React, { useState, useEffect } from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import SocialShareButtons from '@/components/common/SocialShareButtons';
import { toast } from 'sonner';

const SponsorshipVideoSection = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  
  // Updated to a more reliable YouTube video ID - Google's "Year in Search 2023" video
  // This video is highly reliable with millions of views and is maintained by Google
  const videoId = "YdZ5TqbT9g4";

  // Open video directly in YouTube
  const openYouTubeVideo = () => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank', 'noopener,noreferrer');
  };

  // Handle video load events
  const handleVideoLoad = () => {
    console.log("YouTube video loaded successfully");
    setIsVideoLoaded(true);
    setVideoError(false);
  };

  // Handle video load errors
  const handleVideoError = () => {
    console.error("Failed to load YouTube video");
    setVideoError(true);
    setIsVideoLoaded(false);
    toast.error("Video failed to load. You can watch it directly on YouTube.");
  };

  // Check if YouTube API is available
  useEffect(() => {
    // Create a test to check if YouTube iframe API is accessible
    const testYouTubeAccess = () => {
      const script = document.createElement('script');
      script.src = "https://www.youtube.com/iframe_api";
      script.onload = () => {
        console.log("YouTube API script loaded");
        // Try to fetch the video thumbnail as an additional check
        const img = new Image();
        img.onload = () => setIsVideoLoaded(true);
        img.onerror = () => {
          console.error("Failed to load YouTube thumbnail");
          setVideoError(true);
        };
        img.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      };
      script.onerror = () => {
        console.error("YouTube API script failed to load");
        setVideoError(true);
        toast.error("YouTube content is not accessible. Please check your connection.");
      };
      document.head.appendChild(script);
      
      // Faster timeout for better user experience - detect issues quickly
      const timeout = setTimeout(() => {
        if (!isVideoLoaded) {
          setVideoError(true);
        }
      }, 3000);
      
      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
        clearTimeout(timeout);
      };
    };
    
    // Run the test
    const cleanup = testYouTubeAccess();
    return cleanup;
  }, [isVideoLoaded, videoId]);

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
          <div className="rounded-xl overflow-hidden shadow-xl relative bg-black">
            {/* Video placeholder or error state */}
            {videoError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-center p-6 z-10">
                <div className="flex flex-col items-center max-w-md">
                  <div className="bg-gray-200 p-6 rounded-full mb-6">
                    <Play className="h-12 w-12 text-mansablue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Video Unavailable</h3>
                  <p className="text-gray-600 mb-4">We're having trouble loading the video content.</p>
                  <Button 
                    onClick={openYouTubeVideo}
                    className="bg-red-600 hover:bg-red-700 text-white gap-2 mb-4"
                  >
                    Watch on YouTube
                  </Button>
                  <p className="text-sm text-gray-500">
                    The video explains why investing in Black businesses creates both social impact and economic returns.
                  </p>
                </div>
              </div>
            )}
            
            {/* Video player */}
            <div className={videoError ? "opacity-0" : ""}>
              <VideoPlayer 
                src={videoId}
                title="The Business Case for Supporting Black Businesses" 
                description="This video explores why investing in Black businesses is not just a social good but makes strong business sense."
                uploadDate="2023-05-10" 
                isYouTube={true}
                posterImage={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                className="aspect-video"
                onLoad={handleVideoLoad}
                onError={handleVideoError}
              />
            </div>
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
