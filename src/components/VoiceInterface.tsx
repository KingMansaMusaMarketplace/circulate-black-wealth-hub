import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { RealtimeChat } from '@/utils/RealtimeAudio';
import { useCapacitor } from '@/hooks/use-capacitor';

// Safe haptics helper - lazy load to prevent iOS crashes
const triggerHaptics = async (style: 'light' | 'medium' | 'heavy') => {
  try {
    const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
    const impactStyle = style === 'light' ? ImpactStyle.Light : 
                        style === 'medium' ? ImpactStyle.Medium : ImpactStyle.Heavy;
    await Haptics.impact({ style: impactStyle });
  } catch (e) {
    // Haptics not available or plugin not installed - silently ignore
  }
};

interface VoiceInterfaceProps {
  onSpeakingChange?: (speaking: boolean) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ onSpeakingChange }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const voiceRef = useRef<RealtimeChat | null>(null);
  const { isNative } = useCapacitor();

  const handleMessage = (event: any) => {
    console.log('Voice event:', event.type);

    // Update speaking state based on audio events
    if (event.type === 'response.audio.delta') {
      setIsSpeaking(true);
      onSpeakingChange?.(true);
    } else if (event.type === 'response.audio.done') {
      setIsSpeaking(false);
      onSpeakingChange?.(false);
    }

    // Display user transcripts
    if (event.type === 'conversation.item.input_audio_transcription.completed') {
      setTranscript(`You: ${event.transcript}`);
      setTimeout(() => setTranscript(''), 5000);
    } 
    
    // Display assistant transcripts as they stream in
    else if (event.type === 'response.audio_transcript.delta') {
      setTranscript((prev) => {
        if (prev.startsWith('Kayla:')) {
          return prev + event.delta;
        }
        return `Kayla: ${event.delta}`;
      });
    } 
    
    // Clear transcript when assistant finishes
    else if (event.type === 'response.audio_transcript.done') {
      setTimeout(() => setTranscript(''), 5000);
    }
  };

  const startConversation = async () => {
    await triggerHaptics('medium');

    setIsConnecting(true);
    try {
      const voice = new RealtimeChat(handleMessage);
      await voice.init();
      voiceRef.current = voice;
      setIsConnected(true);
      
      toast.success('Connected to Kayla', {
        description: 'Start speaking naturally - I can hear you!'
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Connection Failed', {
        description: error instanceof Error ? error.message : 'Failed to start conversation'
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const endConversation = async () => {
    await triggerHaptics('light');

    voiceRef.current?.disconnect();
    voiceRef.current = null;
    setIsConnected(false);
    setTranscript('');
    setIsSpeaking(false);
    onSpeakingChange?.(false);
    
    toast.info('Disconnected', {
      description: 'Conversation ended'
    });
  };

  useEffect(() => {
    return () => {
      voiceRef.current?.disconnect();
    };
  }, []);

  return (
    <div 
      className="fixed left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-4"
      style={{
        bottom: isNative ? 'calc(env(safe-area-inset-bottom, 20px) + 80px)' : '32px'
      }}
    >
      {transcript && (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg px-4 py-3 max-w-md shadow-lg animate-in fade-in slide-in-from-bottom-2">
          <p className="text-sm">{transcript}</p>
        </div>
      )}
      
      {!isConnected ? (
        <Button 
          onClick={startConversation}
          disabled={isConnecting}
          size="lg"
          className="kayla-button-idle hover:opacity-90 text-white font-semibold shadow-2xl min-w-[240px] min-h-[64px] text-lg"
          style={{ 
            touchAction: 'manipulation', 
            WebkitTapHighlightColor: 'transparent',
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }}
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-3 h-6 w-6 animate-spin" />
              <span className="font-medium">Connecting...</span>
            </>
          ) : (
            <>
              <Mic className="mr-3 h-6 w-6" />
              <span className="font-medium">Please ask Kayla</span>
            </>
          )}
        </Button>
      ) : (
        <Button 
          onClick={endConversation}
          size="lg"
          className={`${
            isSpeaking 
              ? 'kayla-button-active' 
              : 'bg-red-500 hover:bg-red-600'
          } text-white font-semibold shadow-2xl min-w-[240px] min-h-[64px] text-lg transition-colors`}
          style={{ 
            touchAction: 'manipulation', 
            WebkitTapHighlightColor: 'transparent',
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }}
        >
          <MicOff className={`mr-3 h-6 w-6 ${isSpeaking && 'kayla-mic-icon'}`} />
          <span className="font-medium">
            {isSpeaking ? 'Kayla Speaking...' : 'End Chat'}
          </span>
        </Button>
      )}
      
      {isConnected && !isSpeaking && (
        <p className="text-xs text-muted-foreground animate-pulse">
          Listening... speak naturally
        </p>
      )}
    </div>
  );
};

export default VoiceInterface;
