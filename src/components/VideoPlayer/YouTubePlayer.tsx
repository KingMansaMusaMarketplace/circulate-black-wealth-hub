
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
  const { videoId, playerReady } = useYouTubePlayer({
    src,
    isPlaying,
    isMuted,
    onStateChange,
    onError,
  });
  
  if (!videoId) {
    return <YouTubeErrorState />;
  }
  
  // Create YouTube embed URL with mobile-friendly parameters
  const embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&playsinline=1&modestbranding=1&rel=0&showinfo=0`;
  
  return (
    <div className="w-full aspect-video bg-black relative">
      {playerReady ? (
        <iframe
          src={embedUrl}
          title="YouTube video player"
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <YouTubeLoadingState />
      )}
    </div>
  );
};

export default YouTubePlayer;
