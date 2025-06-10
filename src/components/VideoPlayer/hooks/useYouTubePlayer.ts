
import { useState, useEffect } from 'react';
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
  
  // Extract video ID from source URL
  useEffect(() => {
    const id = getYouTubeId(src);
    console.log("YouTube Video ID:", id);
    setVideoId(id);
    if (id) {
      setPlayerReady(true);
      // Signal that player is ready and paused initially
      onStateChange(false, 2);
    } else {
      onError?.();
    }
  }, [src, onStateChange, onError]);

  // Update state when play/pause changes
  useEffect(() => {
    if (playerReady) {
      // Simulate state change when play state updates
      const playerState = isPlaying ? 1 : 2; // 1 = playing, 2 = paused
      onStateChange(isPlaying, playerState);
    }
  }, [isPlaying, playerReady, onStateChange]);

  return {
    videoId,
    playerReady,
  };
};
