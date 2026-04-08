import { supabase } from '@/integrations/supabase/client';

export class AudioRecorder {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;

  constructor(private onAudioData: (audioData: Float32Array) => void) {}

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      this.audioContext = new AudioContext({
        sampleRate: 24000,
      });
      
      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        this.onAudioData(new Float32Array(inputData));
      };
      
      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }

  stop() {
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export class RealtimeChat {
  private pc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  private audioEl: HTMLAudioElement | null = null;
  private recorder: AudioRecorder | null = null;
  private localStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private onToolCall: ((toolName: string, args: any, callId: string) => Promise<any>) | null = null;
  private isCapacitorIOS: boolean = false;

  constructor(private onMessage: (message: any) => void) {
    // Defer audio element creation to init() for better iOS compatibility
  }

  setToolCallHandler(handler: (toolName: string, args: any, callId: string) => Promise<any>) {
    this.onToolCall = handler;
  }

  private createAudioElement() {
    const isCapacitorIOS = !!(window as any).Capacitor?.isNativePlatform?.() &&
      /iPhone|iPad|iPod/.test(navigator.userAgent);

    try {
      this.audioEl = document.createElement("audio");
      this.audioEl.autoplay = true;
      this.audioEl.setAttribute('playsinline', 'true');
      this.audioEl.setAttribute('webkit-playsinline', 'true');
      this.audioEl.setAttribute('controls', 'false');
      // Set volume to max
      this.audioEl.volume = 1.0;
      this.audioEl.muted = false;
      
      // Keep element visible in DOM (hidden but accessible) to satisfy autoplay policies
      this.audioEl.style.position = 'fixed';
      this.audioEl.style.bottom = '100px';
      this.audioEl.style.left = '50%';
      this.audioEl.style.transform = 'translateX(-50%)';
      this.audioEl.style.width = '1px';
      this.audioEl.style.height = '1px';
      this.audioEl.style.opacity = '0.01'; // Nearly invisible but not hidden
      this.audioEl.style.pointerEvents = 'none';
      this.audioEl.style.zIndex = '-1';
      
      if (document.body) {
        document.body.appendChild(this.audioEl);
        console.log('[Audio] Audio element created and attached to DOM');
      }

      // CRITICAL: Skip silent play() on Capacitor iOS — calling play() with no source
      // crashes WKWebView. The element will auto-play when srcObject is set later.
      if (!isCapacitorIOS) {
        try {
          const silentPlay = this.audioEl.play();
          if (silentPlay) {
            silentPlay.then(() => {
              console.log('[Audio] Audio element unlocked via silent play');
            }).catch(() => {
              console.log('[Audio] Silent play rejected (expected if no src yet)');
            });
          }
        } catch (e) {
          console.log('[Audio] Silent unlock attempt completed');
        }
      } else {
        console.log('[Audio] Skipping silent play on Capacitor iOS to prevent WKWebView crash');
      }
    } catch (e) {
      console.error('[Audio] Could not create audio element:', e);
    }
  }
  
  private async initAudioContext() {
    // CRITICAL: Skip AudioContext entirely on Capacitor iOS.
    // Creating an AudioContext and playing a silent buffer can crash WKWebView.
    // WebRTC handles audio natively without needing this unlock trick.
    const isCapacitorIOS = !!(window as any).Capacitor?.isNativePlatform?.() &&
      /iPhone|iPad|iPod/.test(navigator.userAgent);

    if (isCapacitorIOS) {
      console.log('[Audio] Skipping AudioContext init on Capacitor iOS to prevent crash');
      return;
    }

    try {
      // Create AudioContext to unlock audio on iOS/Safari (browser only)
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        console.warn('[Audio] No AudioContext available');
        return;
      }
      
      this.audioContext = new AudioCtx();
      
      if (this.audioContext.state === 'suspended') {
        console.log('[Audio] AudioContext suspended, resuming...');
        await this.audioContext.resume().catch(() => {});
      }
      
      console.log('[Audio] AudioContext state:', this.audioContext.state);
      
      // Play a silent buffer to fully unlock audio
      try {
        const buffer = this.audioContext.createBuffer(1, 1, 22050);
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.start(0);
        console.log('[Audio] Silent buffer played to unlock audio');
      } catch (bufferError) {
        console.warn('[Audio] Silent buffer play failed:', bufferError);
      }
    } catch (e) {
      console.warn('[Audio] AudioContext init failed:', e);
    }
  }

  async init(preAcquiredStream?: MediaStream) {
    try {
      console.log('Initializing RealtimeChat...');
      
      // iPad detection - specific check for iPad devices
      const isIPad = /iPad/.test(navigator.userAgent) || 
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1 && !/iPhone/.test(navigator.userAgent) && 'ontouchstart' in window && window.innerWidth <= 1366);
      
      // iOS detection for special handling
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      
      // Capacitor/WKWebView detection
      const isCapacitor = !!(window as any).Capacitor?.isNativePlatform?.();
      const isCapacitorIOS = isCapacitor && isIOS;
      
      console.log('Device is iOS:', isIOS, 'Device is iPad:', isIPad, 'Capacitor:', isCapacitor);
      this.isCapacitorIOS = isCapacitorIOS;
      
      // CRITICAL: iPad early exit to prevent crashes (Apple rejection fix)
      if (isIPad) {
        console.log('[iPad] Blocking voice initialization to prevent crash');
        throw new Error('Voice features are optimized for iPhone. Please visit our website for the best iPad experience.');
      }
      
      // Check for required APIs before proceeding
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Microphone access not available on this device');
      }
      
      if (typeof RTCPeerConnection === 'undefined') {
        throw new Error('WebRTC not supported on this device');
      }

      // iOS Safari/WKWebView crash prevention
      if (isIOS) {
        console.log('[iOS] Applying iOS-specific safeguards...');
      }

      // CRITICAL: On Capacitor iOS, force garbage collection pause before heavy work
      // WKWebView has strict memory limits; give it time to settle
      if (isCapacitorIOS) {
        console.log('[iOS Native] Pre-initialization memory settle pause...');
        await new Promise(r => setTimeout(r, 300));
      }
      
      // Use pre-acquired stream if available (preserves user gesture chain)
      if (preAcquiredStream) {
        console.log('Using pre-acquired microphone stream');
        this.localStream = preAcquiredStream;
      } else {
        // Fallback: request microphone directly
        console.log('Requesting microphone access...');
        try {
          this.localStream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
              ...(isIOS ? {} : { sampleRate: 24000 })
            } 
          });
          console.log('Microphone access granted, tracks:', this.localStream.getAudioTracks().length);
        } catch (micError: any) {
          console.error('Microphone access denied:', micError);
          if (micError.name === 'NotAllowedError') {
            throw new Error('Microphone permission denied. Please allow microphone access in your device settings and try again.');
          } else if (micError.name === 'NotFoundError') {
            throw new Error('No microphone found on this device.');
          } else if (micError.name === 'AbortError' || micError.name === 'NotReadableError') {
            throw new Error('Microphone is in use by another app. Please close other apps and try again.');
          } else {
            throw new Error(`Microphone error: ${micError.message || 'Unknown error'}`);
          }
        }
      }

      // CRITICAL: On Capacitor iOS, yield to the run loop after getUserMedia
      // to prevent WKWebView from accumulating too much work in one frame
      if (isCapacitorIOS) {
        console.log('[iOS Native] Yielding after mic acquisition (longer pause)...');
        await new Promise(r => setTimeout(r, 500));
      }
      
      // Create audio element AFTER microphone permission granted
      // On Capacitor iOS, skip entirely — Kayla replies via text transcript only (no audio output)
      if (!isCapacitorIOS) {
        try {
          this.createAudioElement();
        } catch (audioElError) {
          console.warn('[Audio] Audio element creation failed, continuing without:', audioElError);
        }
      }
      
      // Initialize AudioContext to unlock audio playback on iOS/Safari
      // Wrapped in try-catch to prevent WKWebView crash
      if (!isCapacitorIOS) {
        try {
          await this.initAudioContext();
        } catch (acError) {
          console.warn('[Audio] AudioContext init failed, continuing:', acError);
        }
      }
      
      console.log('Getting ephemeral token...');

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      if (!supabaseUrl || !supabasePublishableKey) {
        this.localStream?.getTracks().forEach(t => t.stop());
        this.localStream = null;
        throw new Error('Supabase environment is not configured for voice connection');
      }

      // Refresh only when a user session exists; guests are allowed.
      // On Capacitor iOS, skip refresh to reduce async work and prevent WKWebView crash
      const { data: sessionData } = await supabase.auth.getSession();
      let accessToken = sessionData.session?.access_token ?? null;

      if (accessToken && !isCapacitorIOS) {
        const { data: refreshedData, error: refreshError } = await supabase.auth.refreshSession();
        if (!refreshError && refreshedData.session?.access_token) {
          accessToken = refreshedData.session.access_token;
          console.log('[Auth] Session refreshed successfully');
        } else if (refreshError) {
          console.warn('[Auth] Session refresh failed, falling back to guest mode:', refreshError.message);
          accessToken = null;
        }
      } else if (isCapacitorIOS) {
        console.log('[iOS Native] Skipping session refresh to reduce WKWebView pressure');
      }

      const tokenResponse = await fetch(`${supabaseUrl}/functions/v1/realtime-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabasePublishableKey,
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({}),
      });

      const rawTokenBody = await tokenResponse.text();
      let data: any = {};

      try {
        data = rawTokenBody ? JSON.parse(rawTokenBody) : {};
      } catch {
        data = { error: rawTokenBody };
      }

      if (!tokenResponse.ok) {
        const message = data?.error || data?.message || `Failed to connect to voice service (${tokenResponse.status})`;
        console.error('Edge function error:', tokenResponse.status, message);
        this.localStream?.getTracks().forEach(t => t.stop());
        this.localStream = null;
        throw new Error(message);
      }

      console.log('Token response received');
      
      if (!data?.client_secret?.value) {
        // Clean up microphone on error
        this.localStream?.getTracks().forEach(t => t.stop());
        this.localStream = null;
        throw new Error("Failed to get ephemeral token - please try again");
      }

      const EPHEMERAL_KEY = data.client_secret.value;
      console.log('Got ephemeral token');

      // On Capacitor iOS, add a longer pause before WebRTC init to let WKWebView settle
      if (isCapacitorIOS) {
        console.log('[iOS Native] Adding 1.5s delay before RTCPeerConnection to prevent WKWebView crash');
        await new Promise(r => setTimeout(r, 1500));
      }

      // Create peer connection
      // On Capacitor iOS, skip STUN servers to reduce network overhead and memory pressure
      console.log('Creating RTCPeerConnection...');
      this.pc = new RTCPeerConnection({
        iceServers: isCapacitorIOS ? [] : [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      // Set up remote audio handler
      // On Capacitor iOS: completely skip audio playback to prevent WKWebView crash
      // Kayla's responses are shown as text transcripts instead
      if (isCapacitorIOS) {
        this.pc.ontrack = () => {
          console.log('[Audio] Remote track received but IGNORED on Capacitor iOS (text-only mode)');
        };
      } else {
        this.pc.ontrack = async (e) => {
          try {
            console.log('[Audio] Received remote audio track');
            if (!this.audioEl) {
              try { this.createAudioElement(); } catch (elErr) {
                console.warn('[Audio] Lazy audio element creation failed:', elErr);
              }
            }
            if (this.audioEl && e.streams[0]) {
              this.audioEl.srcObject = e.streams[0];
              this.audioEl.muted = false;
              this.audioEl.volume = 1.0;
              if (this.audioContext && this.audioContext.state === 'suspended') {
                try { await this.audioContext.resume(); } catch {}
              }
              const attemptPlay = async (attempt: number = 1) => {
                try {
                  if (attempt > 1) {
                    this.audioEl!.muted = true;
                    await new Promise(r => setTimeout(r, 50));
                    this.audioEl!.muted = false;
                  }
                  await this.audioEl!.play();
                  console.log('[Audio] Playback started successfully!');
                } catch (err: any) {
                  console.warn(`[Audio] Play attempt ${attempt} failed:`, err.message);
                  if (attempt < 5) {
                    await new Promise(resolve => setTimeout(resolve, 200 * attempt));
                    return attemptPlay(attempt + 1);
                  }
                  this.onMessage({ type: 'audio_blocked', message: 'Please tap to enable audio' });
                }
              };
              await attemptPlay();
            }
          } catch (trackError) {
            console.error('[Audio] ontrack handler error:', trackError);
          }
        };
      }
      
      // Handle connection state changes
      this.pc.onconnectionstatechange = () => {
        console.log('Connection state:', this.pc?.connectionState);
        if (this.pc?.connectionState === 'failed') {
          console.error('WebRTC connection failed');
          this.onMessage({ type: 'error', message: 'Connection failed' });
        }
      };
      
      this.pc.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', this.pc?.iceConnectionState);
      };

      // Add local audio track
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        console.log('Adding audio track to peer connection');
        this.pc.addTrack(audioTrack, this.localStream);
      } else {
        throw new Error('No audio track available from microphone');
      }

      // CRITICAL: On Capacitor iOS, yield between heavy WebRTC operations
      if (isCapacitorIOS) {
        console.log('[iOS Native] Yielding after addTrack before data channel...');
        await new Promise(r => setTimeout(r, 300));
      }

      // Set up data channel
      console.log('Creating data channel...');
      this.dc = this.pc.createDataChannel("oai-events");
      this.dc.addEventListener("message", async (e) => {
        try {
          const event = JSON.parse(e.data);
          console.log("Received event:", event.type);

          // Handle function calls from OpenAI
          if (event.type === 'response.function_call_arguments.done' && this.onToolCall) {
            console.log('[Kayla] Tool call received:', event.name, event.arguments);
            this.onMessage({ type: 'tool_call.start', tool: event.name });
            try {
              const args = JSON.parse(event.arguments || '{}');
              const result = await this.onToolCall(event.name, args, event.call_id);
              // Send result back to OpenAI
              if (this.dc && this.dc.readyState === 'open') {
                this.dc.send(JSON.stringify({
                  type: 'conversation.item.create',
                  item: {
                    type: 'function_call_output',
                    call_id: event.call_id,
                    output: JSON.stringify(result)
                  }
                }));
                this.dc.send(JSON.stringify({ type: 'response.create' }));
                console.log('[Kayla] Tool result sent back to OpenAI');
              }
              this.onMessage({ type: 'tool_call.done', tool: event.name });
            } catch (toolError: any) {
              console.error('[Kayla] Tool execution failed:', toolError);
              if (this.dc && this.dc.readyState === 'open') {
                this.dc.send(JSON.stringify({
                  type: 'conversation.item.create',
                  item: {
                    type: 'function_call_output',
                    call_id: event.call_id,
                    output: JSON.stringify({ error: toolError.message || 'Tool execution failed' })
                  }
                }));
                this.dc.send(JSON.stringify({ type: 'response.create' }));
              }
              this.onMessage({ type: 'tool_call.done', tool: event.name });
            }
            return;
          }

          this.onMessage(event);
        } catch (parseError) {
          console.error('Failed to parse event:', parseError);
        }
      });
      
      this.dc.addEventListener("open", () => {
        console.log('[Kayla] Data channel opened - session already configured via ephemeral token');
        
        // NOTE: The session is ALREADY configured with voice, instructions, and modalities 
        // when we create the ephemeral token in realtime-token edge function.
        
        // Notify the message handler that the connection is ready
        this.onMessage({ type: 'session.ready', message: 'Kayla is ready to listen' });
        
        // CRITICAL: Trigger Kayla to greet the user proactively
        // Without this, Kayla just listens but doesn't speak first
        setTimeout(() => {
          if (this.dc && this.dc.readyState === 'open') {
            console.log('[Kayla] Sending greeting trigger...');
            
            // Create a system-initiated greeting
            const greetingEvent = {
              type: 'conversation.item.create',
              item: {
                type: 'message',
                role: 'user',
                content: [{
                  type: 'input_text',
                  text: 'Hello! I just connected.'
                }]
              }
            };
            
            this.dc.send(JSON.stringify(greetingEvent));
            this.dc.send(JSON.stringify({ type: 'response.create' }));
            console.log('[Kayla] Greeting trigger sent - Kayla should respond now');
          }
        }, 500);
      });
      
      this.dc.addEventListener("error", (e) => {
        console.error('Data channel error:', e);
      });

      // Create and set local description
      console.log('Creating offer...');
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

      // On Capacitor iOS, pause before the network-heavy SDP exchange
      if (isCapacitorIOS) {
        console.log('[iOS Native] Yielding before SDP exchange...');
        await new Promise(r => setTimeout(r, 500));
      }

      // Connect to OpenAI's Realtime API
      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview";
      
      console.log('Connecting to OpenAI Realtime API...');
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp"
        },
      });

      if (!sdpResponse.ok) {
        const errorText = await sdpResponse.text();
        console.error('OpenAI SDP error:', sdpResponse.status, errorText);
        throw new Error(`Voice service connection failed (${sdpResponse.status})`);
      }

      const answerSdp = await sdpResponse.text();
      const answer = {
        type: "answer" as RTCSdpType,
        sdp: answerSdp,
      };
      
      await this.pc.setRemoteDescription(answer);
      console.log("WebRTC connection established successfully");

    } catch (error: any) {
      console.error("Error initializing chat:", error);
      console.error("Error name:", error?.name);
      console.error("Error message:", error?.message);
      // Clean up on error
      this.disconnect();
      throw error;
    }
  }

  private encodeAudioData(float32Array: Float32Array): string {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    
    const uint8Array = new Uint8Array(int16Array.buffer);
    let binary = '';
    const chunkSize = 0x8000;
    
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    
    return btoa(binary);
  }

  async sendMessage(text: string) {
    if (!this.dc || this.dc.readyState !== 'open') {
      throw new Error('Data channel not ready');
    }

    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text
          }
        ]
      }
    };

    this.dc.send(JSON.stringify(event));
    this.dc.send(JSON.stringify({type: 'response.create'}));
  }

  disconnect() {
    console.log('Disconnecting RealtimeChat...');
    
    try {
      // Stop recorder
      this.recorder?.stop();
      this.recorder = null;
      
      // Close data channel
      if (this.dc) {
        this.dc.close();
        this.dc = null;
      }
      
      // Close peer connection
      if (this.pc) {
        this.pc.close();
        this.pc = null;
      }
      
      // Stop local media stream tracks
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => {
          track.stop();
        });
        this.localStream = null;
      }
      
      // Close AudioContext
      if (this.audioContext) {
        this.audioContext.close().catch(() => {});
        this.audioContext = null;
      }
      
      // Clean up audio element
      if (this.audioEl) {
        this.audioEl.pause();
        this.audioEl.srcObject = null;
        if (this.audioEl.parentNode) {
          this.audioEl.parentNode.removeChild(this.audioEl);
        }
        this.audioEl = null;
      }
      
      console.log('RealtimeChat disconnected');
    } catch (e) {
      console.error('Error during disconnect:', e);
    }
  }
}
