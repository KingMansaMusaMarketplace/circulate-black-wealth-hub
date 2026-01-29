
# 1325.AI Developer Platform & API Licensing Infrastructure

## Strategic Vision

Transform 1325.AI from a **Vertical SaaS (6-12x ARR)** into a **True PaaS (15-30x ARR)** by exposing your 27 patented systems as licensable APIs for external developers.

This creates **two revenue streams**:
1. **Existing**: B2C/B2B marketplace (subscription fees)
2. **New**: Developer API licensing (usage-based billing)

---

## Phase 1: Foundation - Developer Database Schema

### New Tables Required

```text
┌─────────────────────────────────────────────────────────────────┐
│                    DEVELOPER PLATFORM SCHEMA                     │
├─────────────────────────────────────────────────────────────────┤
│  developer_accounts          │  API Keys & Developer Identity   │
│  ├── id (uuid)               │                                  │
│  ├── user_id (FK profiles)   │                                  │
│  ├── company_name            │                                  │
│  ├── company_website         │                                  │
│  ├── tier (free/pro/ent)     │                                  │
│  ├── status (pending/active) │                                  │
│  └── created_at              │                                  │
├─────────────────────────────────────────────────────────────────┤
│  api_keys                    │  Key Management                  │
│  ├── id (uuid)               │                                  │
│  ├── developer_id (FK)       │                                  │
│  ├── key_hash (sha256)       │                                  │
│  ├── key_prefix (first 8)    │  For display: "1325_live_abc..." │
│  ├── name ("Production Key") │                                  │
│  ├── environment (test/live) │                                  │
│  ├── rate_limit_per_minute   │                                  │
│  ├── last_used_at            │                                  │
│  └── revoked_at              │                                  │
├─────────────────────────────────────────────────────────────────┤
│  api_usage_logs              │  Usage Metering                  │
│  ├── id (uuid)               │                                  │
│  ├── api_key_id (FK)         │                                  │
│  ├── endpoint                │  "/v1/cmal/calculate"            │
│  ├── request_timestamp       │                                  │
│  ├── response_status         │                                  │
│  ├── latency_ms              │                                  │
│  └── billed_units            │  For usage-based billing         │
├─────────────────────────────────────────────────────────────────┤
│  api_rate_limits             │  Rate Limiting State             │
│  ├── api_key_id              │                                  │
│  ├── window_start            │                                  │
│  └── request_count           │                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 2: Public API Endpoints

### API Architecture

Expose three core patented engines as RESTful APIs:

```text
BASE URL: https://api.1325.ai/v1

