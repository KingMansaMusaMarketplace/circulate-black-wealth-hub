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
    console.log('[Kayla] Voice event:', event.type, event);

    // Handle session ready from our client
    if (event.type === 'session.ready') {
      console.log('[Kayla] Session ready - Kayla is listening');
    }

    // Handle session confirmation - critical for debugging
    if (event.type === 'session.created') {
      console.log('[Kayla] Session created:', event.session?.id);
      console.log('[Kayla] Session voice:', event.session?.voice);
      console.log('[Kayla] Session modalities:', event.session?.modalities);
    }
    
    if (event.type === 'session.updated') {
      console.log('[Kayla] Session updated with modalities:', event.session?.modalities);
      console.log('[Kayla] Session voice:', event.session?.voice);
      console.log('[Kayla] Turn detection:', event.session?.turn_detection?.type);
    }

    // Handle audio blocked (iOS/Safari autoplay issue)
    if (event.type === 'audio_blocked') {
      toast.info('Tap anywhere to enable audio', {
        description: 'Your browser blocked auto-play. Tap the screen to hear Kayla.',
        duration: 5000,
      });
    }

    // Handle errors from OpenAI (rate limits, etc.)
    if (event.type === 'error') {
      console.error('[Kayla] OpenAI error:', event.error);
      toast.error('Voice service error', {
        description: event.error?.message || 'Please try again'
      });
    }
    
    // Check for rate limit errors in response.done
    if (event.type === 'response.done' && event.response?.status_details?.error) {
      console.error('[Kayla] Response error:', event.response.status_details.error);
      toast.error('Voice service temporarily unavailable', {
        description: 'Please try again in a moment'
      });
    }

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
    console.log('[Kayla] Button clicked, starting conversation...');
    console.log('[Kayla] Current state - isConnecting:', isConnecting, 'isConnected:', isConnected);
    
    // Prevent double-tap issues on iOS
    if (isConnecting) {
      console.log('[Kayla] Already connecting, ignoring click');
      return;
    }
    
    // iOS detection
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    // Pre-flight checks
    console.log('[Kayla] Running pre-flight checks...');
    console.log('[Kayla] isSecureContext:', window.isSecureContext);
    console.log('[Kayla] navigator.mediaDevices available:', !!navigator.mediaDevices);
    console.log('[Kayla] RTCPeerConnection available:', !!window.RTCPeerConnection);
    console.log('[Kayla] isIOS:', isIOS);
    
    if (!navigator.mediaDevices) {
      console.error('[Kayla] navigator.mediaDevices not available');
      toast.error('Voice Not Supported', {
        description: 'Your browser does not support voice features. Please use Chrome, Safari, or Edge.'
      });
      return;
    }
    
    if (!window.RTCPeerConnection) {
      console.error('[Kayla] RTCPeerConnection not available');
      toast.error('Voice Not Supported', {
        description: 'WebRTC is not available in your browser. Please use a modern browser.'
      });
      return;
    }
    
    await triggerHaptics('medium');

    setIsConnecting(true);
    
    // Failsafe timeout - reset connecting state after 20 seconds if stuck
    const timeoutId = setTimeout(() => {
      console.error('[Kayla] Connection timeout after 20 seconds');
      setIsConnecting(false);
      toast.error('Connection Timeout', {
        description: 'Taking too long to connect. Please try again.'
      });
    }, 20000);
    
    try {
      // iOS: Check if we're in a secure context (required for getUserMedia)
      if (!window.isSecureContext) {
        throw new Error('Voice features require a secure connection (HTTPS)');
      }
      
      console.log('[Kayla] Creating RealtimeChat instance...');
      const voice = new RealtimeChat(handleMessage);
      
      console.log('[Kayla] Calling voice.init()...');
      await voice.init();
      
      console.log('[Kayla] voice.init() completed successfully');
      clearTimeout(timeoutId);
      
      voiceRef.current = voice;
      setIsConnected(true);
      
      toast.success('Connected to Kayla', {
        description: 'Start speaking naturally - I can hear you!'
      });
      console.log('[Kayla] Connection successful!');
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error('[Kayla] Error starting conversation:', error);
      console.error('[Kayla] Error name:', error?.name);
      console.error('[Kayla] Error message:', error?.message);
      console.error('[Kayla] Error stack:', error?.stack);
      
      // Provide user-friendly error messages
      let errorMessage = 'Failed to start conversation';
      let errorTitle = 'Connection Failed';
      
      if (error.name === 'NotAllowedError' || error.message?.includes('Permission denied')) {
        errorTitle = 'Microphone Access Required';
        errorMessage = isIOS 
          ? 'Please allow microphone access in Settings > Safari > Microphone'
          : 'Microphone access denied. Please allow microphone access and try again.';
      } else if (error.name === 'NotFoundError' || error.message?.includes('Requested device not found')) {
        errorMessage = 'No microphone found. Please connect a microphone and try again.';
      } else if (error.name === 'AbortError') {
        // iOS Safari sometimes throws AbortError when the page is interrupted
        errorTitle = 'Connection Interrupted';
        errorMessage = 'Please try again. Make sure no other apps are using the microphone.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Voice features are not supported on this device.';
      } else if (error.message?.includes('Microphone')) {
        errorMessage = error.message;
      } else if (error.message?.includes('WebRTC')) {
        errorMessage = 'Voice chat not supported on this device';
      } else if (error.message?.includes('token')) {
        errorMessage = 'Connection failed - please try again';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorTitle, {
        description: errorMessage
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
