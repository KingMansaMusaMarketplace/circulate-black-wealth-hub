
import React from 'react';
import { ButtonProps } from '@/components/ui/button';
import { AudioPlayer } from '@/components/audio/AudioPlayer';

interface AudioButtonProps extends Omit<ButtonProps, 'onPlay' | 'onPause'> {
  audioSrc: string;
  children: React.ReactNode;
  onAudioPlay?: () => void;
  onAudioPause?: () => void;
}

export const AudioButton = ({ 
  audioSrc, 
  children, 
  className, 
  onAudioPlay,
  onAudioPause,
  ...props 
}: AudioButtonProps) => {
  return (
    <AudioPlayer 
      src={audioSrc}
      className={className}
      onPlay={onAudioPlay}
      onPause={onAudioPause}
      {...props}
    >
      {children}
    </AudioPlayer>
  );
};
