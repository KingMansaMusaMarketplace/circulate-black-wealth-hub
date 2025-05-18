
import React, { useRef, useEffect } from 'react';

interface StandardPlayerProps {
  src: string;
  posterImage: string;
  isPlaying: boolean;
  isMuted: boolean;
  onStateChange: (isPlaying: boolean) => void;
  onEnded: () => void;
}

const StandardPlayer: React.FC<StandardPlayerProps> = ({
  src,
  posterImage,
  isPlaying,
  isMuted,
  onStateChange,
  onEnded
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Handle play/pause based on isPlaying prop
  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.play().catch(error => {
        console.error("Error playing video:", error);
        onStateChange(false);
      });
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, onStateChange]);
  
  // Handle mute state based on isMuted prop
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = isMuted;
  }, [isMuted]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={posterImage}
      className="w-full h-full object-cover"
      onEnded={onEnded}
      onPlay={() => onStateChange(true)}
      onPause={() => onStateChange(false)}
    />
  );
};

export default StandardPlayer;
