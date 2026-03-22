import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { RealtimeChat } from '@/utils/RealtimeAudio';
import { supabase } from '@/integrations/supabase/client';

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
  const [isExecutingTool, setIsExecutingTool] = useState(false);
  const [activeToolName, setActiveToolName] = useState<string | null>(null);
  const voiceRef = useRef<RealtimeChat | null>(null);

  // Tool call handler — invokes kayla-tools edge function
  const handleToolCall = useCallback(async (toolName: string, args: any, callId: string) => {
    console.log('[Kayla] Executing tool:', toolName, args);
    setIsExecutingTool(true);
    setActiveToolName(toolName);
    try {
      const { data, error } = await supabase.functions.invoke('kayla-tools', {
        body: { tool: toolName, arguments: args },
      });
      if (error) throw error;
      return data;
    } finally {
      setIsExecutingTool(false);
      setActiveToolName(null);
    }
  }, []);

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

    // Tool call UI states
    if (event.type === 'tool_call.start') {
      setIsExecutingTool(true);
      setActiveToolName(event.tool);
      const toolLabels: Record<string, string> = {
        search_businesses: 'Searching businesses...',
        get_business_details: 'Looking up details...',
        get_nearby_businesses: 'Finding nearby businesses...',
        check_loyalty_points: 'Checking your points...',
        get_upcoming_bookings: 'Checking your bookings...',
        get_churn_alerts: 'Analyzing churn risk...',
        get_deal_pipeline: 'Pulling deal pipeline...',
        get_agent_stats: 'Getting agent stats...',
      };
      setTranscript(toolLabels[event.tool] || 'Looking that up...');
    }
    if (event.type === 'tool_call.done') {
      setIsExecutingTool(false);
      setActiveToolName(null);
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

  const startConversation = async (): Promise<{ blocked: boolean; reason?: string } | void> => {
    try {
      // Check if already connecting
      if (isConnecting) {
        return { blocked: true, reason: 'already_connecting' };
      }

      // Pre-flight checks - these are safe even if they fail
      if (!navigator.mediaDevices?.getUserMedia) {
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

      // CRITICAL: Request microphone IMMEDIATELY in the user gesture handler
      // Safari/iOS requires getUserMedia to be called directly from user interaction
      // Any async operation (like haptics) before this breaks the gesture chain
      let micStream: MediaStream;
      try {
        console.log('[Kayla] Requesting microphone (direct user gesture)...');
        micStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        console.log('[Kayla] Microphone access granted');
      } catch (micError: any) {
        const micErrorName = micError?.name ?? 'UnknownError';
        const micErrorMessage = String(micError?.message ?? '');
        const isSecureContext = window.isSecureContext;
        const isEmbeddedPreview = window.self !== window.top;
        const isIPhone = /iPhone|iPod/.test(navigator.userAgent);
        const isIPadDevice =
          /iPad/.test(navigator.userAgent) ||
          (navigator.platform === 'MacIntel' &&
            navigator.maxTouchPoints > 1 &&
            !/iPhone/.test(navigator.userAgent) &&
            'ontouchstart' in window &&
            window.innerWidth <= 1366);
        const isIOSDevice = isIPhone || isIPadDevice;

        let micPermissionState: PermissionState | 'unknown' = 'unknown';
        try {
          if (navigator.permissions?.query) {
            const status = await navigator.permissions.query({ name: 'microphone' as PermissionName });
            micPermissionState = status.state;
          }
        } catch {
          // Permissions API may be unavailable in some browsers
        }

        const deniedByPolicy = /permissions? policy|feature policy|disallow/i.test(micErrorMessage);

        console.error('[Kayla] Microphone denied:', {
          name: micErrorName,
          message: micErrorMessage,
          isSecureContext,
          isEmbeddedPreview,
          micPermissionState,
        });

        if (!isSecureContext) {
          toast.error('Secure Connection Required', {
            description: 'Voice requires HTTPS. Open the app using a secure URL and try again.',
          });
        } else if (micErrorName === 'NotAllowedError') {
          if (isIOSDevice) {
            toast.error('Microphone Access Required', {
              description: 'Please allow microphone access in Settings > Safari > Microphone',
            });
          } else if (isEmbeddedPreview && (deniedByPolicy || micPermissionState !== 'granted')) {
            toast.error('Microphone Access Required', {
              description: 'Microphone is blocked in this embedded preview. Open the app in a new tab, allow microphone, then try again.',
            });
          } else if (micPermissionState === 'denied') {
            toast.error('Microphone Access Required', {
              description: 'Microphone is blocked in your browser. Click the lock icon in the address bar, allow microphone, and retry.',
            });
          } else {
            toast.error('Microphone Access Required', {
              description: 'Microphone access denied. Please allow microphone access and try again.',
            });
          }
        } else if (micErrorName === 'NotFoundError') {
          toast.error('No Microphone Found', {
            description: 'Please connect a microphone and try again.',
          });
        } else {
          toast.error('Microphone Error', {
            description: micErrorMessage || 'Could not access microphone.',
          });
        }

        return { blocked: true, reason: 'mic_denied' };
      }

      // Now safe to do async operations - mic is already acquired
      await triggerHaptics('medium');
      setIsConnecting(true);

      const timeoutId = setTimeout(() => {
        console.error('[Kayla] Connection timeout after 20 seconds');
        setIsConnecting(false);
        micStream.getTracks().forEach(t => t.stop());
        toast.error('Connection Timeout', {
          description: 'Taking too long to connect. Please try again.',
        });
      }, 20000);

      try {
        if (!window.isSecureContext) {
          micStream.getTracks().forEach(t => t.stop());
          throw new Error('Voice features require a secure connection (HTTPS)');
        }

        const voice = new RealtimeChat(handleMessage);
        voice.setToolCallHandler(handleToolCall);
        await voice.init(micStream);

        clearTimeout(timeoutId);
        voiceRef.current = voice;
        setIsConnected(true);

        toast.success('Connected to Kayla', {
          description: 'Start speaking naturally - I can hear you!',
        });

        return { blocked: false };
      } catch (error: any) {
        clearTimeout(timeoutId);
        micStream.getTracks().forEach(t => t.stop());
        console.error('[Kayla] Error starting conversation:', error);

        let errorMessage = error.message || 'Failed to start conversation';
        let errorTitle = 'Connection Failed';

        toast.error(errorTitle, { description: errorMessage });
        return { blocked: true, reason: 'error' };
      } finally {
        setIsConnecting(false);
      }
    } catch (outerError) {
      // Catch any unexpected synchronous errors to prevent crash
      console.error('[Kayla] Unexpected outer error:', outerError);
      setIsConnecting(false);
      toast.error('Voice Unavailable', {
        description: 'Voice features are not available on this device.',
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
    isExecutingTool,
    activeToolName,
    transcript,
    startConversation,
    endConversation,
  };
};
