
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
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if we're on mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileDevice = /android|avantgo|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(userAgent);
      const isIOS = /iPad|iPhone|iPod/.test(userAgent);
      setIsMobile(isMobileDevice || isIOS);
    };
    
    checkMobile();
  }, []);
  
  // Extract video ID from source URL
  useEffect(() => {
    const id = getYouTubeId(src);
    console.log("YouTube Video ID:", id);
    setVideoId(id);
  }, [src]);
  
  // Load YouTube iframe API and create player
  useEffect(() => {
    if (!videoId) return;
    
    // Function to initialize the YouTube player
    const initializeYouTubePlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      if (!playerRef.current) return;
      
      try {
        console.log("Initializing YouTube player with video ID:", videoId, "Mobile:", isMobile);
        
        // Enhanced player vars for mobile compatibility
        const playerVars = {
          autoplay: 0, // Never autoplay on mobile
          mute: isMuted ? 1 : 0,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          origin: window.location.origin,
          playsinline: 1, // Important for iOS
          enablejsapi: 1,
          fs: 1, // Enable fullscreen
          cc_load_policy: 0,
          iv_load_policy: 3,
          disablekb: isMobile ? 1 : 0, // Disable keyboard on mobile
        };
        
        // Create YouTube player
        youtubePlayer.current = new window.YT.Player(playerRef.current, {
          videoId: videoId,
          width: '100%',
          height: '100%',
          playerVars: playerVars,
          events: {
            onReady: (event: any) => {
              console.log("YouTube player ready");
              setPlayerReady(true);
              
              // On mobile, don't try to control playback automatically
              if (!isMobile && isMuted) {
                try {
                  event.target.mute();
                } catch (err) {
                  console.log("Could not mute on ready:", err);
                }
              }
            },
            onStateChange: (event: any) => {
              console.log("YouTube player state changed:", event.data);
              
              // YouTube Player States: unstarted (-1), ended (0), playing (1), paused (2), buffering (3)
              const isCurrentlyPlaying = event.data === 1;
              onStateChange(isCurrentlyPlaying, event.data);
            },
            onError: (event: any) => {
              console.error("YouTube player error:", event.data);
              onError?.();
            }
          }
        });
      } catch (err) {
        console.error("Error initializing YouTube player:", err);
        onError?.();
      }
    };
    
    // Load YouTube API if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      
      window.onYouTubeIframeAPIReady = () => {
        console.log("YouTube API ready");
        initializeYouTubePlayer();
      };
    } else {
      initializeYouTubePlayer();
    }
    
    // Cleanup
    return () => {
      if (youtubePlayer.current && youtubePlayer.current.destroy) {
        try {
          youtubePlayer.current.destroy();
        } catch (err) {
          console.log("Error destroying player:", err);
        }
        youtubePlayer.current = null;
      }
    };
  }, [videoId, isMobile, onStateChange, onError]);
  
  // Handle play/pause changes - but be more careful on mobile
  useEffect(() => {
    if (!youtubePlayer.current || !playerReady) return;
    
    // On mobile, let the user control playback directly
    if (isMobile) return;
    
    try {
      if (isPlaying) {
        console.log("Playing YouTube video");
        youtubePlayer.current.playVideo();
      } else {
        console.log("Pausing YouTube video");
        youtubePlayer.current.pauseVideo();
      }
    } catch (err) {
      console.error("Error playing/pausing YouTube video:", err);
    }
  }, [isPlaying, playerReady, isMobile]);
  
  // Handle mute/unmute changes - but be more careful on mobile
  useEffect(() => {
    if (!youtubePlayer.current || !playerReady) return;
    
    // On mobile, let the user control audio directly
    if (isMobile) return;
    
    try {
      if (isMuted) {
        console.log("Muting YouTube video");
        youtubePlayer.current.mute();
      } else {
        console.log("Unmuting YouTube video");
        youtubePlayer.current.unMute();
      }
    } catch (err) {
      console.error("Error muting/unmuting YouTube video:", err);
    }
  }, [isMuted, playerReady, isMobile]);

  return {
    playerRef,
    videoId,
    playerReady,
  };
};
