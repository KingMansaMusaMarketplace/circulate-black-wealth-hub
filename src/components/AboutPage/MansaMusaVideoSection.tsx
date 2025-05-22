
import React from 'react';
import VideoPlayer from '@/components/VideoPlayer';

const MansaMusaVideoSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h2 className="heading-md text-mansablue mb-4 inline-block relative">
            Who was Mansa Musa?
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-mansagold"></span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-8">
            Learn about the legendary African ruler who inspired our marketplace and represents the pinnacle of economic power coupled with community reinvestment.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <VideoPlayer 
            src="https://www.youtube.com/watch?v=6DudveUFGRo" 
            title="Who was Mansa Musa?" 
            isYouTube={true}
            className="shadow-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default MansaMusaVideoSection;
