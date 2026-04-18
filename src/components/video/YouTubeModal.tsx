import React, { useEffect, useState } from 'react';
import { X, Play, ExternalLink } from 'lucide-react';

interface YouTubeModalProps {
  videoId: string | null;
  title?: string;
  onClose: () => void;
}

const YouTubeModal: React.FC<YouTubeModalProps> = ({ videoId, title, onClose }) => {
  const [iframeBlocked, setIframeBlocked] = useState(false);

  useEffect(() => {
    if (videoId) setIframeBlocked(false);
  }, [videoId]);

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

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${encodeURIComponent(origin)}`;
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
          onError={() => setIframeBlocked(true)}
        />
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 w-full">
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-full transition-colors shadow-lg"
          >
            <ExternalLink className="h-4 w-4" />
            Watch on YouTube
          </a>
          <p className="text-xs text-white/60 text-center px-2">
            If the player shows "Content blocked", click above to watch on YouTube.
          </p>
        </div>
        {iframeBlocked && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-mansablue to-black flex flex-col items-center justify-center p-8 text-center border border-white/10">
            <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center mb-6 shadow-2xl">
              <Play className="h-10 w-10 text-white ml-1" fill="currentColor" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 max-w-2xl">
              {title || 'Watch on YouTube'}
            </h3>
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-colors shadow-lg"
            >
              <ExternalLink className="h-5 w-5" />
              Watch on YouTube
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeModal;