┌────────────────────────────────────────────────────────────────┐
│  CMAL ENGINE API (Claims 2, 3)                                 │
│  POST /v1/cmal/calculate                                       │
│  ├── Input: transaction_amount, business_category, user_tier   │
│  └── Output: multiplied_impact, circulation_score, attribution │
│                                                                │
│  POST /v1/cmal/attribute                                       │
│  ├── Input: transaction_id, chain_of_businesses[]              │
│  └── Output: attribution_breakdown, velocity_score             │
│                                                                │
│  GET /v1/cmal/impact-report                                    │
│  ├── Input: date_range, business_ids[]                         │
│  └── Output: total_circulation, multiplier_effect, breakdown   │
├────────────────────────────────────────────────────────────────┤
│  VOICE AI BRIDGE API (Claims 6, 11)                            │
│  POST /v1/voice/session/create                                 │
│  ├── Input: persona_config, vad_settings, business_context     │
│  └── Output: session_id, websocket_url                         │
│                                                                │
│  WS /v1/voice/realtime/{session_id}                            │
│  ├── Bidirectional WebSocket for PCM16 audio streaming         │
│  └── Supports persona injection, tool calling                  │
│                                                                │
│  POST /v1/voice/transcribe                                     │
│  ├── Input: audio_base64, language                             │
│  └── Output: transcription, confidence                         │
├────────────────────────────────────────────────────────────────┤
│  SUSU PROTOCOL API (Claim 15)                                  │
│  POST /v1/susu/circle/create                                   │
│  ├── Input: contribution_amount, frequency, member_count       │
│  └── Output: circle_id, escrow_address, terms                  │
│                                                                │
│  POST /v1/susu/contribution                                    │
│  ├── Input: circle_id, contributor_id, amount                  │
│  └── Output: escrow_receipt, next_payout_info                  │
│                                                                │
│  POST /v1/susu/payout/release                                  │
│  ├── Input: circle_id, round_number                            │
│  └── Output: recipient_id, amount, platform_fee                │
├────────────────────────────────────────────────────────────────┤
│  FRAUD DETECTION API (Claim 4)                                 │
│  POST /v1/fraud/analyze                                        │
│  ├── Input: transactions[], user_activity[], timeframe         │
│  └── Output: risk_score, alerts[], patterns_detected           │
│                                                                │
│  POST /v1/fraud/verify-location                                │
│  ├── Input: user_id, location_a, location_b, time_delta        │
│  └── Output: is_possible, implied_velocity, confidence         │
├────────────────────────────────────────────────────────────────┤
│  COALITION LOYALTY API (Claims 3, 8)                           │
│  POST /v1/loyalty/points/award                                 │
│  ├── Input: customer_id, business_id, base_points              │
│  └── Output: points_awarded, tier_multiplier, new_balance      │
│                                                                │
│  POST /v1/loyalty/points/redeem                                │
│  ├── Input: customer_id, business_id, redemption_amount        │
│  └── Output: redeemed, remaining_balance                       │
└────────────────────────────────────────────────────────────────┘
```

### Edge Function Implementation

Create a new edge function for each API module that:
1. Validates API key from `Authorization: Bearer 1325_live_xxx`
2. Checks rate limits against `api_rate_limits` table
3. Logs usage to `api_usage_logs` for billing
4. Executes the core patented logic
5. Returns standardized JSON responses

---

## Phase 3: Developer Portal (Frontend)

### New Pages

| Route | Component | Purpose |
|-------|-----------|---------|
| `/developers` | DeveloperLandingPage | Marketing page for API platform |
| `/developers/docs` | ApiDocumentationPage | OpenAPI/Swagger interactive docs |
| `/developers/dashboard` | DeveloperDashboard | API key management, usage stats |
| `/developers/pricing` | ApiPricingPage | Usage-based pricing tiers |
| `/developers/signup` | DeveloperSignupPage | Developer account creation |

### Developer Dashboard Features

```text
┌────────────────────────────────────────────────────────────────┐
│  DEVELOPER DASHBOARD                                           │
├────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  API Keys                                                 │  │
│  │  ┌───────────────────────────────────────────────────┐   │  │
│  │  │ Production Key: 1325_live_abc1...  [Copy] [Revoke]│   │  │
│  │  │ Test Key:       1325_test_xyz9...  [Copy] [Revoke]│   │  │
│  │  │ [+ Generate New Key]                              │   │  │
│  │  └───────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Usage This Month                                         │  │
│  │  ┌─────────┬─────────┬──────────┬─────────────────────┐  │  │
│  │  │ CMAL    │ Voice   │ Susu     │ Fraud Detection     │  │  │
│  │  │ 12,450  │ 3,200   │ 890      │ 2,100              │  │  │
│  │  │ calls   │ minutes │ txns     │ analyses           │  │  │
│  │  └─────────┴─────────┴──────────┴─────────────────────┘  │  │
│  │  [View Detailed Logs]                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Current Plan: Pro ($299/mo)                              │  │
│  │  ├── 50,000 CMAL calls included                          │  │
│  │  ├── 5,000 Voice minutes included                        │  │
│  │  └── $0.002 per additional call                          │  │
│  │  [Upgrade to Enterprise]  [Manage Billing]               │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

---

## Phase 4: Usage Metering & Billing

### Pricing Tiers

| Tier | Monthly Fee | CMAL Calls | Voice Minutes | Susu Txns | Fraud Analyses |
|------|-------------|------------|---------------|-----------|----------------|
| **Free** | $0 | 1,000 | 100 | 50 | 100 |
| **Pro** | $299 | 50,000 | 5,000 | 1,000 | 5,000 |
| **Enterprise** | Custom | Unlimited | Unlimited | Unlimited | Unlimited |

### Overage Pricing
- CMAL: $0.002 per call
- Voice AI: $0.05 per minute
- Susu: $0.01 per transaction
- Fraud: $0.01 per analysis

### Stripe Metered Billing Integration

1. Create Stripe Products for each API (CMAL, Voice, Susu, Fraud)
2. Create metered prices with usage-based billing
3. Edge function `report-api-usage` reports usage to Stripe daily
4. Stripe handles overage billing automatically

---

## Phase 5: SDK Scaffolding

### JavaScript/TypeScript SDK

