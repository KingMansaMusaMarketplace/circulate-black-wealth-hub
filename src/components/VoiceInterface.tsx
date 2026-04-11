import React from 'react';
import { useCapacitor } from '@/hooks/use-capacitor';
import { VoiceButton, VoiceTranscript, useVoiceConnection } from './voice';

interface VoiceInterfaceProps {
  onSpeakingChange?: (speaking: boolean) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ onSpeakingChange }) => {
  const { isNative } = useCapacitor();

  const {
    isConnected,
    isConnecting,
    isSpeaking,
    isExecutingTool,
    transcript,
    startConversation,
    endConversation,
  } = useVoiceConnection({ onSpeakingChange });

  const handleStart = async () => {
    try {
      console.log('[VoiceInterface] Ask Kayla pressed - starting conversation...');
      await startConversation();
    } catch (error) {
      console.error('[VoiceInterface] Error starting conversation:', error);
    }
  };

  // Completely hide voice interface on iOS to prevent WKWebView crashes
  if (isNative && typeof window !== 'undefined' && window.Capacitor?.getPlatform?.() === 'ios') {
    return null;
  }

  return (
    <>
      <div
        className="fixed left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-4"
        style={{
          bottom: isNative ? 'calc(env(safe-area-inset-bottom, 20px) + 80px)' : '32px',
        }}
      >
        <VoiceTranscript transcript={transcript} />

        <VoiceButton
          isConnected={isConnected}
          isConnecting={isConnecting}
          isSpeaking={isSpeaking}
          isExecutingTool={isExecutingTool}
          onStart={handleStart}
          onEnd={endConversation}
        />

        {isConnected && !isSpeaking && !isExecutingTool && (
          <p className="text-xs text-muted-foreground animate-pulse">
            Listening... speak naturally
          </p>
        )}
      </div>
    </>
  );
};

export default VoiceInterface;
