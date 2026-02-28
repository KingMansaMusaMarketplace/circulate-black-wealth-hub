
# Generate AI Music Track for Jersey Promo Video

## Overview
Create an ElevenLabs-powered music generation edge function and add background music playback to the Mansa Musa Jersey promo video section on the merch page. This gives us a fully original, royalty-free track with zero copyright risk.

## Steps

### 1. Create ElevenLabs Music Edge Function
Create `supabase/functions/elevenlabs-music/index.ts` that:
- Accepts a `prompt` and optional `duration` in the request body
- Calls the ElevenLabs `/v1/music` API using the existing `ELEVEN_LABS_API_KEY` secret
- Returns raw MP3 audio bytes with proper CORS headers
- Includes error handling for missing API key and failed requests

### 2. Update `supabase/config.toml`
Add the new `elevenlabs-music` function entry with `verify_jwt = false` so it can be called from the client.

### 3. Add Music Generation UI to the Merch Promo Section
Update `src/pages/MerchStorePage.tsx` to add a small "Generate Original Music" button near the promo video section. When clicked:
- Calls the edge function with a prompt like: "Epic, cinematic hip-hop beat with African drums and gold-themed luxury vibes, 30 seconds, instrumental only"
- Shows a loading state while generating
- Plays the generated track as background audio alongside the video
- Provides play/pause and volume controls for the music

## Technical Details
- The ElevenLabs Music API endpoint is `https://api.elevenlabs.io/v1/music`
- It uses the `prompt` parameter (not `text`)
- Audio is returned as binary MP3 data -- use `fetch()` with `.blob()` on the client (not `supabase.functions.invoke()`)
- The existing `ELEVEN_LABS_API_KEY` secret will be used (already configured)
- Generated audio will be played via an `Audio` object on the client side
