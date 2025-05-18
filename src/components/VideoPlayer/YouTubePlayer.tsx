
import React, { useRef, useState, useEffect } from 'react';
import { getYouTubeId } from './utils/youtube';

interface YouTubePlayerProps {
  src: string;
  isPlaying: boolean;
  isMuted: boolean;
  onStateChange: (isPlaying: boolean) => void;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  src,
  isPlaying,
  isMuted,
  onStateChange,
}) => {
  const [youtubeReady, setYoutubeReady] = useState(false);
  const youtubeContainerRef = useRef<HTMLDivElement>(null);
  const youtubePlayer = useRef<any>(null);

  useEffect(() => {
    // Create script tag if it doesn't exist
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Initialize player when API is ready
    const onYouTubeIframeAPIReady = () => {
      const videoId = getYouTubeId(src);
      if (!videoId || !youtubeContainerRef.current) return;

      youtubePlayer.current = new window.YT.Player(youtubeContainerRef.current, {
        videoId: videoId,
        playerVars: {
          'playsinline': 1,
          'controls': 0,
          'showinfo': 0,
          'rel': 0,        // Disable related videos
          'modestbranding': 1,
          'fs': 1,           // Enable fullscreen button
          'iv_load_policy': 3, // Hide annotations
          'autohide': 1,     // Hide video controls when playing
          'enablejsapi': 1,  // Enable JS API
          'origin': window.location.origin,
          'end': 0,          // Do not show related videos at end
        },
        events: {
          'onReady': () => setYoutubeReady(true),
          'onStateChange': handleYouTubeStateChange
        }
      });
    };

    // Set up YouTube API callback
    if (window.YT && window.YT.Player) {
      // If API is already loaded
      onYouTubeIframeAPIReady();
    } else {
      // If API is still loading
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    }

    return () => {
      // Clean up
      if (youtubePlayer.current) {
        try {
          youtubePlayer.current.destroy();
        } catch (e) {
          console.error("Error destroying YouTube player:", e);
        }
      }
    };
  }, [src]);

  // Update player state based on props
  useEffect(() => {
    if (!youtubeReady || !youtubePlayer.current) return;
    
    try {
      if (isPlaying) {
        youtubePlayer.current.playVideo();
      } else {
        youtubePlayer.current.pauseVideo();
      }
    } catch (e) {
      console.error("Error controlling YouTube player state:", e);
    }
  }, [isPlaying, youtubeReady]);

  // Update mute state based on props
  useEffect(() => {
    if (!youtubeReady || !youtubePlayer.current) return;
    
    try {
      if (isMuted) {
        youtubePlayer.current.mute();
      } else {
        youtubePlayer.current.unMute();
      }
    } catch (e) {
      console.error("Error controlling YouTube player mute:", e);
    }
  }, [isMuted, youtubeReady]);

  const handleYouTubeStateChange = (event: any) => {
    // YT.PlayerState.PLAYING = 1, YT.PlayerState.PAUSED = 2, YT.PlayerState.ENDED = 0
    if (event.data === 1) {
      onStateChange(true);
    } else if (event.data === 2 || event.data === 0) {
      onStateChange(false);
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black">
      <div 
        ref={youtubeContainerRef} 
        className="w-full h-full"
        id="youtube-container"
      ></div>
    </div>
  );
};

export default YouTubePlayer;
