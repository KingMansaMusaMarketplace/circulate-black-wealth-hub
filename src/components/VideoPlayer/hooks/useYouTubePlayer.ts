
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
  const playerRef = useRef<HTMLIFrameElement>(null);
  const youtubePlayer = useRef<any>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  
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
        console.log("Initializing YouTube player with video ID:", videoId);
        
        // Create YouTube player
        youtubePlayer.current = new window.YT.Player(playerRef.current, {
          videoId: videoId,
          playerVars: {
            autoplay: isPlaying ? 1 : 0,
            mute: isMuted ? 1 : 0,
            controls: 1,
            rel: 0,
            modestbranding: 1,
            origin: window.location.origin
          },
          events: {
            onReady: () => {
              console.log("YouTube player ready");
              setPlayerReady(true);
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
        youtubePlayer.current.destroy();
        youtubePlayer.current = null;
      }
    };
  }, [videoId, onStateChange, onError]);
  
  // Handle play/pause changes
  useEffect(() => {
    if (!youtubePlayer.current || !playerReady) return;
    
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
  }, [isPlaying, playerReady]);
  
  // Handle mute/unmute changes
  useEffect(() => {
    if (!youtubePlayer.current || !playerReady) return;
    
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
  }, [isMuted, playerReady]);

  return {
    playerRef,
    videoId,
    playerReady,
  };
};