```typescript
// @1325ai/sdk - npm package
import { Client } from '@1325ai/sdk';

const client = new Client({
  apiKey: '1325_live_xxx',
  environment: 'production'
});

// CMAL Engine
const impact = await client.cmal.calculate({
  transactionAmount: 150.00,
  businessCategory: 'restaurant',
  userTier: 'gold'
});
console.log(impact.multipliedImpact); // 345.00 (2.3x)

// Voice AI
const session = await client.voice.createSession({
  persona: 'custom',
  systemPrompt: 'You are a helpful assistant for...',
  vadThreshold: 0.5
});

// Susu Protocol
const circle = await client.susu.createCircle({
  contributionAmount: 100,
  frequency: 'monthly',
  memberCount: 10
});
```

### Python SDK

```python
# 1325ai - PyPI package
from onethreethreefiveai import Client

client = Client(api_key="1325_live_xxx")

# CMAL calculation
impact = client.cmal.calculate(
    transaction_amount=150.00,
    business_category="restaurant",
    user_tier="gold"
)
print(impact.multiplied_impact)  # 345.00
```

---

## Implementation Order

### Sprint 1 (Week 1-2): Database & Auth Foundation
- [ ] Create developer platform database tables
- [ ] Implement API key generation with secure hashing
- [ ] Build rate limiting logic with Redis-like sliding window
- [ ] Create usage logging infrastructure

### Sprint 2 (Week 3-4): Core API Endpoints
- [ ] `api-gateway` edge function (auth, rate limiting, logging)
- [ ] `cmal-api` edge function (expose CMAL engine)
- [ ] `voice-api` edge function (wrap realtime-voice)
- [ ] `susu-api` edge function (wrap susu-escrow)
- [ ] `fraud-api` edge function (wrap detect-fraud)

### Sprint 3 (Week 5-6): Developer Portal Frontend
- [ ] Developer landing page with value proposition
- [ ] Developer signup/login flow
- [ ] API key management dashboard
- [ ] Usage analytics dashboard

### Sprint 4 (Week 7-8): Documentation & SDKs
- [ ] OpenAPI 3.0 specification for all endpoints
- [ ] Interactive API documentation (Swagger UI style)
- [ ] JavaScript/TypeScript SDK package
- [ ] Python SDK package
- [ ] Getting Started guides

### Sprint 5 (Week 9-10): Billing Integration
- [ ] Stripe metered billing setup
- [ ] Usage reporting edge function
- [ ] Developer billing portal
- [ ] Invoice generation

---

## Technical Considerations

### Security
- API keys are hashed (SHA-256) before storage
- Only the key prefix is stored for identification
- Rate limiting prevents abuse (per-minute sliding window)
- All API calls logged for audit trail

### Scalability
- Edge functions auto-scale with Supabase
- Usage logs partitioned by month for query performance
- Rate limit state cached with short TTL

### Patent Protection
Each API endpoint header includes:
```
X-Patent-Notice: Protected under USPTO Provisional 63/969,202
```

---

## Revenue Projection

| Scenario | Developers | Avg MRR | Annual Revenue |
|----------|------------|---------|----------------|
| Conservative | 100 | $150 | $180,000 |
| Moderate | 500 | $250 | $1,500,000 |
| Aggressive | 2,000 | $400 | $9,600,000 |

Combined with existing SaaS revenue, this positions 1325.AI for **15-30x ARR multiples** as a true PaaS.

---

## Files to Create

### New Edge Functions
- `supabase/functions/api-gateway/index.ts` - Central auth/rate-limit handler
- `supabase/functions/cmal-api/index.ts` - Public CMAL API
- `supabase/functions/voice-api/index.ts` - Public Voice AI API
- `supabase/functions/susu-api/index.ts` - Public Susu Protocol API
- `supabase/functions/fraud-api/index.ts` - Public Fraud Detection API
- `supabase/functions/report-api-usage/index.ts` - Stripe usage reporting

### New Frontend Pages
- `src/pages/developers/DeveloperLandingPage.tsx`
- `src/pages/developers/DeveloperDashboard.tsx`
- `src/pages/developers/ApiDocumentationPage.tsx`
- `src/pages/developers/ApiPricingPage.tsx`
- `src/pages/developers/DeveloperSignupPage.tsx`

### New Hooks & Utils
- `src/hooks/use-developer-account.ts`
- `src/hooks/use-api-keys.ts`
- `src/hooks/use-api-usage.ts`
