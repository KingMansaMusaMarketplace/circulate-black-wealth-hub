import React from 'react';

interface VoiceTranscriptProps {
  transcript: string;
}

export const VoiceTranscript: React.FC<VoiceTranscriptProps> = ({ transcript }) => {
  if (!transcript) return null;

  return (
    <div className="bg-background/95 backdrop-blur-sm border rounded-lg px-4 py-3 max-w-md shadow-lg animate-in fade-in slide-in-from-bottom-2">
      <p className="text-sm">{transcript}</p>
    </div>
  );
};

export default VoiceTranscript;
