import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { RealtimeChat } from '@/utils/RealtimeAudio';

// Safe haptics helper - lazy load to prevent iOS crashes
const triggerHaptics = async (style: 'light' | 'medium' | 'heavy') => {
  try {
    const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
    const impactStyle =
      style === 'light'
        ? ImpactStyle.Light
        : style === 'medium'
        ? ImpactStyle.Medium
        : ImpactStyle.Heavy;
    await Haptics.impact({ style: impactStyle });
  } catch (e) {
    // Haptics not available or plugin not installed - silently ignore
  }
};

interface UseVoiceConnectionOptions {
  onSpeakingChange?: (speaking: boolean) => void;
}

export const useVoiceConnection = ({ onSpeakingChange }: UseVoiceConnectionOptions = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const voiceRef = useRef<RealtimeChat | null>(null);

  const handleMessage = useCallback((event: any) => {
    console.log('[Kayla] Voice event:', event.type, event);

    if (event.type === 'session.ready') {
      console.log('[Kayla] Session ready - Kayla is listening');
    }

    if (event.type === 'session.created') {
      console.log('[Kayla] Session created:', event.session?.id);
    }

    if (event.type === 'session.updated') {
      console.log('[Kayla] Session updated with modalities:', event.session?.modalities);
    }

    if (event.type === 'audio_blocked') {
      toast.info('Tap anywhere to enable audio', {
        description: 'Your browser blocked auto-play. Tap the screen to hear Kayla.',
        duration: 5000,
      });
    }

    if (event.type === 'error') {
      console.error('[Kayla] OpenAI error:', event.error);
      toast.error('Voice service error', {
        description: event.error?.message || 'Please try again',
      });
    }

    if (event.type === 'response.done' && event.response?.status_details?.error) {
      console.error('[Kayla] Response error:', event.response.status_details.error);
      toast.error('Voice service temporarily unavailable', {
        description: 'Please try again in a moment',
      });
    }

    // Update speaking state
    if (event.type === 'response.audio.delta') {
      setIsSpeaking(true);
      onSpeakingChange?.(true);
    } else if (event.type === 'response.audio.done') {
      setIsSpeaking(false);
      onSpeakingChange?.(false);
    }

    // Display transcripts
    if (event.type === 'conversation.item.input_audio_transcription.completed') {
      setTranscript(`You: ${event.transcript}`);
      setTimeout(() => setTranscript(''), 5000);
    } else if (event.type === 'response.audio_transcript.delta') {
      setTranscript((prev) => {
        if (prev.startsWith('Kayla:')) {
          return prev + event.delta;
        }
        return `Kayla: ${event.delta}`;
      });
    } else if (event.type === 'response.audio_transcript.done') {
      setTimeout(() => setTranscript(''), 5000);
    }
  }, [onSpeakingChange]);

  const startConversation = async () => {
    try {
      if (isConnecting) return;

      // iPad detection
      const isIPad =
        /iPad/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' &&
          navigator.maxTouchPoints > 1 &&
          !/iPhone/.test(navigator.userAgent));

      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

      // iPad-specific graceful handling
      if (isIPad) {
        return { blocked: true, reason: 'ipad' };
      }

      // Pre-flight checks
      if (!navigator.mediaDevices) {
        toast.error('Voice Not Supported', {
          description: 'Your browser does not support voice features.',
        });
        return { blocked: true, reason: 'no_media_devices' };
      }

      if (!window.RTCPeerConnection) {
        toast.error('Voice Not Supported', {
          description: 'WebRTC is not available in your browser.',
        });
        return { blocked: true, reason: 'no_webrtc' };
      }

      await triggerHaptics('medium');
      setIsConnecting(true);

      const timeoutId = setTimeout(() => {
        console.error('[Kayla] Connection timeout after 20 seconds');
        setIsConnecting(false);
        toast.error('Connection Timeout', {
          description: 'Taking too long to connect. Please try again.',
        });
      }, 20000);

      try {
        if (!window.isSecureContext) {
          throw new Error('Voice features require a secure connection (HTTPS)');
        }

        const voice = new RealtimeChat(handleMessage);
        await voice.init();

        clearTimeout(timeoutId);
        voiceRef.current = voice;
        setIsConnected(true);

        toast.success('Connected to Kayla', {
          description: 'Start speaking naturally - I can hear you!',
        });

        return { blocked: false };
      } catch (error: any) {
        clearTimeout(timeoutId);
        console.error('[Kayla] Error starting conversation:', error);

        let errorMessage = 'Failed to start conversation';
        let errorTitle = 'Connection Failed';

        if (error.name === 'NotAllowedError' || error.message?.includes('Permission denied')) {
          errorTitle = 'Microphone Access Required';
          errorMessage = isIOS
            ? 'Please allow microphone access in Settings > Safari > Microphone'
            : 'Microphone access denied. Please allow microphone access and try again.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No microphone found. Please connect a microphone and try again.';
        } else if (error.name === 'AbortError') {
          errorTitle = 'Connection Interrupted';
          errorMessage = 'Please try again. Make sure no other apps are using the microphone.';
        } else if (error.message) {
          errorMessage = error.message;
        }

        toast.error(errorTitle, { description: errorMessage });
        return { blocked: true, reason: 'error' };
      } finally {
        setIsConnecting(false);
      }
    } catch (outerError) {
      console.error('[Kayla] Unexpected outer error:', outerError);
      setIsConnecting(false);
      toast.error('Unexpected Error', {
        description: 'Something went wrong. Please try again.',
      });
      return { blocked: true, reason: 'unexpected' };
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
      description: 'Conversation ended',
    });
  };

  useEffect(() => {
    return () => {
      voiceRef.current?.disconnect();
    };
  }, []);

  return {
    isConnected,
    isConnecting,
    isSpeaking,
    transcript,
    startConversation,
    endConversation,
  };
};
