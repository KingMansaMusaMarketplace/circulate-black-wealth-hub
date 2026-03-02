import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceWaveform } from './VoiceWaveform';

interface VoiceButtonProps {
  isConnected: boolean;
  isConnecting: boolean;
  isSpeaking: boolean;
  isExecutingTool?: boolean;
  onStart: () => void;
  onEnd: () => void;
}

const buttonStyles = {
  touchAction: 'manipulation' as const,
  WebkitTapHighlightColor: 'transparent',
  WebkitUserSelect: 'none' as const,
  userSelect: 'none' as const,
};

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  isConnected,
  isConnecting,
  isSpeaking,
  isExecutingTool = false,
  onStart,
  onEnd,
}) => {
  return (
    <AnimatePresence mode="wait">
      {!isConnected ? (
        <motion.div
          key="idle"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <Button
            onClick={onStart}
            disabled={isConnecting}
            size="default"
            className="kayla-button-idle hover:opacity-90 text-white font-semibold shadow-lg min-w-[180px] min-h-[48px] text-sm"
            style={buttonStyles}
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="font-medium text-sm">Connecting...</span>
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                <span className="font-medium text-sm">Ask Kayla</span>
              </>
            )}
          </Button>
        </motion.div>
      ) : (
        <motion.div
          key="active"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="flex flex-col items-center gap-2"
        >
          {/* Waveform visualizer */}
          <VoiceWaveform
            isActive={isConnected}
            isSpeaking={isSpeaking}
          />

          <Button
            onClick={onEnd}
            size="lg"
            className={`${
              isExecutingTool
                ? 'bg-amber-500 hover:bg-amber-600'
                : isSpeaking
                ? 'kayla-button-active'
                : 'bg-red-500 hover:bg-red-600'
            } text-white font-semibold shadow-2xl min-w-[240px] min-h-[64px] text-lg transition-colors`}
            style={buttonStyles}
          >
            {isExecutingTool ? (
              <>
                <Search className="mr-3 h-6 w-6 animate-pulse" />
                <span className="font-medium">Looking up...</span>
              </>
            ) : (
              <>
                <MicOff className={`mr-3 h-6 w-6 ${isSpeaking && 'kayla-mic-icon'}`} />
                <span className="font-medium">
                  {isSpeaking ? 'Kayla Speaking...' : 'End Chat'}
                </span>
              </>
            )}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceButton;
