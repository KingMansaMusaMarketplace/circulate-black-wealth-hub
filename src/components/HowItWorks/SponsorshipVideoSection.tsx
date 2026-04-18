import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Youtube, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/button';
import InlineYouTubePlayer from '@/components/video/InlineYouTubePlayer';

interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
}

const SponsorshipVideoSection = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke('youtube-latest-videos');
        if (cancelled) return;
        if (!error && data?.videos?.length) {
          setVideos(data.videos.slice(0, 3));
        }
      } catch {
        // graceful no-op
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Hide entirely if no videos load (e.g. API key not configured)
  if (!loading && videos.length === 0) {
    return null;
  }

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
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Youtube className="h-5 w-5 text-red-500" />
            <span className="text-sm font-semibold uppercase tracking-wider text-mansagold">
              Latest from {siteConfig.youtube.channelHandle}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">See The Impact</h2>
          <p className="text-lg font-semibold text-white/90 max-w-2xl mx-auto">
            Fresh from the 1325AI channel — watch how circulating wealth in our communities transforms economic empowerment.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-video bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video, index) => {
                const isAccent = index === 2;
                const titleClass = isAccent
                  ? 'text-yellow-400'
                  : 'text-blue-300';
                const hoverBorder = isAccent
                  ? 'hover:border-yellow-400/50'
                  : 'hover:border-blue-400/50';
                return (
                  <motion.div
                    key={video.videoId}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                    viewport={{ once: true }}
                  >
                    <InlineYouTubePlayer
                      videoId={video.videoId}
                      title={video.title}
                      thumbnail={video.thumbnail}
                      publishedAt={video.publishedAt}
                      titleClassName={`${titleClass} text-lg`}
                      cardClassName="shadow-xl border-2 border-white/20 backdrop-blur-xl bg-white/10"
                      hoverBorderClassName={hoverBorder}
                    />
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-10 flex justify-center">
              <Button
                variant="outline"
                onClick={() => window.open(siteConfig.youtube.channelUrl, '_blank', 'noopener,noreferrer')}
                className="border-mansagold/40 text-mansagold hover:bg-mansagold/10"
              >
                Visit 1325AI Channel <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default SponsorshipVideoSection;
