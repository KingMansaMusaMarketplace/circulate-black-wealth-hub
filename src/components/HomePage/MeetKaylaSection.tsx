import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Search, Home, Star, Calendar, TrendingUp, ShieldAlert, Database, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceConnection } from '@/components/voice';
import { VoiceTranscript } from '@/components/voice';
import { useCapacitor } from '@/hooks/use-capacitor';

const capabilities = [
  { icon: Search, title: 'Live Directory Search', description: 'Ask for a restaurant nearby — she queries the real database and reads back results.' },
  { icon: Star, title: 'Check Loyalty Points', description: "Say 'How many points do I have?' — she pulls your balance instantly." },
  { icon: Calendar, title: 'View Your Bookings', description: 'Ask about upcoming reservations — she checks your schedule.' },
  { icon: Home, title: 'Find Vacation Rentals', description: 'Describe your ideal trip — she searches Mansa Stays listings.' },
  { icon: TrendingUp, title: 'Lead Insights', description: "Ask 'How are my leads?' — she runs live qualification scoring.", badge: 'Business Owners' },
  { icon: ShieldAlert, title: 'Churn Alerts', description: 'Ask about at-risk customers — she surfaces churn predictions.', badge: 'Business Owners' },
];

const differentiators = [
  { icon: Database, label: 'Real-Time Data' },
  { icon: Mic, label: 'Voice-First' },
  { icon: Zap, label: 'Takes Action' },
];

const MeetKaylaSection: React.FC = () => {
  const { platform } = useCapacitor();
  const isIOS = platform === 'ios';

  // CRITICAL iOS: Completely bail out before initializing voice hooks.
  // The WKWebView crashes when the WebRTC voice stack initializes, so
  // the entire Kayla section must be omitted on iOS (App Store compliance + crash fix).
  if (isIOS) {
    return null;
  }

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
          <p className="text-white/75 text-2xl md:text-3xl max-w-3xl mx-auto mb-6 leading-relaxed">
            More than a chatbot — Kayla takes action. She searches the live directory, checks your loyalty points, pulls your bookings, and delivers real answers — all by voice, in real time.
          </p>
          {/* Differentiator badges */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {differentiators.map((d) => (
              <span key={d.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-mansagold bg-white/5 border border-white/10 backdrop-blur-sm">
                <d.icon className="w-3.5 h-3.5" />
                {d.label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Capability cards */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className="card-premium p-5 md:p-7 text-center group relative bg-white/10 border border-white/20 backdrop-blur-md rounded-xl"
            >
              {'badge' in cap && cap.badge && (
                <span className="absolute top-2 right-2 text-[11px] px-2 py-0.5 rounded-full bg-mansagold/20 text-mansagold font-bold border border-mansagold/40">
                  {cap.badge}
                </span>
              )}
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-mansagold/15 flex items-center justify-center group-hover:bg-mansagold/30 transition-colors">
                <cap.icon className="w-6 h-6 text-mansagold" />
              </div>
              <h3 className="text-white font-bold text-base mb-1.5">{cap.title}</h3>
              <p className="text-white/80 text-sm leading-relaxed">{cap.description}</p>
            </div>
          ))}
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
