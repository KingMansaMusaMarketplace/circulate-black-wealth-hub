
import { useState, useEffect, useRef } from 'react';
import { getYouTubeId, getYouTubeEmbedUrl } from '../utils/youtube';

interface UseYouTubePlayerProps {
  src: string;
  isPlaying: boolean;
  isMuted: boolean;
  onStateChange: (isPlaying: boolean, playerState?: number) => void;
  onError?: () => void;
}

// Declare YouTube IFrame API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const useYouTubePlayer = ({
  src,
  isPlaying,
  isMuted,
  onStateChange,
  onError,
}: UseYouTubePlayerProps) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const youtubePlayer = useRef<any>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const initializingRef = useRef(false);
  
  // Extract video ID from source URL
  useEffect(() => {
    const id = getYouTubeId(src);
    console.log("YouTube Video ID:", id);
    setVideoId(id);
  }, [src]);
  
  // Load YouTube iframe API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setApiReady(true);
      return;
    }
    
    // Load YouTube API if not already loaded
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
    
    // Set up the callback for when API is ready
    window.onYouTubeIframeAPIReady = () => {
      console.log("YouTube API ready");
      setApiReady(true);
    };
  }, []);
  
  // Create player when API and video ID are ready
  useEffect(() => {
    if (!videoId || !apiReady || !playerRef.current || initializingRef.current) return;
    
    // Prevent multiple initializations
    initializingRef.current = true;
    
    try {
      console.log("Initializing YouTube player with video ID:", videoId);
      
      // Destroy existing player if any
      if (youtubePlayer.current && youtubePlayer.current.destroy) {
        try {
          youtubePlayer.current.destroy();
        } catch (err) {
          console.log("Error destroying previous player:", err);
        }
      }
      
      // Reset states
      setPlayerReady(false);
      
      // Create YouTube player with minimal config
      youtubePlayer.current = new window.YT.Player(playerRef.current, {
        videoId: videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 0,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          enablejsapi: 1,
        },
        events: {
          onReady: (event: any) => {
            console.log("YouTube player ready");
            setPlayerReady(true);
            initializingRef.current = false;
            onStateChange(false, 2); // Start in paused state
          },
          onStateChange: (event: any) => {
            console.log("YouTube player state changed:", event.data);
            const isCurrentlyPlaying = event.data === 1;
            onStateChange(isCurrentlyPlaying, event.data);
          },
          onError: (event: any) => {
            console.error("YouTube player error:", event.data);
            initializingRef.current = false;
            onError?.();
          }
        }
      });
    } catch (err) {
      console.error("Error initializing YouTube player:", err);
      initializingRef.current = false;
      onError?.();
    }
    
    // Cleanup
    return () => {
      if (youtubePlayer.current && youtubePlayer.current.destroy) {
        try {
          youtubePlayer.current.destroy();
        } catch (err) {
          console.log("Error destroying player on cleanup:", err);
        }
        youtubePlayer.current = null;
      }
      initializingRef.current = false;
    };
  }, [videoId, apiReady, onStateChange, onError]);

  return {
    playerRef,
    videoId,
    playerReady,
  };
};
