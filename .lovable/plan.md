
# Upgrade All AI Edge Functions to Gemini 3

## What's Changing
Upgrading every edge function from the older `google/gemini-2.5-flash` model to the newer `google/gemini-3-flash-preview`, and from `google/gemini-2.5-pro` to `google/gemini-3-pro-preview` where applicable. This gives Kayla and all AI features improved reasoning and instruction-following at similar speed and cost.

## Functions Being Upgraded

### gemini-2.5-flash --> gemini-3-flash-preview (19 functions)

| # | Function | Purpose |
|---|----------|---------|
| 1 | `ai-assistant` | Kayla text chat |
| 2 | `admin-ai-assistant` | Admin AI helper |
| 3 | `ai-agent` | Autonomous business agent |
| 4 | `ai-recommendations` | User recommendations |
| 5 | `generate-ai-recommendations` | Personalized recs |
| 6 | `generate-ai-business-insights` | Business insights |
| 7 | `generate-business-insights` | Dashboard insights |
| 8 | `generate-business-description` | AI business descriptions |
| 9 | `generate-product-description` | Product copy (non-image path) |
| 10 | `generate-recommendations` | Directory recommendations |
| 11 | `generate-qr-campaign` | QR campaign suggestions |
| 12 | `generate-impact-report` | Community impact reports |
| 13 | `compare-businesses` | Side-by-side comparison |
| 14 | `parse-search-query` | Natural language search |
| 15 | `parse-business-info` | Business data extraction |
| 16 | `analyze-review-sentiment` | Review sentiment analysis |
| 17 | `analyze-material-performance` | Marketing material analysis |
| 18 | `detect-fraud` | Fraud detection |
| 19 | `b2b-match` | B2B marketplace matching |

### gemini-2.5-pro --> gemini-3-pro-preview (2 functions)

| # | Function | Purpose |
|---|----------|---------|
| 1 | `enhance-image` | AI image enhancement |
| 2 | `generate-product-description` | Product copy (image path) |

## What You'll Notice
- Better quality answers from Kayla and all AI features
- More accurate search parsing and sentiment analysis
- Improved fraud detection reasoning
- No change to speed or cost
- Voice pipeline (GPT-4o realtime, Whisper, TTS) stays unchanged -- those are OpenAI-only features

## Technical Details
- Each function gets a single-line model string replacement
- No API changes, no prompt changes, no schema changes
- All 19+2 functions will be redeployed automatically after the code updates
