

# Plan: Enable Kayla Voice on iPad

Remove the iPad-specific block in `useVoiceConnection.ts` and let iPad users use voice with the same iOS safety mitigations already in place for iPhone.

---

## Changes

### 1. Remove iPad block in `useVoiceConnection.ts`

**File:** `src/components/voice/useVoiceConnection.ts`

- Remove the early-return iPad detection block (lines 135-151) that returns `{ blocked: true, reason: 'ipad' }`
- The existing iOS audio hardening (deferred audio, throttled init, reduced retries) already applies to iPad since it checks for iOS generically
- Keep the secondary iPad detection in the mic error handler (lines 193-200) since it's used for better error messaging, not blocking

### 2. Remove iPad fallback UI from VoiceInterface

**File:** `src/components/VoiceInterface.tsx`

- Remove the `showIPadFallback` state and the `IPadVoiceFallback` modal rendering
- Remove the `blocked`/`reason === 'ipad'` check in `handleStart`
- Remove the `IPadVoiceFallback` import

### 3. Clean up unused fallback component

**File:** `src/components/voice/iPadVoiceFallback.tsx` — Delete this file (no longer needed)

**File:** `src/components/voice/index.ts` — Remove the `IPadVoiceFallback` export

---

## What stays the same

- All existing iOS audio safety measures (deferred audio element creation, skipping `refreshSession` on Capacitor iOS, throttled initialization delays, reduced playback retries) continue to protect iPad
- The mic error handler still identifies iPad for better diagnostic logging
- The `isIOSDevice` checks throughout the codebase already include iPad

## Risk

Low. iPad Safari has the same WebRTC/audio capabilities as iPhone Safari. The hardening measures are already iOS-generic. If instability does occur, it will be caught by the existing error recovery and global error handlers.

