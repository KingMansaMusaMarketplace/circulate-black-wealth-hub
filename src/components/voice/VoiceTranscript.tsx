import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TranscriptEntry {
  id: string;
  speaker: 'user' | 'kayla' | 'system';
  text: string;
}

interface VoiceTranscriptProps {
  transcript: string;
}

function parseTranscript(raw: string): TranscriptEntry | null {
  if (!raw) return null;
  const id = raw.slice(0, 20);
  if (raw.startsWith('You: ')) {
    return { id, speaker: 'user', text: raw.slice(5) };
  }
  if (raw.startsWith('Kayla: ')) {
    return { id, speaker: 'kayla', text: raw.slice(7) };
  }
  // System/tool messages (e.g. "Searching businesses...")
  return { id, speaker: 'system', text: raw };
}

export const VoiceTranscript: React.FC<VoiceTranscriptProps> = ({ transcript }) => {
  const entry = parseTranscript(transcript);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [transcript]);

  return (
    <AnimatePresence mode="wait">
      {entry && (
        <motion.div
          key={entry.speaker + entry.text.slice(0, 10)}
          ref={scrollRef}
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-background/95 backdrop-blur-sm border rounded-2xl px-4 py-3 max-w-md shadow-lg max-h-32 overflow-y-auto"
        >
          <div className="flex items-start gap-2">
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider shrink-0 mt-0.5 ${
                entry.speaker === 'user'
                  ? 'text-mansablue-light'
                  : entry.speaker === 'kayla'
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              {entry.speaker === 'user' ? 'You' : entry.speaker === 'kayla' ? 'Kayla' : ''}
            </span>
            <p className="text-sm leading-relaxed">{entry.text}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceTranscript;
