import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceButtonProps {
  isConnected: boolean;
  isConnecting: boolean;
  isSpeaking: boolean;
  onStart: () => void;
  onEnd: () => void;
}

const buttonStyles = {
  touchAction: 'manipulation' as const,
  WebkitTapHighlightColor: 'transparent',
  WebkitUserSelect: 'none' as const,
  userSelect: 'none' as const,
};

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  isConnected,
  isConnecting,
  isSpeaking,
  onStart,
  onEnd,
}) => {
  if (!isConnected) {
    return (
      <Button
        onClick={onStart}
        disabled={isConnecting}
        size="default"
        className="kayla-button-idle hover:opacity-90 text-white font-semibold shadow-lg min-w-[180px] min-h-[48px] text-sm"
        style={buttonStyles}
      >
        {isConnecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="font-medium text-sm">Connecting...</span>
          </>
        ) : (
          <>
            <Mic className="mr-2 h-4 w-4" />
            <span className="font-medium text-sm">Ask Kayla</span>
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      onClick={onEnd}
      size="lg"
      className={`${
        isSpeaking
          ? 'kayla-button-active'
          : 'bg-red-500 hover:bg-red-600'
      } text-white font-semibold shadow-2xl min-w-[240px] min-h-[64px] text-lg transition-colors`}
      style={buttonStyles}
    >
      <MicOff className={`mr-3 h-6 w-6 ${isSpeaking && 'kayla-mic-icon'}`} />
      <span className="font-medium">
        {isSpeaking ? 'Kayla Speaking...' : 'End Chat'}
      </span>
    </Button>
  );
};

export default VoiceButton;
