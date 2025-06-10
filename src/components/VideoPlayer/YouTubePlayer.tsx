
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
  
  // Always call useEffect, but conditionally execute the logic inside
  useEffect(() => {
    if (playerReady && iframeRef.current && videoId) {
      // Enhanced mobile parameters for better iPhone/Android compatibility
      const mobileParams = [
        'enablejsapi=1',
        'playsinline=1', // Critical for iOS inline playback
        'modestbranding=1',
        'rel=0',
        'showinfo=0',
        'iv_load_policy=3', // Hide annotations on mobile
        'disablekb=1', // Disable keyboard controls on mobile
        'fs=1', // Allow fullscreen
        'cc_load_policy=0', // Disable captions by default
        'origin=' + window.location.origin, // Required for API
        `autoplay=${isPlaying ? 1 : 0}`,
        `mute=${isMuted ? 1 : 0}`
      ].join('&');
      
      const newUrl = `https://www.youtube.com/embed/${videoId}?${mobileParams}`;
      
      // Only update if the URL actually changed to avoid unnecessary reloads
      if (iframeRef.current.src !== newUrl) {
        iframeRef.current.src = newUrl;
      }
    }
  }, [isPlaying, isMuted, videoId, playerReady]);
  
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
    'disablekb=1',
    'fs=1',
    'cc_load_policy=0',
    'origin=' + window.location.origin,
    `autoplay=${isPlaying ? 1 : 0}`,
    `mute=${isMuted ? 1 : 0}`
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
          // Mobile-specific attributes for better compatibility
          playsInline
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
