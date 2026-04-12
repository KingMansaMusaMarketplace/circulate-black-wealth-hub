
import React, { useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';

const YOUTUBE_URL = 'https://www.youtube.com/watch?v=6DudveUFGRo';
const YOUTUBE_ID = '6DudveUFGRo';
const THUMBNAIL_URL = `https://img.youtube.com/vi/${YOUTUBE_ID}/maxresdefault.jpg`;

const MansaMusaVideoSection = () => {
  const [embedActive, setEmbedActive] = useState(false);
  const [embedError, setEmbedError] = useState(false);

  const handlePlay = () => {
    setEmbedActive(true);
    // Set a timeout to detect if embed fails to load
    setTimeout(() => {
      setEmbedError(true);
    }, 3000);
  };

  return (
    <section className="relative z-20 py-16 bg-gradient-to-br from-mansagold via-amber-600 to-yellow-600 overflow-hidden">
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
            {embedActive && !embedError ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0`}
                  title="Who was Mansa Musa?"
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onError={() => setEmbedError(true)}
                />
              </div>
            ) : (
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block w-full aspect-video rounded-xl overflow-hidden group cursor-pointer"
                onClick={(e) => {
                  if (!embedError) {
                    e.preventDefault();
                    handlePlay();
                  }
                }}
              >
                <img
                  src={THUMBNAIL_URL}
                  alt="Who was Mansa Musa? - The Richest Man in History"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to lower quality thumbnail
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${YOUTUBE_ID}/hqdefault.jpg`;
                  }}
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-10 h-10 text-white fill-white ml-1" />
                  </div>
                </div>
                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white font-semibold text-lg">Who was Mansa Musa?</p>
                  <p className="text-white/70 text-sm flex items-center gap-1">
                    Watch on YouTube <ExternalLink className="w-3 h-3" />
                  </p>
                </div>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MansaMusaVideoSection;
