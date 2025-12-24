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
      
      // Create audio element first - must happen before any async operations on iOS
      this.createAudioElement();
      
      // Check for required APIs before proceeding
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Microphone access not available on this device');
      }
      
      if (typeof RTCPeerConnection === 'undefined') {
        throw new Error('WebRTC not supported on this device');
      }
      
      console.log('Getting ephemeral token...');
      
      // Get ephemeral token from our Supabase Edge Function
      const { data, error } = await supabase.functions.invoke("realtime-token", {
        body: {},
      });
      
      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to connect to voice service');
      }

      console.log('Token response received');
      
      if (!data?.client_secret?.value) {
        throw new Error("Failed to get ephemeral token - please try again");
      }

      const EPHEMERAL_KEY = data.client_secret.value;
      console.log('Got ephemeral token');

      // Request microphone BEFORE creating peer connection (important for iOS)
      console.log('Requesting microphone access...');
      try {
        this.localStream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } 
        });
        console.log('Microphone access granted');
      } catch (micError) {
        console.error('Microphone access denied:', micError);
        throw new Error('Microphone permission denied. Please allow microphone access and try again.');
      }

      // Create peer connection with STUN servers for better connectivity
      this.pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      });

      // Set up remote audio handler
      this.pc.ontrack = async (e) => {
        console.log('Received remote audio track');
        if (this.audioEl) {
          this.audioEl.srcObject = e.streams[0];
          try {
            await this.audioEl.play();
            console.log('Remote audio playback started');
          } catch (err) {
            console.warn('Autoplay blocked:', err);
            // On iOS, audio may need user interaction - it will play on next interaction
          }
        }
      };

      // Add local audio track
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        this.pc.addTrack(audioTrack, this.localStream);
      }

      // Set up data channel
      this.dc = this.pc.createDataChannel("oai-events");
      this.dc.addEventListener("message", (e) => {
        const event = JSON.parse(e.data);
        console.log("Received event:", event);
        this.onMessage(event);
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
        console.error('OpenAI SDP error:', errorText);
        throw new Error(`OpenAI connection failed: ${sdpResponse.status}`);
      }

      const answer = {
        type: "answer" as RTCSdpType,
        sdp: await sdpResponse.text(),
      };
      
      await this.pc.setRemoteDescription(answer);
      console.log("WebRTC connection established");

    } catch (error) {
      console.error("Error initializing chat:", error);
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
