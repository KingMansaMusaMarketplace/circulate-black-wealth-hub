import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { requireAuth, authErrorResponse } from "../_shared/auth-guard.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const auth = await requireAuth(req, corsHeaders);
    if (!auth.authenticated) return authErrorResponse(auth, corsHeaders);

    const { text, voice = 'marin', instructions } = await req.json();
    
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
      headers['OpenAI-Organization'] = OPENAI_ORG_ID;
    }
    if (useProj) {
      headers['OpenAI-Project'] = OPENAI_PROJECT_ID;
    }
    console.log('OpenAI routing headers applied (TTS):', { org: !!useOrg, project: !!useProj });

    // Natural, human delivery direction for the expressive TTS model.
    const DEFAULT_INSTRUCTIONS =
      "Speak like a warm, confident woman in her 30s having a real conversation — " +
      "not an announcer and not a robot. Relaxed, friendly, conversational pace. " +
      "Use natural pauses at commas and periods, let your pitch rise and fall, " +
      "and put gentle emphasis on the words that matter. Smile through the words.";

    const speak = (model: string, withInstructions: boolean) =>
      fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model,
          input: inputText,
          voice,
          response_format: 'opus',
          speed: 1.0,
          ...(withInstructions ? { instructions: instructions || DEFAULT_INSTRUCTIONS } : {}),
        }),
      });

    // Expressive model first; fall back to the older engine only if unavailable.
    let response = await speak('gpt-4o-mini-tts', true);
    if (!response.ok && (response.status === 400 || response.status === 404)) {
      console.warn('gpt-4o-mini-tts unavailable, falling back to tts-1-hd');
      response = await speak('tts-1-hd', false);
    }

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
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
