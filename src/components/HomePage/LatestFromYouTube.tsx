import React, { useEffect, useState } from 'react';
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

const LatestFromYouTube: React.FC = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
              <InlineYouTubePlayer
                key={video.videoId}
                videoId={video.videoId}
                title={video.title}
                thumbnail={video.thumbnail}
                publishedAt={video.publishedAt}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestFromYouTube;
