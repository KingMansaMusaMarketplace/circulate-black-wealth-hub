const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, duration } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const ELEVENLABS_API_KEY = Deno.env.get('ELEVEN_LABS_API_KEY');

    if (!ELEVENLABS_API_KEY) {
      console.error('ELEVEN_LABS_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'ElevenLabs API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating music with prompt: "${prompt.substring(0, 80)}..."`);

    const response = await fetch('https://api.elevenlabs.io/v1/music', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        duration_seconds: duration || 30,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs Music API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate music', details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const audioData = await response.arrayBuffer();
    console.log(`Successfully generated ${audioData.byteLength} bytes of music`);

    return new Response(audioData, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioData.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('Error in ElevenLabs music function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
