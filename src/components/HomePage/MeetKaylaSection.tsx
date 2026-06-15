import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceConnection } from '@/components/voice';
import { VoiceTranscript } from '@/components/voice';
import { useCapacitor } from '@/hooks/use-capacitor';
import meetKaylaVideo from '@/assets/meet-kayla-upgraded.mp4.asset.json';

// CRITICAL iOS: Completely skip mounting Kayla on iOS.
// The WKWebView crashes when the WebRTC voice stack initializes,
// so the entire section is omitted on iOS (also satisfies App Store review).
const MeetKaylaSection: React.FC = () => {
  const { platform } = useCapacitor();
  if (platform === 'ios') return null;
  return <MeetKaylaSectionInner />;
};

const MeetKaylaSectionInner: React.FC = () => {
  const isIOS = false;

  const {
    isConnected,
    isConnecting,
    isSpeaking,
    transcript,
    startConversation,
    endConversation,
  } = useVoiceConnection({});

  const handleStart = async () => {
    try {
      await startConversation();
    } catch (error) {
      console.error('[MeetKayla] Error starting:', error);
    }
  };

  return (
    <section className="pt-2 pb-8 md:pt-4 md:pb-12 relative">

      <div className="max-w-5xl mx-auto px-4">
        {/* Section label */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-label text-xl md:text-2xl tracking-widest">Agentic AI Concierge</span>
          <h2 className="font-playfair text-6xl md:text-7xl lg:text-8xl font-bold mb-3 text-mansagold drop-shadow-[0_0_20px_rgba(184,134,11,0.7)] [text-shadow:0_0_30px_rgba(184,134,11,0.5),0_0_60px_rgba(184,134,11,0.3)]">
            Kayla
          </h2>
          <div className="mb-5">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-mansagold/15 text-mansagold border border-mansagold/30 backdrop-blur-sm">
              Powered by Real-Time Tools
            </span>
          </div>
          {/* Meet Kayla intro video */}
          <div className="max-w-3xl mx-auto mb-6 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <video
              src={meetKaylaVideo.url}
              controls
              playsInline
              className="w-full aspect-video"
              poster=""
            />
          </div>
          <p className="text-white/75 text-2xl md:text-3xl max-w-3xl mx-auto mb-6 leading-relaxed">
            More than a chatbot — Kayla takes action. She searches the live directory, checks your loyalty points, pulls your bookings, and delivers real answers — all by voice, in real time.
          </p>
        </motion.div>


        {/* CTA + Sound wave */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Sound wave visualization */}
          <div className="flex items-center gap-1 h-8 mb-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`kayla-wave-bar ${isConnected && isSpeaking ? 'kayla-wave-bar--active' : ''}`}
                style={{ animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </div>

          {!isIOS && (
            <>
              {!isConnected ? (
                <Button
                  onClick={handleStart}
                  disabled={isConnecting}
                  size="lg"
                  className="kayla-button-idle hover:opacity-90 text-white font-bold h-16 px-10 rounded-2xl shadow-2xl text-lg kayla-hero-glow"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-5 w-5 kayla-mic-pulse" />
                      Try it now — Talk to Kayla
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={endConversation}
                  size="lg"
                  className={`${isSpeaking ? 'kayla-button-active' : 'bg-red-500 hover:bg-red-600'} text-white font-bold h-16 px-10 rounded-2xl shadow-2xl text-lg`}
                >
                  {isSpeaking ? 'Kayla Speaking...' : 'End Chat'}
                </Button>
              )}

              {isConnected && <VoiceTranscript transcript={transcript} />}
              {isConnected && !isSpeaking && (
                <p className="text-xs text-blue-200/60 animate-pulse">Listening... speak naturally</p>
              )}
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default MeetKaylaSection;
