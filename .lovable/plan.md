# HeyGen Integration — Phase 1 (Admin-Only, No History)

## Goal
Let you (admin) generate spokesperson videos for 1325.AI from inside the app using your HeyGen API key, without exposing the key or burning credits on public users.

## What gets built

### 1. Secret storage
- Add `HEYGEN_API_KEY` as a project secret (encrypted, server-only).
- I'll trigger the secure prompt — you paste the key into a Lovable form, not into chat.

### 2. Two edge functions (server-side middlemen)
- **`heygen-generate-video`** — accepts `{ script, avatar_id, voice_id, title }`, calls HeyGen's `/v2/video/generate`, returns `{ video_id }`.
- **`heygen-video-status`** — accepts `{ video_id }`, calls HeyGen's `/v1/video_status.get`, returns `{ status, video_url, thumbnail_url }`.
- Both require an authenticated admin user (checked via `has_role(auth.uid(), 'admin')`).
- Both include the standard CORS headers + `x-csrf-token` per project rules.

### 3. Hidden admin page: `/admin/heygen`
- Route guarded — redirects non-admins to `/`.
- Not linked from public nav.
- Form fields:
  - **Title** (label only, for your reference on screen)
  - **Script** (textarea, up to ~1500 chars — HeyGen's safe limit)
  - **Avatar ID** (text input — you paste your HeyGen avatar ID; we can upgrade to a dropdown later)
  - **Voice ID** (text input — same)
- **Generate** button → calls `heygen-generate-video` → shows the returned `video_id`.
- **Poll status** automatically every 8 seconds until status = `completed` or `failed`.
- On completion: inline video player + **Download MP4** button + copy-link button.
- Toast notifications for rate-limit / credit errors from HeyGen.

## What's NOT in this phase
- No database table (no history saved — refresh = gone, as you requested).
- No avatar/voice picker UI (you paste IDs from HeyGen dashboard).
- No public access, no paid-tier access.
- No auto-posting, no captions, no thumbnails generation.

## Cost guardrail
Admin role check on both edge functions = only you can spend HeyGen credits. Zero risk of public abuse.

## Brand & compliance
- No payment changes.
- No public copy changes.
- No IP/investor surface touched.
- `1325.AI` branding only in any UI strings.

## Technical details (for reference)
```text
/admin/heygen (React route, admin-guarded)
        │
        ▼
supabase.functions.invoke('heygen-generate-video')
        │
        ▼
Edge Function — verifies JWT + admin role
        │
        ▼
POST https://api.heygen.com/v2/video/generate
   Header: X-Api-Key: HEYGEN_API_KEY
        │
        ▼
returns { video_id }  →  client polls heygen-video-status every 8s
```

## What I need from you to proceed
1. Click "Implement plan."
2. When the secure secret prompt appears, paste your HeyGen API key (from HeyGen → Space Settings → API).
3. Have one **Avatar ID** and one **Voice ID** ready from your HeyGen account so we can test end-to-end (HeyGen → Avatars → click any avatar → copy ID; same for Voices).

That's it — once you click implement, I'll build all three pieces in one pass and we'll test together.