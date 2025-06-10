
import React, { useEffect, useRef } from 'react';
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
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  if (!videoId) {
    return <YouTubeErrorState />;
  }
  
  // Create YouTube embed URL with autoplay parameter based on isPlaying state
  const embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&playsinline=1&modestbranding=1&rel=0&showinfo=0&autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}`;
  
  // Handle play state changes by updating the iframe src
  useEffect(() => {
    if (playerReady && iframeRef.current) {
      const newUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&playsinline=1&modestbranding=1&rel=0&showinfo=0&autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}`;
      
      // Only update if the URL actually changed to avoid unnecessary reloads
      if (iframeRef.current.src !== newUrl) {
        iframeRef.current.src = newUrl;
      }
    }
  }, [isPlaying, isMuted, videoId, playerReady]);
  
  return (
    <div className="w-full aspect-video bg-black relative">
      {playerReady ? (
        <iframe
          ref={iframeRef}
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
