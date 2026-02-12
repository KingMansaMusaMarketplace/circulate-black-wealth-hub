import React, { useState } from 'react';
import { useCapacitor } from '@/hooks/use-capacitor';
import { VoiceButton, VoiceTranscript, useVoiceConnection, IPadVoiceFallback } from './voice';

interface VoiceInterfaceProps {
  onSpeakingChange?: (speaking: boolean) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ onSpeakingChange }) => {
  const { isNative } = useCapacitor();
  const [showIPadFallback, setShowIPadFallback] = useState(false);

  const {
    isConnected,
    isConnecting,
    isSpeaking,
    transcript,
    startConversation,
    endConversation,
  } = useVoiceConnection({ onSpeakingChange });

  const handleStart = async () => {
    try {
      console.log('[VoiceInterface] Ask Kayla pressed - starting conversation...');
      const result = await startConversation();
      console.log('[VoiceInterface] startConversation result:', result);
      if (result && typeof result === 'object' && 'blocked' in result && result.blocked && result.reason === 'ipad') {
        setShowIPadFallback(true);
      }
    } catch (error) {
      console.error('[VoiceInterface] Error starting conversation:', error);
      // Explicitly prevent any re-throw that could crash WKWebView
    }
  };

  return (
    <>
      {showIPadFallback && (
        <IPadVoiceFallback onDismiss={() => setShowIPadFallback(false)} />
      )}

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
          onStart={handleStart}
          onEnd={endConversation}
        />

        {isConnected && !isSpeaking && (
          <p className="text-xs text-muted-foreground animate-pulse">
            Listening... speak naturally
          </p>
        )}
      </div>
    </>
  );
};

export default VoiceInterface;
