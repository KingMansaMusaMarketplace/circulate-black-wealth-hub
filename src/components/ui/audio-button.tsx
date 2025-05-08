
import React, { useState, useRef, useEffect } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { AUDIO_PATHS } from '@/utils/audio';

interface AudioButtonProps extends ButtonProps {
  audioSrc: string;
  children: React.ReactNode;
}

export const AudioButton = ({ 
  audioSrc, 
  children, 
  className, 
  ...props 
}: AudioButtonProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Create audio element when component mounts
    if (!audioRef.current) {
      audioRef.current = new Audio(audioSrc);
      
      // Add event listener for when audio ends
      audioRef.current.addEventListener('ended', handleAudioEnded);
    }
    
    // Clean up function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', handleAudioEnded);
      }
    };
  }, [audioSrc]);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      // Handle potential play() error (needed for some browsers)
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error("Audio playback error:", error);
          });
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <>
      <Button 
        {...props}
        className={className}
        onClick={(e) => {
          toggleAudio();
          props.onClick?.(e);
        }}
      >
        {children}
        {isPlaying ? (
          <Volume2 className="ml-2 h-4 w-4" />
        ) : (
          <VolumeX className="ml-2 h-4 w-4" />
        )}
      </Button>
    </>
  );
};
