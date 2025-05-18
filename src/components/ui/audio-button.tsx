
import React from 'react';
import { ButtonProps } from '@/components/ui/button';
import { AudioPlayer } from '@/components/audio/AudioPlayer';

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
  return (
    <AudioPlayer 
      src={audioSrc}
      className={className}
      {...props}
    >
      {children}
    </AudioPlayer>
  );
};
