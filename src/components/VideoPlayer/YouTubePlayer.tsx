
import React, { useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
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
  const [thumbnailError, setThumbnailError] = useState(false);
  const isNativeApp = Capacitor.isNativePlatform();
  
  if (!videoId) {
    return <YouTubeErrorState />;
  }
  
  // Create YouTube embed URL - using youtube-nocookie for better compatibility
  // Note: origin param removed as it causes issues in iOS WebViews
  const embedParams = [
    'playsinline=1',
    'modestbranding=1',
    'rel=0',
    'iv_load_policy=3',
    'fs=1',
    'controls=1',
  ].join('&');
  
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?${embedParams}`;
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const youtubeAppUrl = `youtube://watch?v=${videoId}`;
  const thumbnailUrl = thumbnailError 
    ? `https://img.youtube.com/vi/${videoId}/sddefault.jpg`
    : `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  
  // For native iOS/Android apps, show thumbnail with button to open in YouTube app
  if (isNativeApp) {
    return (
      <div className="w-full aspect-video bg-black relative" style={{ minHeight: '300px' }}>
        <img
          src={thumbnailUrl}
          alt="Video thumbnail"
          className="w-full h-full object-cover"
          onError={() => setThumbnailError(true)}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <a
            href={youtubeAppUrl}
            className="inline-flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-lg font-semibold transition-all shadow-2xl transform hover:scale-105"
            onClick={(e) => {
              // Try YouTube app first, fallback to browser
              setTimeout(() => {
                window.open(youtubeUrl, '_blank');
              }, 500);
            }}
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Watch on YouTube
          </a>
        </div>
      </div>
    );
  }
  
  // For web browsers, use iframe embed
  return (
    <div className="w-full aspect-video bg-black relative" style={{ minHeight: '300px' }}>
      {playerReady ? (
        <>
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title="YouTube video player"
            className="w-full h-full absolute inset-0"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            loading="lazy"
            style={{ 
              border: 'none',
              outline: 'none',
              touchAction: 'manipulation',
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0
            }}
            onError={() => {
              console.error("YouTube iframe failed to load");
              onError?.();
            }}
          />
          <div className="absolute bottom-4 right-4 z-20">
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Watch on YouTube
            </a>
          </div>
        </>
      ) : (
        <YouTubeLoadingState />
      )}
    </div>
  );
};

export default YouTubePlayer;
