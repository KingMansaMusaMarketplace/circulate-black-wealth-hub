
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { getYouTubeId } from '../utils/youtube';

interface UseYouTubePlayerProps {
  src: string;
  isPlaying: boolean;
  isMuted: boolean;
  onStateChange: (isPlaying: boolean, playerState?: number) => void;
  onError?: () => void;
}

export const useYouTubePlayer = ({
  src,
  isPlaying,
  isMuted,
  onStateChange,
  onError,
}: UseYouTubePlayerProps) => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const isNativeApp = Capacitor.isNativePlatform();
  
  // Extract video ID from source URL
  useEffect(() => {
    const id = getYouTubeId(src);
    console.log("YouTube Video ID:", id);
    setVideoId(id);
    if (id) {
      // For native apps, set ready immediately without delay
      if (isNativeApp) {
        setPlayerReady(true);
        return;
      }
      
      // For web browsers, add a small delay for proper initialization
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const delay = isMobile ? 500 : 100;
      
      setTimeout(() => {
        setPlayerReady(true);
        // Signal that player is ready and paused initially
        onStateChange(false, 2);
      }, delay);
    } else {
      onError?.();
    }
  }, [src, onStateChange, onError, isNativeApp]);

  // Update state when play/pause changes (skip for native apps)
  useEffect(() => {
    if (playerReady && !isNativeApp) {
      // Simulate state change when play state updates
      const playerState = isPlaying ? 1 : 2; // 1 = playing, 2 = paused
      onStateChange(isPlaying, playerState);
    }
  }, [isPlaying, playerReady, onStateChange, isNativeApp]);

  return {
    videoId,
    playerReady,
  };
};
