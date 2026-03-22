

# Implementation Plan: Kayla Business Dashboard, Self-Serve Upgrade, Investor PDF, and Outreach Draft

This plan covers four interconnected features that transform Kayla from an internal engine into a visible, revenue-generating product.

---

## Feature 1: Kayla Business Dashboard

**Goal:** Surface Kayla's internal AI outputs (review drafts, churn alerts, onboarding messages, B2B matches) to business owners via a new "Kayla AI" tab on the Business Dashboard.

### Database
- Create a `kayla_business_insights` table to store per-business AI outputs:
  - `id`, `business_id`, `insight_type` (review_draft, churn_alert, onboarding_tip, b2b_match, content_suggestion), `title`, `content`, `status` (pending, approved, dismissed), `metadata` (JSONB), `created_at`
- RLS: Business owners can read their own insights; service_role writes them

### Backend
- Update `kayla-event-processor` to insert rows into `kayla_business_insights` whenever it processes events for reviews, onboarding, churn, B2B matching, or content generation
- Each service handler writes a user-facing summary alongside its internal processing

### Frontend
- New component: `src/components/business/kayla/KaylaInsightsDashboard.tsx`
  - Fetches from `kayla_business_insights` for the current business
  - Cards grouped by type: Review Drafts (with approve/edit/dismiss), Churn Alerts, B2B Opportunities, Content Suggestions
  - Real-time subscription via Supabase Realtime
- Add a 7th tab "Kayla AI" to `BusinessDashboardPage.tsx` (with Sparkles icon, gold accent)

---

## Feature 2: Self-Serve Upgrade Flow (One-Click $100/mo Stripe Checkout)

**Goal:** Allow any of the 33,505 listed businesses to subscribe to Kayla's AI services via a simple upgrade button.

### Stripe Setup
- Create a new Stripe Product "Kayla AI Employee" with a $100/mo recurring price
- Store the `price_id` in the subscription tiers config

### Frontend
- New component: `src/components/business/kayla/KaylaUpgradeCard.tsx`
  - Renders on the Kayla AI tab for non-subscribers
  - Shows value proposition: "Your AI Employee handles reviews, finds B2B partners, predicts churn"
  - One-click "Activate Kayla - $100/mo" button
  - Uses existing `subscriptionService.createCheckoutSession()` with the new tier
- Add `kayla_ai` tier to `subscription-tiers.ts` ($100/mo)
- Gate the Kayla insights content behind subscription check (show preview for free, full access for subscribers)

### Backend
- The existing `create-checkout` edge function handles this -- just pass the new price_id
- The existing `check-subscription` function returns the tier

---

## Feature 3: Investor Technical Capability PDF

**Goal:** Generate a one-page investor-ready PDF showing the 33,505 listings, Kayla's 7 services, dual revenue model, verified Stripe pipeline, and 27-claim patent portfolio.

### Implementation
- Script-based generation using `reportlab` (written to `/mnt/documents/`)
- Content sections:
  1. Header: "1325.AI -- Technical Capability Summary" with logo
  2. Platform Scale: 33,505 listings, 250+ tables, 110+ Edge Functions
  3. Kayla Agentic AI: 7 services diagram, event-driven pub/sub architecture
  4. Revenue Model: Dual stream (7.5% marketplace + $100/mo PaaS)
  5. Security: HMAC SHA-256 verified transactions, Wealth Ticker
  6. IP Portfolio: USPTO 63/969,202, 27 claims
  7. Valuation Range: $5M-$8M pre-revenue, $15M-$25M at scale
- Brand colors: `#1a1f2e` (mansablue), `#d4a843` (mansagold), black background theme

---

## Feature 4: Kayla Outreach Draft

**Goal:** Draft the automated pitch message Kayla sends to the 33,505 listed businesses to convert them to paying subscribers.

### Implementation
- Create an edge function `kayla-business-outreach` that:
  - Queries businesses without active subscriptions
  - Uses Lovable AI (Gemini) to personalize a pitch based on each business's category, location, review count, and view metrics
  - Stores the draft in `kayla_business_insights` with type `upgrade_pitch`
  - Template includes: ROI data from ValueTracker, competitor comparison, one-click upgrade link
- Create a new component `src/components/business/kayla/KaylaOutreachPreview.tsx` that surfaces the pitch on the business dashboard
- Admin can trigger batch outreach from the Admin AI Command Center

### Email Template Structure
- Subject: "[Business Name], your free AI Employee is ready"
- Body: Personalized ROI projection, 3 bullet value props, CTA button to `/subscription?tier=kayla_ai`

---

## Technical Details

```text
Architecture Flow:
                                                    
  Business signs up → Kayla processes events →      
  Insights written to kayla_business_insights →     
  Real-time push to Kayla AI tab →                  
  Business sees value → Clicks "Activate" →         
  Stripe Checkout ($100/mo) → Webhook validates →   
  Wealth Ticker updates → Full Kayla access unlocked
                                                    
  Outreach Pipeline:                                
  pg_cron triggers → kayla-business-outreach →      
  AI personalizes pitch → Stored as insight →       
  Surfaced on dashboard + sent via email            
```

### Files to Create/Edit
- **New DB migration**: `kayla_business_insights` table + RLS
- **Edit**: `supabase/functions/kayla-event-processor/index.ts` (write insights)
- **New**: `supabase/functions/kayla-business-outreach/index.ts`
- **New**: `src/components/business/kayla/KaylaInsightsDashboard.tsx`
- **New**: `src/components/business/kayla/KaylaUpgradeCard.tsx`
- **New**: `src/components/business/kayla/KaylaOutreachPreview.tsx`
- **Edit**: `src/pages/BusinessDashboardPage.tsx` (add Kayla AI tab)
- **Edit**: `src/lib/services/subscription-tiers.ts` (add kayla_ai tier)
- **Script**: PDF generation via reportlab to `/mnt/documents/`

### Execution Order
1. Database migration (kayla_business_insights)
2. Subscription tier + Stripe product setup
3. Kayla Insights Dashboard + Upgrade Card (frontend)
4. Update kayla-event-processor to write insights
5. Outreach edge function + preview component
6. Generate Investor PDF
7. Add Kayla AI tab to Business Dashboard

