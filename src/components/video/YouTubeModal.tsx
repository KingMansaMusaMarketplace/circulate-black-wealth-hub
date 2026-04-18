import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface YouTubeModalProps {
  videoId: string | null;
  title?: string;
  onClose: () => void;
}

const YouTubeModal: React.FC<YouTubeModalProps> = ({ videoId, title, onClose }) => {
  useEffect(() => {
    if (!videoId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [videoId, onClose]);

  if (!videoId) return null;

  // Use standard youtube.com domain (broader embed permissions than youtube-nocookie)
  // Pass origin for referrer-based embed allowlists
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&origin=${encodeURIComponent(origin)}`;
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Video player'}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
        aria-label="Close video"
      >
        <X className="h-6 w-6" />
      </button>
      <div
        className="relative w-full max-w-5xl aspect-video"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={src}
          title={title || 'YouTube video'}
          className="w-full h-full rounded-xl shadow-2xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-sm text-white/80 hover:text-white underline underline-offset-4"
        >
          Having trouble? Watch on YouTube →
        </a>
      </div>
    </div>
  );
};

export default YouTubeModal;
