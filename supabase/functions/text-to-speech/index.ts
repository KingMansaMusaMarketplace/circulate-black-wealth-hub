import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voice = 'alloy' } = await req.json();
    
    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // OpenAI TTS has a 4096 character limit - truncate if needed
    const MAX_CHARS = 4000;
    const inputText = text.length > MAX_CHARS 
      ? text.substring(0, MAX_CHARS) + '... Text truncated for speech.'
      : text;

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const OPENAI_ORG_ID = Deno.env.get('OPENAI_ORG_ID');
    const OPENAI_PROJECT_ID = Deno.env.get('OPENAI_PROJECT_ID');

    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Converting text to speech: "${inputText.substring(0, 50)}..." (${inputText.length} chars)`);

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    };

    // Include org and project IDs if valid
    const useOrg = OPENAI_ORG_ID && OPENAI_ORG_ID.startsWith('org_');
    const useProj = OPENAI_PROJECT_ID && OPENAI_PROJECT_ID.startsWith('proj_');
    if (useOrg) {
      headers['OpenAI-Organization'] = OPENAI_ORG_ID!;
    }
    if (useProj) {
      headers['OpenAI-Project'] = OPENAI_PROJECT_ID!;
    }
    console.log('OpenAI routing headers applied (TTS):', { org: !!useOrg, project: !!useProj });

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'tts-1',
        input: inputText,
        voice: voice,
        response_format: 'opus',
        speed: 1.10,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI TTS API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate speech', details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const audioData = await response.arrayBuffer();
    console.log(`Successfully generated ${audioData.byteLength} bytes of audio`);

    return new Response(audioData, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/ogg',
        'Content-Length': audioData.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('Error in text-to-speech function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
