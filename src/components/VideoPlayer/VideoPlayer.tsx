
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
  const [hasEnded, setHasEnded] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // Show play button briefly after toggle for better UX
    setShowPlayButton(true);
    
    if (hasEnded) {
      setHasEnded(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setHasEnded(true);
    setShowPlayButton(true);
  };

  // Handler for YouTube state change
  const handleYouTubeStateChange = (newPlayingState: boolean, playerState?: number) => {
    setIsPlaying(newPlayingState);
    
    // YouTube Player States: Ended = 0, Playing = 1, Paused = 2
    if (playerState === 0) {
      setHasEnded(true);
      setShowPlayButton(true);
    } else if (playerState === 1) {
      // If video starts playing by itself (e.g., autoplay), update our UI state
      setShowPlayButton(false);
    } else if (playerState === 2) {
      // When paused, always show the play button
      setShowPlayButton(true);
    }
  };

  return (
    <div className={`relative rounded-xl overflow-hidden shadow-xl ${className} bg-black`}>
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
          posterImage={hasEnded ? "" : posterImage}
          isPlaying={isPlaying}
          isMuted={isMuted}
          onStateChange={setIsPlaying}
          onEnded={handleVideoEnded}
        />
      )}
      
      {/* Play/Pause button with fade effect */}
      <PlayPauseButton 
        isPlaying={isPlaying}
        onClick={togglePlay}
        forceShow={showPlayButton}
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
