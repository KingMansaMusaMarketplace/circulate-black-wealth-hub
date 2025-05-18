
import React from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface ControlsOverlayProps {
  isPlaying: boolean;
  isMuted: boolean;
  onPlayPause: () => void;
  onToggleMute: () => void;
}

const ControlsOverlay: React.FC<ControlsOverlayProps> = ({
  isPlaying,
  isMuted,
  onPlayPause,
  onToggleMute
}) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 hover:opacity-100 transition-opacity">
      <div className="flex items-center justify-between">
        <button 
          onClick={onPlayPause}
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
        
        <button
          onClick={onToggleMute}
          className="text-white flex items-center"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-5 h-5 mr-2" />
              <span>Unmute</span>
            </>
          ) : (
            <>
              <Volume2 className="w-5 h-5 mr-2" />
              <span>Mute</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ControlsOverlay;
