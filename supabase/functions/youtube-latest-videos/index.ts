const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

const CHANNEL_HANDLE = '1325AI';
const MAX_RESULTS = 6;
const CACHE_TTL_SECONDS = 3600; // 1 hour
// deploy trigger

interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
}

let cache: { data: YouTubeVideo[]; expiresAt: number } | null = null;

async function resolveChannelId(apiKey: string): Promise<string | null> {
  // Try handle-based lookup first
  const url = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=@${CHANNEL_HANDLE}&key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error('Channel lookup failed:', res.status, await res.text());
    return null;
  }
  const data = await res.json();
  return data?.items?.[0]?.id ?? null;
}

async function fetchLatestVideos(apiKey: string, channelId: string): Promise<YouTubeVideo[]> {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${MAX_RESULTS}&order=date&type=video&key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`YouTube search failed [${res.status}]: ${await res.text()}`);
  }
  const data = await res.json();
  return (data.items ?? []).map((item: any) => ({
    videoId: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail:
      item.snippet.thumbnails?.maxres?.url ??
      item.snippet.thumbnails?.high?.url ??
      item.snippet.thumbnails?.medium?.url,
    publishedAt: item.snippet.publishedAt,
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
  }));
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

    // Serve from cache if fresh
    const now = Date.now();
    if (cache && cache.expiresAt > now) {
      return new Response(JSON.stringify({ videos: cache.data, cached: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const channelId = await resolveChannelId(apiKey);
    if (!channelId) {
      return new Response(
        JSON.stringify({ error: `Could not resolve channel @${CHANNEL_HANDLE}`, videos: [] }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const videos = await fetchLatestVideos(apiKey, channelId);
    cache = { data: videos, expiresAt: now + CACHE_TTL_SECONDS * 1000 };

    return new Response(JSON.stringify({ videos, cached: false }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('youtube-latest-videos error:', message);
    return new Response(JSON.stringify({ error: message, videos: [] }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
