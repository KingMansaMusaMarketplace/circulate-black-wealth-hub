
## Replace "Mansa Musa Marketplace" text with 1325.AI logo on Home Hero

### Recommendation
Yes — swapping the "Mansa Musa Marketplace" text below the headline for the **1325.AI logo** is the right call for the web home page. Reasons:

1. **Domain match** — visitors are on `1325.ai`, so the logo reinforces where they are.
2. **Visual upgrade** — a logo (gold neural-brain mark) is more memorable and premium than plain text.
3. **Tech/investor positioning** — signals AI infrastructure, not just a directory.
4. **Consistent with existing dual-brand strategy** — Mansa Musa stays on iOS App Store; 1325.AI owns the web.

### What I'll change

**File: `src/components/Hero.tsx`** (need to read first to confirm exact location)
- Find the "Mansa Musa Marketplace" text block sitting directly below the headline *"The Economic Operating System for Community Wealth"*.
- Replace it with the 1325.AI logo image (`src/assets/1325-ai-logo.webp` — already in the project, used in the navbar).
- Size it appropriately for the hero (roughly `h-16 md:h-20` so it's prominent but not overwhelming).
- Keep it centered, with the existing gold glow/drop-shadow treatment used elsewhere for brand consistency.
- Add proper `alt="1325.AI"` for SEO/accessibility.

**iOS conditional (important):**
- On iOS native app, keep showing "Mansa Musa Marketplace" text (App Store compliance — the app is listed under that name).
- Use the same `Capacitor.isNativePlatform() && getPlatform() === 'ios'` check already used in `src/components/navbar/Logo.tsx`.

### Result
- **Web (1325.ai):** Headline → 1325.AI logo → rest of hero
- **iOS app:** Headline → "Mansa Musa Marketplace" text → rest of hero (unchanged)

### Out of scope
- No navbar changes (already correct).
- No changes to footer, About page, or other branding mentions of Mansa Musa.
- No domain/SEO config changes.

Approve and I'll make the edit.
