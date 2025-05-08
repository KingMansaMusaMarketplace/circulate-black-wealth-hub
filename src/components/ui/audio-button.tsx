
import React, { useState, useRef } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

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

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
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
      <audio 
        ref={audioRef}
        src={audioSrc} 
        onEnded={handleAudioEnded}
        preload="auto"
      />
    </>
  );
};
