
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
  
  // Create YouTube embed URL with mobile-optimized parameters
  const mobileParams = [
    'enablejsapi=1',
    'playsinline=1',
    'modestbranding=1',
    'rel=0',
    'showinfo=0',
    'iv_load_policy=3',
    'disablekb=0', // Enable keyboard controls
    'fs=1',
    'cc_load_policy=0',
    'controls=1', // Show YouTube controls
    'origin=' + window.location.origin,
    // Remove autoplay and mute to let YouTube handle it naturally
  ].join('&');
  
  const embedUrl = `https://www.youtube.com/embed/${videoId}?${mobileParams}`;
  
  return (
    <div className="w-full aspect-video bg-black relative">
      {playerReady ? (
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title="YouTube video player"
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          loading="lazy"
          style={{ 
            border: 'none',
            outline: 'none',
            // Ensure proper touch handling on mobile
            touchAction: 'manipulation'
          }}
        />
      ) : (
        <YouTubeLoadingState />
      )}
    </div>
  );
};

export default YouTubePlayer;
