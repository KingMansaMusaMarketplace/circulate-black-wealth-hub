
import React, { useEffect, useState } from 'react';
import { Play, Pause } from 'lucide-react';

interface PlayPauseButtonProps {
  isPlaying: boolean;
  onClick: () => void;
  forceShow?: boolean;
}

const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({
  isPlaying,
  onClick,
  forceShow = false
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  // When video starts playing, begin fade out after a short delay
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isPlaying && !forceShow) {
      // Wait 1.5 seconds before fading out
      timer = setTimeout(() => {
        setIsVisible(false);
      }, 1500);
    } else {
      // When video is paused or forceShow is true, always show the button
      setIsVisible(true);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, forceShow]);
  
  // Return to visible state when hovered
  const handleMouseEnter = () => {
    setIsVisible(true);
  };
  
  // Hide again when mouse leaves (only if playing and not forced to show)
  const handleMouseLeave = () => {
    if (isPlaying && !forceShow) setIsVisible(false);
  };
  
  return (
    <button
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                bg-mansablue/80 hover:bg-mansablue text-white w-16 h-16 rounded-full 
                flex items-center justify-center transition-all duration-500 z-20
                border-2 border-white shadow-lg ${isPlaying && !isVisible ? 'opacity-0' : 'opacity-100'}`}
      aria-label={isPlaying ? "Pause video" : "Play video"}
    >
      {isPlaying ? (
        <Pause className="w-8 h-8" />
      ) : (
        <Play className="w-8 h-8 ml-1" />
      )}
    </button>
  );
};

export default PlayPauseButton;
