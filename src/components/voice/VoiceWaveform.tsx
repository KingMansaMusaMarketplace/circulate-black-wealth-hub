import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface VoiceWaveformProps {
  isActive: boolean;
  isSpeaking: boolean;
  barCount?: number;
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({
  isActive,
  isSpeaking,
  barCount = 5,
}) => {
  const bars = Array.from({ length: barCount });

  return (
    <div className="flex items-center justify-center gap-[3px] h-8">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full"
          style={{
            backgroundColor: isSpeaking
              ? 'hsl(258 90% 66%)'
              : 'hsl(258 90% 66% / 0.4)',
          }}
          animate={
            isActive
              ? {
                  height: isSpeaking
                    ? [4, 12 + Math.random() * 16, 4]
                    : [4, 8 + Math.random() * 6, 4],
                }
              : { height: 4 }
          }
          transition={{
            duration: isSpeaking ? 0.4 + i * 0.08 : 0.8 + i * 0.12,
            repeat: isActive ? Infinity : 0,
            ease: 'easeInOut',
            delay: i * 0.05,
          }}
        />
      ))}
    </div>
  );
};

export default VoiceWaveform;
