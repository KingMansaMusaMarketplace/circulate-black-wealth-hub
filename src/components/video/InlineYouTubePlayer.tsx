import React, { useEffect, useRef, useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';

interface InlineYouTubePlayerProps {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt?: string;
  titleClassName?: string;
  cardClassName?: string;
  hoverBorderClassName?: string;
}

const InlineYouTubePlayer: React.FC<InlineYouTubePlayerProps> = ({
  videoId,
  title,
  thumbnail,
  publishedAt,
  titleClassName = 'text-white group-hover:text-mansagold',
  cardClassName = 'bg-white/5 border border-white/10',
  hoverBorderClassName = 'hover:border-mansagold/40',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [iframeBlocked, setIframeBlocked] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [useNoCookieFallback, setUseNoCookieFallback] = useState(false);
  const blockTimer = useRef<number | null>(null);

  const fallbackThumb = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
  const thumbnailUrl = imgError ? fallbackThumb : thumbnail;
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  // First try youtube-nocookie (more permissive for embeds), fall back to standard
  const host = useNoCookieFallback ? 'www.youtube.com' : 'www.youtube-nocookie.com';
  const embedSrc = `https://${host}/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

  useEffect(() => {
    if (!isPlaying) return;
    // If the iframe doesn't signal load within 5s, try the fallback host once,
    // then mark as blocked.
    blockTimer.current = window.setTimeout(() => {
      if (!useNoCookieFallback) {
        setUseNoCookieFallback(true);
      } else {
        setIframeBlocked(true);
      }
    }, 5000);
    return () => {
      if (blockTimer.current) window.clearTimeout(blockTimer.current);
    };
  }, [isPlaying, useNoCookieFallback]);

  const handleIframeLoad = () => {
    if (blockTimer.current) {
      window.clearTimeout(blockTimer.current);
      blockTimer.current = null;
    }
  };

  return (
    <div
      className={`group rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${cardClassName} ${hoverBorderClassName}`}
    >
      <div className="relative aspect-video overflow-hidden bg-black">
        {!isPlaying ? (
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              // Try inline embed first; if user cmd/ctrl-clicks, let new tab open naturally
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
              e.preventDefault();
              setIsPlaying(true);
            }}
            className="block w-full h-full text-left"
            aria-label={`Play ${title}`}
          >
            <img
              src={thumbnailUrl}
              alt={title}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
              <div className="w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Play className="h-6 w-6 text-white ml-1" fill="currentColor" />
              </div>
            </div>
          </a>
        ) : iframeBlocked ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black">
            <p className="text-white/80 text-sm mb-3">
              YouTube blocked inline playback for this video.
            </p>
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Watch on YouTube
            </a>
          </div>
        ) : (
          <iframe
            key={host}
            src={embedSrc}
            title={title}
            loading="lazy"
            onLoad={handleIframeLoad}
            onError={() => setIframeBlocked(true)}
            referrerPolicy="origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className={`font-semibold line-clamp-2 transition-colors ${titleClassName}`}>
          {title}
        </h3>
        {publishedAt && (
          <p className="text-xs text-white/50 mt-2">
            {new Date(publishedAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        )}
      </div>
    </div>
  );
};

export default InlineYouTubePlayer;
