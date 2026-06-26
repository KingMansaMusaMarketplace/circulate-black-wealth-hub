# Plan: Unicorn Dossier v9 — Investor-Ready Upgrade

Add four new sections to `1325AI_Why_We_Are_A_Global_Unicorn_v8.pdf` to convert it from a strategic narrative into a fundable investor deck. All other pages stay intact. Cover, confidentiality block, photo, and competitor matrix preserved.

## New sections (inserted in this order)

### 1. Traction & Proof Points (new Section 4, after Foreword)
Turns "potential" into "evidence." Includes:
- USPTO Application 63/969,202 — filed, patent-pending status
- Platform live at 1325.ai + circulate-black-wealth-hub.lovable.app
- 42 Agentic AI Employees deployed in production
- AAMES enterprise engagement in active discussion (Dr. Hill, Anthony Franklin, Clarence Wesley)
- Lovable Cloud infrastructure live (Supabase, edge functions, RLS)
- Stripe + Paddle + Apple IAP payment rails operational
- Visual: traction milestones timeline (matplotlib horizontal bar)

### 2. The Ask + Use of Funds (new Section 16)
- Raise amount: **$2.5M seed** at **$12M post-money cap** (SAFE)
- 18-month runway to Series A metrics ($1M ARR)
- Use of Funds pie chart:
  - Engineering & AI infra — 40%
  - GTM / Enterprise sales — 25%
  - Compliance, Legal, IP — 15%
  - Founder + key hires — 15%
  - Reserve — 5%
- 30-day decision window language

### 3. 5-Year Revenue Model + TAM/SAM/SOM (new Section 17)
- **TAM:** $2.10T (2025 U.S. Black consumer economy)
- **SAM:** ~$48B (faith orgs + Black-owned SMBs + civic institutions addressable by 42 agents)
- **SOM:** $180M by Year 5 (0.4% of SAM)
- ARR build table: Year 1–5, # sponsors × ARPU × retention
  - Y1: 12 sponsors × $96K = $1.15M ARR
  - Y3: 180 sponsors × $110K = $19.8M ARR
  - Y5: 850 sponsors × $125K = $106M ARR
- Sensitivity table (conservative / base / aggressive)
- Visual: ARR stacked bar chart Y1–Y5

### 4. Investor Risk & Mitigation + Comparable Exits (new Section 18)
**Risk matrix:**
| Risk | Likelihood | Mitigation |
|---|---|---|
| Key-person (Bowling) | Medium | Advisory board (Hill, Wesley); succession doc; key-person insurance Y1 |
| OpenAI model dependency | Medium | Multi-model abstraction (Lovable AI Gateway, Gemini, Anthropic) already in code |
| Regulatory (faith/civic data) | Low-Med | SOC 2 roadmap; RLS; USPTO IP shield; IL trade-secret law |
| Customer concentration (AAMES) | Medium | Pipeline diversification: AME Scouts → NAACP, NUL, Divine Nine, HBCUs |
| AI commoditization | Low | Vertical wedge + patent moat + community trust = non-replicable |

**Comparable Exits anchor:**
- Slack → Salesforce ($27.7B, 26x ARR)
- Nuance → Microsoft ($19.7B, 13x ARR)
- Cresta / Harness vertical-AI rounds at 30–50x ARR
- Pushpay (faith vertical) → BGH Capital ($1.3B)
- Implied 1325.AI Year-5 exit range: **$1.5B–$3.2B** at conservative 15–30x ARR

## Renumbering
TOC, bookmarks, and downstream section numbers updated. Old Sec 14 (Comparator Matrix) stays as Sec 14. Verdict and Appendix move to Sec 19 and 20.

## Cover & confidentiality
Unchanged. Red Fortune-50 block, USPTO citation, photo on page 2 — all preserved per memory rule.

## QA
Render → convert each page to JPG → visual inspect every page for clipping, overlap, font issues, table wrap, chart legibility. Fix and re-render until clean.

## Deliverable
`/mnt/documents/1325AI_Why_We_Are_A_Global_Unicorn_v9.pdf` (24 pages, up from 21)

## One decision needed before I build
The raise numbers above (**$2.5M at $12M cap**, **$1.5B–$3.2B exit range**, **Y5 = 850 sponsors / $106M ARR**) are my best-judgment defaults based on comparable seed-stage agentic-AI raises. If you want different numbers, tell me and I'll plug them in — otherwise I'll use these.
