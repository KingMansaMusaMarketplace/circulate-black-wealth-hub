import React, { useEffect, useState } from 'react';
import { Play, Youtube, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/button';
import YouTubeModal from '@/components/video/YouTubeModal';

interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
}

const LatestFromYouTube: React.FC = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<YouTubeVideo | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error: fnError } = await supabase.functions.invoke('youtube-latest-videos');
        if (cancelled) return;
        if (fnError) {
          setError(fnError.message);
        } else if (data?.videos?.length) {
          setVideos(data.videos);
        } else if (data?.error) {
          setError(data.error);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load videos');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Hide the section entirely if API key isn't configured yet — graceful no-op
  if (!loading && videos.length === 0) {
    return null;
  }

  return (
    <section className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Youtube className="h-6 w-6 text-red-500" />
              <span className="text-sm font-semibold uppercase tracking-wider text-mansagold">
                Latest from {siteConfig.youtube.channelHandle}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Watch the Movement
            </h2>
          </div>
          <Button
            variant="outline"
            onClick={() => window.open(siteConfig.youtube.channelUrl, '_blank', 'noopener,noreferrer')}
            className="border-mansagold/40 text-mansagold hover:bg-mansagold/10"
          >
            Visit Channel <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-video bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.slice(0, 6).map((video) => (
              <button
                key={video.videoId}
                type="button"
                onClick={() => setActiveVideo(video)}
                className="group block text-left w-full rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-mansagold/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-video overflow-hidden bg-black">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Play className="h-6 w-6 text-white ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white line-clamp-2 group-hover:text-mansagold transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-xs text-white/50 mt-2">
                    {new Date(video.publishedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <YouTubeModal
        videoId={activeVideo?.videoId ?? null}
        title={activeVideo?.title}
        onClose={() => setActiveVideo(null)}
      />
    </section>
  );
};

export default LatestFromYouTube;
