
import { useState, useEffect, useRef } from 'react';
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
  const playerRef = useRef<HTMLDivElement>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  
  // Extract video ID from source URL
  useEffect(() => {
    const id = getYouTubeId(src);
    console.log("YouTube Video ID:", id);
    setVideoId(id);
    if (id) {
      setPlayerReady(true);
      onStateChange(false, 2); // Start in paused state
    }
  }, [src, onStateChange]);

  return {
    playerRef,
    videoId,
    playerReady,
  };
};
