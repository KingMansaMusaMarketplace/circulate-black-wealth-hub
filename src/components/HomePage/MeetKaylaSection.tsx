import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Search, Home, Car, BookOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceConnection } from '@/components/voice';
import { VoiceTranscript } from '@/components/voice';
import { IPadVoiceFallback } from '@/components/voice';

const capabilities = [
  { icon: Search, title: 'Find Businesses', description: 'Search by category, location, or just describe what you need.' },
  { icon: Home, title: 'Book a Stay', description: 'Discover Mansa Stays vacation rentals in your destination.' },
  { icon: Car, title: 'Get a Ride', description: 'Learn about Noir Ride and community transportation.' },
  { icon: BookOpen, title: 'Learn the Mission', description: 'Understand CMAL, Economic Karma, and our vision.' },
];

const MeetKaylaSection: React.FC = () => {
  const [showIPadFallback, setShowIPadFallback] = useState(false);
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
      const result = await startConversation();
      if (result && typeof result === 'object' && 'blocked' in result && result.blocked && result.reason === 'ipad') {
        setShowIPadFallback(true);
      }
    } catch (error) {
      console.error('[MeetKayla] Error starting:', error);
    }
  };

  return (
    <section className="py-8 md:py-12 relative">
      {showIPadFallback && (
        <IPadVoiceFallback onDismiss={() => setShowIPadFallback(false)} />
      )}

      <div className="max-w-5xl mx-auto px-4">
        {/* Section label */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-label">AI Concierge</span>
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Meet <span className="text-gradient-gold">Kayla</span>
          </h2>
          <p className="text-blue-100/70 text-lg md:text-xl max-w-2xl mx-auto">
            Your AI-powered guide to the entire Mansa Musa ecosystem. Just speak — she'll find businesses, book stays, and answer anything.
          </p>
        </motion.div>

        {/* Capability cards */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {capabilities.map((cap, i) => (
            <div
              key={cap.title}
              className="card-premium p-4 md:p-5 text-center group"
            >
              <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-mansagold/20 transition-colors">
                <cap.icon className="w-5 h-5 text-mansagold" />
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">{cap.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{cap.description}</p>
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
        </motion.div>
      </div>
    </section>
  );
};

export default MeetKaylaSection;
