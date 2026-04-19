
## Plan: Fix the "See The Impact" YouTube Section

The section is hidden because the `youtube-latest-videos` edge function is returning 0 videos (or erroring). I need to investigate which of the four likely causes is the actual culprit before fixing.

### Investigation steps (in default mode)
1. **Check secrets** — confirm whether `YOUTUBE_API_KEY` exists in Supabase secrets.
2. **Read the edge function** — open `supabase/functions/youtube-latest-videos/index.ts` to understand how it resolves the channel ID and what it returns on error.
3. **Curl the function** — call it directly to see the live response (videos, error, or empty).
4. **Check edge function logs** — confirm what's happening on invocation.
5. **Verify `siteConfig.youtube.channelHandle`** is `@1325AI` (already confirmed) and whether `channelId` needs to be hardcoded.

### Likely fixes (one of these, based on findings)

**Case A — `YOUTUBE_API_KEY` is missing:**
- Request the secret via `add_secret` with instructions on how to generate a YouTube Data API v3 key in Google Cloud Console.
- Once added, the function will start returning videos automatically.

**Case B — API key exists but channel handle isn't resolving:**
- Update the edge function to hardcode the channel ID for `@1325AI` (resolve once via `channels?forHandle=@1325AI`, cache the ID), OR
- Update `siteConfig.youtube.channelId` with the resolved ID and have the function prefer it.

**Case C — Function errors out (quota, bad request, deploy issue):**
- Patch the function (fix request, add better error handling, add fallback to cached video IDs).
- Redeploy.

**Case D — Channel genuinely has no public videos:**
- Tell the user, no code fix possible — they need to publish on the channel.

### Fallback UX improvement (regardless of root cause)
Since you noticed it's missing, the silent-hide behavior is a footgun. I'll add a minimal fallback in `SponsorshipVideoSection.tsx`:
- If videos load → current behavior.
- If empty/error → render a slim "Visit our YouTube channel" card with the channel link instead of returning `null`.

This way, even if the API hiccups, slot #5 still serves its purpose (drive traffic to YouTube) instead of silently disappearing.

### Files likely touched
- `supabase/functions/youtube-latest-videos/index.ts` (read, possibly edit)
- `src/config/site.ts` (possibly add `channelId`)
- `src/components/HowItWorks/SponsorshipVideoSection.tsx` (add fallback UI)
- `src/components/HomePage/LatestFromYouTube.tsx` (may apply same fallback for consistency — though it isn't currently in the lineup)
- Add `YOUTUBE_API_KEY` secret if missing

### What you'll see when I'm done
Either real videos in slot #5, OR a clean "Visit Channel" fallback card. No more silent disappearance.
