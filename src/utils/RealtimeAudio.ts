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

  constructor(private onMessage: (message: any) => void) {
    // Defer audio element creation to init() for better iOS compatibility
  }

  private createAudioElement() {
    try {
      this.audioEl = document.createElement("audio");
      this.audioEl.autoplay = true;
      this.audioEl.setAttribute('playsinline', 'true');
      this.audioEl.setAttribute('webkit-playsinline', 'true');
      // Keep element in DOM to satisfy autoplay policies across browsers
      this.audioEl.style.position = 'fixed';
      this.audioEl.style.left = '-9999px';
      this.audioEl.style.width = '0';
      this.audioEl.style.height = '0';
      this.audioEl.style.opacity = '0';
      this.audioEl.style.pointerEvents = 'none';
      
      if (document.body) {
        document.body.appendChild(this.audioEl);
      }
    } catch (e) {
      console.warn('Could not create audio element:', e);
    }
  }

  async init() {
    try {
      console.log('Initializing RealtimeChat...');
      
      // iOS detection for special handling
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      console.log('Device is iOS:', isIOS);
      
      // Check for required APIs before proceeding
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Microphone access not available on this device');
      }
      
      if (typeof RTCPeerConnection === 'undefined') {
        throw new Error('WebRTC not supported on this device');
      }
      
      // Request microphone FIRST on iOS - must happen immediately after user gesture
      console.log('Requesting microphone access...');
      try {
        this.localStream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            // iOS-specific: don't request specific sample rate
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
        } else {
          throw new Error(`Microphone error: ${micError.message || 'Unknown error'}`);
        }
      }
      
      // Create audio element AFTER microphone permission granted
      this.createAudioElement();
      
      // iOS: Create and resume AudioContext to satisfy autoplay policy
      if (isIOS && this.audioEl) {
        try {
          const tempAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          if (tempAudioContext.state === 'suspended') {
            await tempAudioContext.resume();
          }
          await tempAudioContext.close();
          console.log('iOS AudioContext warmed up');
        } catch (e) {
          console.warn('AudioContext warmup failed:', e);
        }
      }
      
      console.log('Getting ephemeral token...');
      
      // Get ephemeral token from our Supabase Edge Function
      const { data, error } = await supabase.functions.invoke("realtime-token", {
        body: {},
      });
      
      if (error) {
        console.error('Edge function error:', error);
        // Clean up microphone on error
        this.localStream?.getTracks().forEach(t => t.stop());
        this.localStream = null;
        throw new Error(error.message || 'Failed to connect to voice service');
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

      // Create peer connection with STUN servers for better connectivity
      console.log('Creating RTCPeerConnection...');
      this.pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      // Set up remote audio handler
      this.pc.ontrack = async (e) => {
        console.log('Received remote audio track');
        if (this.audioEl && e.streams[0]) {
          this.audioEl.srcObject = e.streams[0];
          try {
            // iOS requires play() to be called in response to user action
            const playPromise = this.audioEl.play();
            if (playPromise !== undefined) {
              await playPromise;
            }
            console.log('Remote audio playback started');
          } catch (err: any) {
            console.warn('Autoplay blocked, will retry:', err.message);
            // Don't throw - audio will play on next user interaction
          }
        }
      };
      
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

      // Set up data channel
      console.log('Creating data channel...');
      this.dc = this.pc.createDataChannel("oai-events");
      this.dc.addEventListener("message", (e) => {
        try {
          const event = JSON.parse(e.data);
          console.log("Received event:", event.type);
          this.onMessage(event);
        } catch (parseError) {
          console.error('Failed to parse event:', parseError);
        }
      });
      
      this.dc.addEventListener("open", () => {
        console.log('Data channel opened');
      });
      
      this.dc.addEventListener("error", (e) => {
        console.error('Data channel error:', e);
      });

      // Create and set local description
      console.log('Creating offer...');
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

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
