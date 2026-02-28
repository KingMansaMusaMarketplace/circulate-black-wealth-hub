import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Mic, MicOff, Loader2 } from 'lucide-react';
import { useVoiceConnection } from '@/components/voice';
import { VoiceTranscript } from '@/components/voice';
import { IPadVoiceFallback } from '@/components/voice';

const Hero = () => {
  const [showIPadFallback, setShowIPadFallback] = useState(false);
  const {
    isConnected,
    isConnecting,
    isSpeaking,
    transcript,
    startConversation,
    endConversation,
  } = useVoiceConnection({});

  const handleTalkToKayla = async () => {
    try {
      const result = await startConversation();
      if (result && typeof result === 'object' && 'blocked' in result && result.blocked && result.reason === 'ipad') {
        setShowIPadFallback(true);
      }
    } catch (error) {
      console.error('[Hero] Error starting Kayla:', error);
    }
  };

  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center overflow-hidden">
      {showIPadFallback && (
        <IPadVoiceFallback onDismiss={() => setShowIPadFallback(false)} />
      )}

      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#050a18] to-[#030712]" />
      
      {/* Ambient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] md:w-[700px] h-[500px] md:h-[700px] bg-mansagold/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/2 rounded-full blur-[120px]" />
      </div>

      {/* Bottom gold edge transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-mansagold/5 to-transparent" />

      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <motion.h1 
            className="font-playfair text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[1.05] mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gradient-gold">Mansa Musa</span>
            <br />
            <span className="text-gradient-gold">Marketplace</span>
          </motion.h1>
          
          {/* Subhead */}
          <motion.p 
            className="text-lg md:text-xl lg:text-2xl text-blue-100/80 mb-10 max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            Discover businesses in your community. Support economic growth. Build generational wealth together.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link to="/directory">
              <Button 
                size="lg"
                className="bg-mansagold hover:bg-mansagold-dark text-mansablue-dark font-bold h-14 px-8 rounded-xl shadow-xl text-lg w-full sm:w-auto"
              >
                Explore Businesses
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            <Link to="/how-it-works">
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 font-semibold h-14 px-8 rounded-xl text-lg w-full sm:w-auto"
              >
                How It Works
              </Button>
            </Link>
          </motion.div>

          {/* Talk to Kayla CTA */}
          <motion.div
            className="mt-6 flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            {!isConnected ? (
              <Button
                onClick={handleTalkToKayla}
                disabled={isConnecting}
                size="lg"
                className="kayla-button-idle hover:opacity-90 text-white font-bold h-14 px-8 rounded-xl shadow-xl text-lg kayla-hero-glow"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-5 w-5 kayla-mic-pulse" />
                    Talk to Kayla
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={endConversation}
                size="lg"
                className={`${isSpeaking ? 'kayla-button-active' : 'bg-red-500 hover:bg-red-600'} text-white font-bold h-14 px-8 rounded-xl shadow-xl text-lg`}
              >
                <MicOff className={`mr-2 h-5 w-5 ${isSpeaking && 'kayla-mic-icon'}`} />
                {isSpeaking ? 'Kayla Speaking...' : 'End Chat'}
              </Button>
            )}
            {!isConnected && (
              <span className="text-sm text-blue-200/60">Your AI-powered guide</span>
            )}

            {/* Inline transcript when connected */}
            {isConnected && <VoiceTranscript transcript={transcript} />}
            {isConnected && !isSpeaking && (
              <p className="text-xs text-blue-200/60 animate-pulse">Listening... speak naturally</p>
            )}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="flex flex-col items-center mt-10 text-white cursor-pointer hover:text-mansagold transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <span className="text-xs tracking-widest uppercase mb-2">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
