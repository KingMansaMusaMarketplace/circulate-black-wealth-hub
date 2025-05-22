
import React, { useState } from 'react';
import YouTubePlayer from './YouTubePlayer';
import StandardPlayer from './StandardPlayer';
import PlayPauseButton from './controls/PlayPauseButton';
import ControlsOverlay from './controls/ControlsOverlay';
import VideoStructuredData from './utils/structuredData';

interface VideoPlayerProps {
  src: string;
  title?: string;
  posterImage?: string;
  className?: string;
  isYouTube?: boolean;
  description?: string;
  uploadDate?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  title = "Circulate Black Wealth",
  posterImage = "/placeholder.svg",
  className = "",
  isYouTube = false,
  description,
  uploadDate,
  onLoad,
  onError,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const togglePlay = () => {
    console.log("Toggle play:", !isPlaying);
    setIsPlaying(!isPlaying);
    // Show play button briefly after toggle for better UX
    setShowPlayButton(true);
    
    if (hasEnded) {
      setHasEnded(false);
    }
  };

  const toggleMute = () => {
    console.log("Toggle mute:", !isMuted);
    setIsMuted(!isMuted);
  };

  const handleVideoEnded = () => {
    console.log("Video ended");
    setIsPlaying(false);
    setHasEnded(true);
    setShowPlayButton(true);
  };

  // Handler for YouTube state change
  const handleYouTubeStateChange = (newPlayingState: boolean, playerState?: number) => {
    console.log("YouTube state change:", newPlayingState, playerState);
    setIsPlaying(newPlayingState);
    
    // YouTube Player States: Ended = 0, Playing = 1, Paused = 2
    if (playerState === 0) {
      setHasEnded(true);
      setShowPlayButton(true);
    } else if (playerState === 1) {
      // If video starts playing, update our UI state
      setShowPlayButton(false);
      // Signal successful video load
      onLoad?.();
    } else if (playerState === 2) {
      // When paused, always show the play button
      setShowPlayButton(true);
    }
  };

  const handleError = () => {
    console.error("Video error occurred for source:", src);
    setLoadError(true);
    onError?.();
  };

  return (
    <>
      {/* Add structured data for search engines */}
      <VideoStructuredData 
        src={src}
        title={title}
        description={description}
        uploadDate={uploadDate}
        thumbnailUrl={posterImage}
        isYouTube={isYouTube}
      />
      
      <div className={`relative rounded-xl overflow-hidden shadow-xl ${className} bg-black`}>
        {/* Video title */}
        {title && (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 z-10">
            <h3 className="text-white text-lg font-medium">{title}</h3>
          </div>
        )}
        
        {/* Video element - either YouTube or standard */}
        <div className="relative w-full aspect-video">
          {loadError ? (
            <div className="flex items-center justify-center w-full h-full bg-gray-900 text-white">
              <p>Unable to load video. Please try again later.</p>
            </div>
          ) : isYouTube ? (
            <YouTubePlayer 
              src={src}
              isPlaying={isPlaying}
              isMuted={isMuted}
              onStateChange={handleYouTubeStateChange}
              onError={handleError}
            />
          ) : (
            <StandardPlayer
              src={src}
              posterImage={hasEnded ? "" : posterImage}
              isPlaying={isPlaying}
              isMuted={isMuted}
              onStateChange={setIsPlaying}
              onEnded={handleVideoEnded}
              onError={handleError}
            />
          )}
        </div>
        
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
    </>
  );
};

export default VideoPlayer;
