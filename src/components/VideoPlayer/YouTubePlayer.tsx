
import React from 'react';
import { useYouTubePlayer } from './hooks/useYouTubePlayer';
import { YouTubeLoadingState, YouTubeErrorState } from './components';

interface YouTubePlayerProps {
  src: string;
  isPlaying: boolean;
  isMuted: boolean;
  onStateChange: (isPlaying: boolean, playerState?: number) => void;
  onError?: () => void;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  src,
  isPlaying,
  isMuted,
  onStateChange,
  onError,
}) => {
  const { playerRef, videoId, playerReady } = useYouTubePlayer({
    src,
    isPlaying,
    isMuted,
    onStateChange,
    onError,
  });
  
  if (!videoId) {
    return <YouTubeErrorState />;
  }
  
  return (
    <div className="w-full aspect-video bg-black relative">
      <div className="w-full h-full">
        <div ref={playerRef} className="w-full h-full"></div>
      </div>
      
      {!playerReady && <YouTubeLoadingState />}
    </div>
  );
};

export default YouTubePlayer;
