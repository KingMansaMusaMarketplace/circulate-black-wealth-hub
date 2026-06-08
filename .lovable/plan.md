## What you'll get

Next to every message Kayla types back (in the floating chat bubble and on the full Kayla page), a small speaker icon will appear. Click it → Kayla reads that message out loud in her voice. Click it again → it stops.

While the audio is loading, the icon spins. While it's playing, it changes to a "stop" icon.

## Where it shows up

1. **Floating Kayla chat widget** (the bubble that pops up on most pages) — `src/components/ai-chat/AIChatWidget.tsx`
2. **Full Kayla assistant page** (`/ai-assistant`) — `src/components/ai/AIAssistant.tsx`

Only Kayla's replies get the button — your own messages don't.

The widget is already hidden on iOS native (per existing rule), so nothing changes there.

## How it works under the hood (plain English)

- We already have an edge function called `elevenlabs-tts` that converts text → spoken audio using Kayla's ElevenLabs voice ("Sarah" voice ID — the one she already uses elsewhere on the site). No new server code or new API keys needed.
- We'll build a small reusable React component, `<SpeakMessageButton text={...} />`, that:
  - Shows a speaker icon
  - On click, calls the existing `elevenlabs-tts` edge function
  - Plays the returned MP3 in the browser
  - Tracks "only one message playing at a time" so clicking a different message stops the previous one
- We drop that button next to each assistant message in the two chat components above.

## Files touched

- **NEW** `src/components/ai/SpeakMessageButton.tsx` — the reusable speaker button (~60 lines)
- **EDIT** `src/components/ai-chat/AIChatWidget.tsx` — render the button under each assistant message
- **EDIT** `src/components/ai/AIAssistant.tsx` — same, for the full page

No database changes. No new secrets. No edge function changes.

## What you'll need to do after

Nothing — as long as the existing `ELEVEN_LABS_API_KEY` secret is still set (it is, since Kayla's voice already works elsewhere). Just click the speaker icon on any reply to test.

## Heads-up on cost

Each click of the speaker button sends text to ElevenLabs and counts against your ElevenLabs character quota — same as your existing voice features. Long replies cost more characters than short ones. If you'd like, I can add a max-length cap (e.g. only read the first 500 characters) to protect your quota — say the word and I'll add it.

Ready to build?