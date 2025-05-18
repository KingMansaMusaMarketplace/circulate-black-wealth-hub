
import React, { useState } from 'react';
import YouTubePlayer from './YouTubePlayer';
import StandardPlayer from './StandardPlayer';
import PlayPauseButton from './controls/PlayPauseButton';
import ControlsOverlay from './controls/ControlsOverlay';

interface VideoPlayerProps {
  src: string;
  title?: string;
  posterImage?: string;
  className?: string;
  isYouTube?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  title = "Circulate Black Wealth",
  posterImage = "/placeholder.svg",
  className = "",
  isYouTube = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  // Handler for YouTube state change
  const handleYouTubeStateChange = (newPlayingState: boolean) => {
    setIsPlaying(newPlayingState);
  };

  return (
    <div className={`relative rounded-xl overflow-hidden shadow-xl ${className}`}>
      {/* Video title */}
      {title && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 z-10">
          <h3 className="text-white text-lg font-medium">{title}</h3>
        </div>
      )}
      
      {/* Video element - either YouTube or standard */}
      {isYouTube ? (
        <YouTubePlayer 
          src={src}
          isPlaying={isPlaying}
          isMuted={isMuted}
          onStateChange={handleYouTubeStateChange}
        />
      ) : (
        <StandardPlayer
          src={src}
          posterImage={posterImage}
          isPlaying={isPlaying}
          isMuted={isMuted}
          onStateChange={setIsPlaying}
          onEnded={handleVideoEnded}
        />
      )}
      
      {/* Play/Pause button */}
      <PlayPauseButton 
        isPlaying={isPlaying}
        onClick={togglePlay}
      />
      
      {/* Video controls overlay */}
      <ControlsOverlay 
        isPlaying={isPlaying}
        isMuted={isMuted}
        onPlayPause={togglePlay}
        onToggleMute={toggleMute}
      />
    </div>
  );
};

export default VideoPlayer;
