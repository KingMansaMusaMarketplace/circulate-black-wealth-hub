
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, ExternalLink } from 'lucide-react';

interface VideoCard {
  videoId: string;
  title: string;
  description: string;
  accent: 'blue' | 'gold';
  delay: number;
}

const videos: VideoCard[] = [
  {
    videoId: '-TjgPI4kid4',
    title: 'How Circulation Works',
    description: 'Learn about the circulation of wealth within communities.',
    accent: 'blue',
    delay: 0.1,
  },
  {
    videoId: '-8M3YSYjKM0',
    title: 'Marketplace Benefits',
    description: 'Discover the benefits of two brothers creating an empowerment zone for community businesses.',
    accent: 'blue',
    delay: 0.2,
  },
  {
    videoId: 'sn19xvfoXvk',
    title: 'Join Our Team',
    description: "Let's help one another get out of economic enslavement.",
    accent: 'gold',
    delay: 0.3,
  },
];

const VideoThumbnail: React.FC<{ video: VideoCard; onPlay: (id: string) => void }> = ({ video, onPlay }) => {
  const [imgError, setImgError] = useState(false);
  const thumbnailUrl = imgError
    ? `https://img.youtube.com/vi/${video.videoId}/sddefault.jpg`
    : `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`;
  const titleColor = video.accent === 'gold' ? 'text-yellow-400' : 'text-blue-300';
  const hoverBorder = video.accent === 'gold' ? 'hover:border-yellow-400/50' : 'hover:border-blue-400/50';

  return (
    <motion.button
      type="button"
      onClick={() => onPlay(video.videoId)}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: video.delay }}
      viewport={{ once: true }}
      className={`group block w-full text-left shadow-xl rounded-2xl overflow-hidden border-2 border-white/20 ${hoverBorder} hover:shadow-2xl transition-all duration-300 hover:scale-105 backdrop-blur-xl bg-white/10`}
    >
      <div className="relative aspect-video overflow-hidden bg-black">
        <img
          src={thumbnailUrl}
          alt={video.title}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
          <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
            <Play className="h-7 w-7 text-white ml-1" fill="currentColor" />
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className={`font-bold text-xl mb-2 ${titleColor}`}>{video.title}</h3>
        <p className="text-white/90 font-medium">{video.description}</p>
      </div>
    </motion.button>
  );
};

const SponsorshipVideoSection = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveVideo(null);
    };
    if (activeVideo) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [activeVideo]);

  return (
    <section className="py-16 relative overflow-hidden backdrop-blur-xl bg-white/5">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-extrabold mb-4 text-white">See The Impact</h2>
          <p className="text-lg font-semibold text-white/90 max-w-2xl mx-auto">
            Watch how if we stick together in our communities and businesses we can transform economic circulation of black empowerment.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <VideoThumbnail key={video.videoId} video={video} onPlay={setActiveVideo} />
          ))}
        </div>
      </div>

      {/* Video lightbox modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl"
            >
              <div className="flex items-center justify-between mb-3">
                <a
                  href={`https://www.youtube.com/watch?v=${activeVideo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open on YouTube
                </a>
                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  aria-label="Close video"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo}?autoplay=1&rel=0`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SponsorshipVideoSection;
