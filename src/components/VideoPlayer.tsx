
import React, { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  title?: string;
  posterImage?: string;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  title = "Circulate Black Wealth",
  posterImage = "/placeholder.svg",
  className = ""
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className={`relative rounded-xl overflow-hidden shadow-xl ${className}`}>
      {/* Video title */}
      {title && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 z-10">
          <h3 className="text-white text-lg font-medium">{title}</h3>
        </div>
      )}
      
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        poster={posterImage}
        className="w-full h-full object-cover"
        onEnded={handleVideoEnded}
      />
      
      {/* Play/Pause button */}
      <button
        onClick={togglePlay}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                  bg-mansablue/80 hover:bg-mansablue text-white w-16 h-16 rounded-full 
                  flex items-center justify-center transition-colors z-10
                  border-2 border-white shadow-lg"
        aria-label={isPlaying ? "Pause video" : "Play video"}
      >
        {isPlaying ? (
          <Pause className="w-8 h-8" />
        ) : (
          <Play className="w-8 h-8 ml-1" />
        )}
      </button>
      
      {/* Video controls overlay - appears on hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 hover:opacity-100 transition-opacity">
        <div className="flex items-center justify-between">
          <button 
            onClick={togglePlay}
            className="text-white flex items-center"
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                <span>Play</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
