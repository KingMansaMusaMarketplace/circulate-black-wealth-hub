

# Elevate "Ask Kayla" to Hero-Level Differentiator

## Vision
Transform Kayla from a small floating button at the bottom of the screen into the **primary hero feature** of 1325.AI -- the thing visitors see and remember. No other Black business directory has a voice AI concierge. This is the differentiator.

---

## What Changes

### 1. Add "Talk to Kayla" CTA in the Hero Section
**File:** `src/components/Hero.tsx`

Add a third, visually distinct CTA button alongside "Explore Businesses" and "How It Works". This button will feature:
- An animated microphone icon with a subtle pulse/glow effect
- Text: **"Talk to Kayla"** with a subline "Your AI guide"
- Wired directly to the `useVoiceConnection` hook's `startConversation()` 
- Styled with the existing `kayla-button-idle` gradient (purple/blue) so it stands out from the gold primary CTA

The Hero component will import and use `useVoiceConnection` directly, and show the `VoiceTranscript` + active state inline when connected.

### 2. Create a "Meet Kayla" Showcase Section
**New file:** `src/components/HomePage/MeetKaylaSection.tsx`

A dedicated homepage section inserted **after ThreePillars** in `HomePageSections.tsx`. Contains:
- Headline: "Meet Kayla -- Your AI-Powered Guide"
- Subtext explaining she can help find businesses, book stays, get ride info, and answer questions about the platform
- 3-4 capability cards (e.g., "Find Businesses", "Book a Stay", "Get a Ride", "Learn the Mission") with icons
- A large, animated "Try it now" button that triggers `startConversation()`
- Animated sound wave / microphone visualization using CSS keyframes (no heavy libraries)

### 3. Add Animated Voice Visualization CSS
**File:** `src/index.css`

Add new keyframes for a sound-wave animation used in the MeetKayla section:
- `@keyframes sound-wave` -- 3 bars oscillating at different speeds
- `.kayla-wave-bar` utility classes
- A subtle glow ring animation for the "Try it now" button

### 4. Wire Kayla into HomePageSections
**File:** `src/components/HomePage/HomePageSections.tsx`

- Lazy-load `MeetKaylaSection`
- Insert it between ThreePillars and CTA Section with error boundary and suspense

### 5. Keep the Floating VoiceInterface
The existing floating `VoiceInterface` in `HomePage.tsx` stays as-is. It serves as the persistent access point once a user scrolls past the hero. The hero CTA and showcase section are **additional entry points** to the same `startConversation` logic.

---

## Technical Details

- The Hero's "Talk to Kayla" button will call `useVoiceConnection().startConversation()` directly. When connected, the hero CTA area will show a compact active state (transcript + end button) using the existing `VoiceButton` and `VoiceTranscript` components.
- `MeetKaylaSection` will be a presentational component; clicking "Try it now" scrolls to the hero and triggers the voice button, OR directly invokes the floating VoiceInterface via a shared callback/ref passed through context or a simple DOM scroll + click pattern.
- iPad fallback logic is already handled in `useVoiceConnection` -- no additional work needed.
- Sound wave animation is pure CSS (3 `div` bars with staggered `animation-delay`), keeping bundle size zero.

---

## Files Summary

| Action | File |
|--------|------|
| Edit | `src/components/Hero.tsx` -- Add "Talk to Kayla" CTA with voice hook |
| Create | `src/components/HomePage/MeetKaylaSection.tsx` -- Showcase section |
| Edit | `src/components/HomePage/HomePageSections.tsx` -- Insert MeetKayla |
| Edit | `src/index.css` -- Sound wave + glow keyframes |

