
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

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

const VideoThumbnail: React.FC<{ video: VideoCard }> = ({ video }) => {
  const [imgError, setImgError] = useState(false);
  const thumbnailUrl = imgError
    ? `https://img.youtube.com/vi/${video.videoId}/sddefault.jpg`
    : `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`;
  const youtubeUrl = `https://www.youtube.com/watch?v=${video.videoId}`;
  const titleColor = video.accent === 'gold' ? 'text-yellow-400' : 'text-blue-300';
  const hoverBorder = video.accent === 'gold' ? 'hover:border-yellow-400/50' : 'hover:border-blue-400/50';

  return (
    <motion.a
      href={youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: video.delay }}
      viewport={{ once: true }}
      className={`group block shadow-xl rounded-2xl overflow-hidden border-2 border-white/20 ${hoverBorder} hover:shadow-2xl transition-all duration-300 hover:scale-105 backdrop-blur-xl bg-white/10`}
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
    </motion.a>
  );
};

const SponsorshipVideoSection = () => {
  return (
    <section className="py-16 relative overflow-hidden backdrop-blur-xl bg-white/5">
      {/* Decorative gradient orbs */}
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
            <VideoThumbnail key={video.videoId} video={video} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorshipVideoSection;
