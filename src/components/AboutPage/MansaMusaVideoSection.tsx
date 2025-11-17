
import React from 'react';
import VideoPlayer from '@/components/VideoPlayer';

const MansaMusaVideoSection = () => {
  return (
    <section className="relative py-16 bg-gradient-to-br from-mansagold via-amber-600 to-yellow-600 overflow-hidden">
      {/* Animated decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-300/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-200/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-8">
          <h2 className="heading-md mb-4 inline-block relative text-white drop-shadow-lg">
            Who was Mansa Musa?
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-white/80 shadow-md"></span>
          </h2>
          <p className="text-white drop-shadow-md max-w-3xl mx-auto mb-8 text-lg font-medium">
            Learn about the legendary African ruler who inspired our marketplace and represents the pinnacle of economic power coupled with community reinvestment.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border-2 border-white/30 shadow-2xl">
            <VideoPlayer 
              src="https://www.youtube.com/watch?v=6DudveUFGRo" 
              title="Who was Mansa Musa?" 
              isYouTube={true}
              className="rounded-xl overflow-hidden"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MansaMusaVideoSection;
