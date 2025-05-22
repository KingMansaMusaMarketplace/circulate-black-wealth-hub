
import React, { useRef, useState, useEffect } from 'react';
import { getYouTubeId } from './utils/youtube';

interface YouTubePlayerProps {
  src: string;
  isPlaying: boolean;
  isMuted: boolean;
  onStateChange: (isPlaying: boolean, playerState?: number) => void;
  onError?: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  src,
  isPlaying,
  isMuted,
  onStateChange,
  onError,
}) => {
  const [youtubeReady, setYoutubeReady] = useState(false);
  const youtubeContainerRef = useRef<HTMLDivElement>(null);
  const youtubePlayer = useRef<any>(null);
  const [videoId, setVideoId] = useState<string | null>(null);

  // Extract and set the video ID when src changes
  useEffect(() => {
    const id = getYouTubeId(src);
    console.log("YouTube Video ID:", id);
    setVideoId(id);
    
    // If player exists but video ID changes, destroy and recreate
    if (youtubePlayer.current && id) {
      try {
        youtubePlayer.current.destroy();
        youtubePlayer.current = null;
        setYoutubeReady(false);
        initializeYouTubePlayer(id);
      } catch (error) {
        console.error("Error resetting YouTube player:", error);
        onError?.();
      }
    }
  }, [src, onError]);

  const initializeYouTubePlayer = (videoId: string | null) => {
    if (!videoId || !youtubeContainerRef.current) return;
    
    try {
      console.log("Initializing YouTube player with ID:", videoId);
      youtubePlayer.current = new window.YT.Player(youtubeContainerRef.current, {
        videoId: videoId,
        playerVars: {
          'playsinline': 1,
          'controls': 0,        // Hide YouTube controls to use our custom controls
          'showinfo': 0,
          'rel': 0,             // Disable related videos
          'modestbranding': 1,
          'fs': 1,              // Enable fullscreen button
          'iv_load_policy': 3,  // Hide annotations
          'autohide': 1,        // Hide video controls when playing
          'enablejsapi': 1,     // Enable JS API
          'origin': window.location.origin,
        },
        events: {
          'onReady': () => {
            console.log("YouTube player ready");
            setYoutubeReady(true);
            // Initialize mute state when player is ready
            if (isMuted && youtubePlayer.current) {
              youtubePlayer.current.mute();
            }
          },
          'onStateChange': handleYouTubeStateChange,
          'onError': (e: any) => {
            console.error("YouTube player error:", e);
            onError?.();
          }
        }
      });
    } catch (error) {
      console.error("Error initializing YouTube player:", error);
      onError?.();
    }
  };

  // Setup YouTube API
  useEffect(() => {
    if (!videoId) return;

    // Create script tag if it doesn't exist
    if (!window.YT) {
      console.log("Loading YouTube API script");
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Initialize player when API is ready
    const onYouTubeIframeAPIReady = () => {
      console.log("YouTube API script loaded");
      initializeYouTubePlayer(videoId);
    };

    // Set up YouTube API callback
    if (window.YT && window.YT.Player) {
      // If API is already loaded
      console.log("YouTube API already loaded");
      onYouTubeIframeAPIReady();
    } else {
      // If API is still loading
      console.log("Setting up YouTube API callback");
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    }

    // Handle timeout for slow API loading
    const timeout = setTimeout(() => {
      if (!youtubeReady) {
        console.error("YouTube API timeout");
        onError?.();
      }
    }, 10000); // Increased timeout for slower connections

    return () => {
      // Clean up
      clearTimeout(timeout);
      if (youtubePlayer.current) {
        try {
          youtubePlayer.current.destroy();
          youtubePlayer.current = null;
        } catch (e) {
          console.error("Error destroying YouTube player:", e);
        }
      }
    };
  }, [videoId, onError, youtubeReady]);

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
      onError?.();
    }
  }, [isPlaying, youtubeReady, onError]);

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
      onError?.();
    }
  }, [isMuted, youtubeReady, onError]);

  const handleYouTubeStateChange = (event: any) => {
    // YouTube PlayerState: PLAYING = 1, PAUSED = 2, ENDED = 0
    console.log("YouTube player state change:", event.data);
    if (event.data === 1) {
      onStateChange(true, event.data);
    } else if (event.data === 2 || event.data === 0) {
      onStateChange(false, event.data);
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black">
      <div 
        ref={youtubeContainerRef} 
        className="w-full h-full"
        id={`youtube-container-${videoId}`}
      ></div>
      {!youtubeReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="animate-pulse text-white">Loading video...</div>
        </div>
      )}
    </div>
  );
};

export default YouTubePlayer;
