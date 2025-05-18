
import React from 'react';
import { Play, Pause } from 'lucide-react';

interface PlayPauseButtonProps {
  isPlaying: boolean;
  onClick: () => void;
}

const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({
  isPlaying,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
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
  );
};

export default PlayPauseButton;
