

# AI Tools Expansion — 3 High-ROI Features

## Overview
Add three AI-powered features using existing infrastructure (Supabase Edge Functions → Lovable AI Gateway).

---

## Feature 1: AI Shopping Assistant Chat (Consumer)
A conversational chatbot on the directory/consumer side that helps users find businesses naturally.

- **Edge Function**: `ai-shopping-assistant` — accepts user messages + conversation history, queries the `businesses` table for context, calls Lovable AI Gateway with SSE streaming
- **UI Component**: `src/components/ai/ShoppingAssistantChat.tsx` — floating chat bubble on directory pages, renders markdown responses, streams tokens in real-time
- **DB Table**: `ai_chat_sessions` (id, user_id nullable, messages jsonb, created_at) with RLS
- System prompt includes knowledge of the marketplace, Black-owned business directory, and can reference live business data

## Feature 2: Smart Review Summaries (Consumer)
Auto-generated summary of all reviews for a business displayed on the business detail page.

- **Edge Function**: `ai-review-summary` — takes business_id, fetches all reviews, calls AI to generate a 2-3 sentence summary highlighting strengths and areas for improvement
- **UI Component**: `src/components/business/AIReviewSummary.tsx` — card shown on business detail page above individual reviews
- **DB Table**: `ai_review_summaries` (id, business_id, summary text, review_count, generated_at) — cached, regenerated when new reviews are added
- Non-streaming invoke call since it's a one-shot generation

## Feature 3: AI FAQ Generator (Business Owner)
Auto-generate FAQ entries from reviews, business details, and messages — feeds into the Kayla Answering Service.

- **Edge Function**: `ai-faq-generator` — takes business_id, pulls reviews + business description + category, generates 5-10 FAQ Q&A pairs
- **UI Component**: `src/components/business/AIFAQGenerator.tsx` — button in business dashboard that generates and lets owner edit/approve FAQs before saving
- **Storage**: FAQ entries saved to existing `answering_config` table's `faq_entries` field (already exists from the Kayla Answering Service plan)
- Non-streaming invoke call

---

## Technical Approach
- All edge functions use `LOVABLE_API_KEY` (already provisioned) → `google/gemini-3-flash-preview`
- CORS headers follow existing pattern with CSRF token support
- Input validation with Zod in each edge function
- 429/402 error handling surfaced as toasts to users
- Shopping Assistant uses SSE streaming; other two use standard invoke

## Implementation Order
1. AI Shopping Assistant Chat (largest, most visible)
2. Smart Review Summaries (small, high impact)
3. AI FAQ Generator (extends existing answering service)

