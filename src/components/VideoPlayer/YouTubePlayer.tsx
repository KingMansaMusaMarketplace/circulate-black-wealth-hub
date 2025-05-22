
import React from 'react';
import { useYouTubePlayer } from './hooks/useYouTubePlayer';
import YouTubeLoadingState from './components/YouTubeLoadingState';
import YouTubeErrorState from './components/YouTubeErrorState';

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
    <div className="w-full aspect-video bg-black">
      {videoId && (
        <iframe 
          ref={playerRef}
          className="w-full h-full"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      )}
      {!playerReady && <YouTubeLoadingState />}
    </div>
  );
};

export default YouTubePlayer;
