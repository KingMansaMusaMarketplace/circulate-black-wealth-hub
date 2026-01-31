

# Plan: Add PDF Export Feature to Pitch Deck

## Overview
Add a **"Download PDF"** button to the pitch deck header that exports all 15 slides as a professional, multi-page PDF document. The implementation will follow the existing pattern established in `TeamNDADialog.tsx`, using `html2canvas` and `jsPDF`.

---

## What You'll Get
- A download button in the pitch deck header bar
- One-click export of all 15 slides as a single PDF
- Professional letter-size (8.5" x 11") format with landscape orientation
- Loading indicator while generating
- Toast notifications for success/failure

---

## Implementation Steps

### Step 1: Create PDF Export Utility
Create a new utility function specifically for exporting pitch deck slides.

**New file:** `src/lib/utils/pitch-deck-export.ts`

This utility will:
- Render each slide in a hidden container with fixed dimensions
- Capture each slide using `html2canvas`
- Compile all slides into a single PDF using `jsPDF`
- Handle the multi-page layout automatically

### Step 2: Add Export Button to Pitch Deck Page
Modify `src/pages/PitchDeckPage.tsx` to:
- Import the new export utility
- Add state for loading indicator
- Add a "Download PDF" button next to the fullscreen toggle in the header
- Wire up the export function with proper error handling and toast notifications

---

## Technical Details

### PDF Configuration
- **Orientation:** Landscape (slides are wider than tall)
- **Page Size:** Letter (11" x 8.5" in landscape)
- **Scale:** 2x for high-quality output
- **Format:** JPEG compression at 95% quality for reasonable file size

### Export Flow
```text
┌─────────────────────────────────────────────────────────────┐
│  1. User clicks "Download PDF"                              │
│                        ↓                                    │
│  2. Loading state activates                                 │
│                        ↓                                    │
│  3. For each of 15 slides:                                  │
│     - Render slide component in hidden container            │
│     - Capture with html2canvas (2x scale)                   │
│     - Add as new page to jsPDF document                     │
│                        ↓                                    │
│  4. Save PDF with timestamped filename                      │
│                        ↓                                    │
│  5. Show success toast, clear loading state                 │
└─────────────────────────────────────────────────────────────┐
```

### Filename Format
`Mansa_Musa_Pitch_Deck_2026-01-31.pdf`

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/lib/utils/pitch-deck-export.ts` | Create (new utility) |
| `src/pages/PitchDeckPage.tsx` | Modify (add button + logic) |

---

## Estimated Export Time
~5-10 seconds depending on device performance (15 slides × html2canvas rendering)

