
import React from 'react';
import VideoPlayer from '@/components/VideoPlayer';

const MansaMusaVideoSection = () => {
  return (
    <section className="relative py-16 bg-gradient-to-br from-amber-600 via-yellow-600 to-orange-600 overflow-hidden">
      {/* Animated decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-400/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-8">
          <h2 className="heading-md mb-4 inline-block relative bg-gradient-to-r from-yellow-100 via-amber-50 to-orange-100 bg-clip-text text-transparent">
            Who was Mansa Musa?
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-300"></span>
          </h2>
          <p className="text-white/90 max-w-3xl mx-auto mb-8 text-lg font-medium">
            Learn about the legendary African ruler who inspired our marketplace and represents the pinnacle of economic power coupled with community reinvestment.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border-2 border-white/20 shadow-2xl">
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
