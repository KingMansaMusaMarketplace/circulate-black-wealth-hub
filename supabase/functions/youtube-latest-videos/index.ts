import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

const CHANNEL_HANDLE = '1325AI';
const MAX_RESULTS = 6;
const CACHE_KEY = `channel:${CHANNEL_HANDLE}`;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const STALE_GRACE_MS = 7 * 24 * 60 * 60 * 1000; // serve up to 7 days stale if API fails

interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function readCache(): Promise<{ videos: YouTubeVideo[]; channelId: string | null; expiresAt: Date; fetchedAt: Date } | null> {
  const { data, error } = await supabase
    .from('youtube_video_cache')
    .select('videos, channel_id, expires_at, fetched_at')
    .eq('cache_key', CACHE_KEY)
    .maybeSingle();

  if (error || !data) return null;
  return {
    videos: data.videos as YouTubeVideo[],
    channelId: data.channel_id,
    expiresAt: new Date(data.expires_at),
    fetchedAt: new Date(data.fetched_at),
  };
}

async function writeCache(videos: YouTubeVideo[], channelId: string | null) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + CACHE_TTL_MS);
  const { error } = await supabase
    .from('youtube_video_cache')
    .upsert(
      {
        cache_key: CACHE_KEY,
        videos,
        channel_id: channelId,
        fetched_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
      },
      { onConflict: 'cache_key' }
    );
  if (error) console.error('Cache write failed:', error);
}

// Resolves channel id AND uploads playlist id in a single 1-unit call.
// channels.list with part=contentDetails costs 1 quota unit (vs search.list = 100).
async function resolveChannelMeta(
  apiKey: string
): Promise<{ channelId: string; uploadsPlaylistId: string } | null> {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,id&forHandle=@${CHANNEL_HANDLE}&key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error('Channel lookup failed:', res.status, await res.text());
    return null;
  }
  const data = await res.json();
  const item = data?.items?.[0];
  const channelId = item?.id;
  const uploadsPlaylistId = item?.contentDetails?.relatedPlaylists?.uploads;
  if (!channelId || !uploadsPlaylistId) return null;
  return { channelId, uploadsPlaylistId };
}

// playlistItems.list costs 1 quota unit (vs search.list = 100).
// 100x quota reduction — the "search.list for latest uploads" pattern is a known anti-pattern.
async function fetchLatestVideos(apiKey: string, uploadsPlaylistId: string): Promise<YouTubeVideo[]> {
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=${MAX_RESULTS}&key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`YouTube playlistItems failed [${res.status}]: ${await res.text()}`);
  }
  const data = await res.json();
  return (data.items ?? []).map((item: any) => {
    const videoId = item.contentDetails?.videoId ?? item.snippet?.resourceId?.videoId;
    return {
      videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail:
        item.snippet.thumbnails?.maxres?.url ??
        item.snippet.thumbnails?.high?.url ??
        item.snippet.thumbnails?.medium?.url,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${videoId}`,
    };
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('YOUTUBE_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'YOUTUBE_API_KEY not configured', videos: [] }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const now = Date.now();
    const cached = await readCache();

    // Serve fresh cache
    if (cached && cached.expiresAt.getTime() > now && cached.videos.length > 0) {
      return new Response(JSON.stringify({ videos: cached.videos, cached: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Try to refresh from YouTube API
    try {
      // Channel id alone isn't enough now — we need the uploads playlist id too.
      // Re-resolve when cache is missing the channel id (older cache entries).
      const meta = await resolveChannelMeta(apiKey);
      if (!meta) {
        // Channel resolve failed — fall back to stale cache if available
        if (cached && cached.videos.length > 0) {
          return new Response(JSON.stringify({ videos: cached.videos, cached: true, stale: true }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        return new Response(
          JSON.stringify({ error: `Could not resolve channel @${CHANNEL_HANDLE}`, videos: [] }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const videos = await fetchLatestVideos(apiKey, meta.uploadsPlaylistId);
      await writeCache(videos, meta.channelId);

      return new Response(JSON.stringify({ videos, cached: false }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (apiError) {
      // API failed (likely quota) — serve stale cache within grace window
      const message = apiError instanceof Error ? apiError.message : 'API error';
      console.error('YouTube API failed, attempting stale cache:', message);

      if (
        cached &&
        cached.videos.length > 0 &&
        now - cached.fetchedAt.getTime() < STALE_GRACE_MS
      ) {
        return new Response(
          JSON.stringify({ videos: cached.videos, cached: true, stale: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw apiError;
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? (error as Error).message : 'Unknown error';
    console.error('youtube-latest-videos error:', message);
    return new Response(JSON.stringify({ error: message, videos: [] }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
