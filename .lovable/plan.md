## What we're adding

Three AI upgrades, shipped as small, isolated edge functions + UI surfaces. None of them touch existing payment, auth, or Kayla agent routing logic.

---

### 1. Vision AI — Photo-to-Product (vendor onboarding)

**Where:** Product image upload form (`src/components/business/product-images/form/`)

**Flow:**
1. Vendor uploads/selects a product photo (existing flow already captures `previewUrl`)
2. New "✨ Auto-fill from photo" button appears next to the upload area
3. Calls new edge function `analyze-product-image` → Lovable AI Gateway with `google/gemini-2.5-pro` (vision)
4. Returns: `{ title, category, suggestedPrice, description, tags[], altText }`
5. Auto-populates form fields; vendor reviews and submits

**Files:**
- NEW: `supabase/functions/analyze-product-image/index.ts`
- NEW: `src/hooks/use-product-image-analysis.ts`
- EDIT: `src/components/business/product-images/form/tabs/SingleUploadTab.tsx` (add button)

---

### 2. Real-time Web Search for Kayla

**Where:** Kayla agent edge function (will locate via search — likely `supabase/functions/kayla-*/index.ts`)

**Flow:**
1. Add new tool `web_search` to Kayla's AI SDK tool set
2. Tool uses **Firecrawl connector** (`firecrawl/v2/search`) — gives Kayla live web results + scraped content
3. Kayla auto-invokes when user asks: "What are competitors charging?", "Latest grant deadlines for Black-owned businesses?", "Current Chicago BHM events?"
4. Results fold into Kayla's existing streaming response

**Files:**
- EDIT: Kayla's main agent edge function (add `web_search` tool)
- Requires: Firecrawl connector linked (will prompt user via `standard_connectors--connect`)

---

### 3. AI Image Generation — Marketing Studio

**Where:** New tab in business dashboard

**Flow:**
1. New "Marketing Studio" section with prompt input + style presets (Banner / Social Post / Promo Flyer)
2. Calls new edge function `generate-marketing-image` → Lovable AI Gateway with `google/gemini-3-pro-image-preview`
3. Generated image previews; vendor can download or save directly to their `marketing_materials` table (already exists per `src/types/marketing-material.ts`)
4. Auto-fills dimensions based on preset (1200x400 banner, 1080x1080 social, etc.)

**Files:**
- NEW: `supabase/functions/generate-marketing-image/index.ts`
- NEW: `src/components/business/marketing-studio/MarketingStudio.tsx`
- NEW: `src/hooks/use-marketing-image-gen.ts`
- EDIT: Business dashboard page to add the new tab/route

---

## Order of work

1. Ship #1 (Vision AI) first — smallest blast radius, biggest "wow" for vendor onboarding
2. Ship #3 (Marketing Studio) — uses same gateway pattern
3. Ship #2 (Kayla web search) — requires Firecrawl connector approval from you

## Tech notes

- All three use the existing **Lovable AI Gateway** pattern (no new API keys needed for #1 and #3)
- #2 needs **Firecrawl connector** (free tier available; I'll prompt you to connect when we get there)
- All edge functions follow existing CORS + `x-csrf-token` rules from project memory
- All UI components use semantic tokens (MansaBlue/MansaGold theme)
- Brand copy stays "1325.AI" as primary
