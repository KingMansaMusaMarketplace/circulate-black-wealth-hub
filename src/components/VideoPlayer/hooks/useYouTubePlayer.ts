
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
  const [ytApiLoaded, setYtApiLoaded] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  
  // Extract video ID from source URL
  useEffect(() => {
    const id = getYouTubeId(src);
    console.log("YouTube Video ID:", id);
    setVideoId(id);
  }, [src]);
  
  // Load YouTube iframe API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      
      window.onYouTubeIframeAPIReady = () => {
        console.log("YouTube API loaded");
        setYtApiLoaded(true);
      };
    } else {
      setYtApiLoaded(true);
    }
    
    // Cleanup
    return () => {
      if (youtubePlayer.current) {
        youtubePlayer.current = null;
      }
    };
  }, []);
  
  // Create the iframe player
  useEffect(() => {
    if (!ytApiLoaded || !videoId) return;
    
    const embedUrl = getYouTubeEmbedUrl(videoId);
    
    if (playerRef.current) {
      playerRef.current.src = `${embedUrl}?enablejsapi=1&origin=${window.location.origin}&autoplay=${isPlaying ? '1' : '0'}&mute=${isMuted ? '1' : '0'}`;
    }
  }, [ytApiLoaded, videoId, isPlaying, isMuted]);
  
  // Handle messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Make sure the message is from YouTube
      if (event.origin !== "https://www.youtube.com") return;
      
      try {
        const data = JSON.parse(event.data);
        
        // YouTube iframe API sends events in this format
        if (data.event === "onStateChange") {
          // YouTube states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering)
          if (data.info === 1) {
            onStateChange(true, 1);
            setPlayerReady(true);
          } else if (data.info === 2) {
            onStateChange(false, 2);
          } else if (data.info === 0) {
            onStateChange(false, 0);
          }
        } else if (data.event === "onError") {
          console.error("YouTube player error:", data);
          onError?.();
        }
      } catch (e) {
        // Not a JSON message or not for us
      }
    };
    
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [onStateChange, onError]);
  
  // Handle play/pause changes
  useEffect(() => {
    if (!playerRef.current || !playerReady) return;
    
    // Send play/pause commands via postMessage
    const command = isPlaying ? 'playVideo' : 'pauseVideo';
    playerRef.current.contentWindow?.postMessage(
      JSON.stringify({
        event: 'command',
        func: command,
        args: []
      }), 
      '*'
    );
  }, [isPlaying, playerReady]);
  
  // Handle mute/unmute changes
  useEffect(() => {
    if (!playerRef.current || !playerReady) return;
    
    // Send mute/unmute commands via postMessage
    const command = isMuted ? 'mute' : 'unMute';
    playerRef.current.contentWindow?.postMessage(
      JSON.stringify({
        event: 'command',
        func: command,
        args: []
      }), 
      '*'
    );
  }, [isMuted, playerReady]);

  return {
    playerRef,
    videoId,
    playerReady,
  };
};
