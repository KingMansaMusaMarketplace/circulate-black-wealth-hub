# USPTO SYSTEM ARCHITECTURE DIAGRAMS

## UNITED STATES PATENT AND TRADEMARK OFFICE

---

# System and Method for a Multi-Tenant Vertical Marketplace Operating System

## Technical Specification Diagrams

---

**Filing Date:** January 22, 2026  
**Applicant/Inventor:** Thomas D. Bowling

---

## DIAGRAM 1: CMAL Engine - Economic Circulation Multiplier Data Flow

```mermaid
flowchart TD
    subgraph Input["Transaction Input Layer"]
        T1[Transaction 1<br/>$100.00]
        T2[Transaction 2<br/>$250.00]
        T3[Transaction N<br/>$X.XX]
    end

    subgraph Collection["Data Collection"]
        AGG[Transaction Aggregator<br/>Supabase Edge Function]
    end

    subgraph Calculation["CMAL Calculation Engine"]
        SUM[Sum Transactions<br/>Σ amount_total]
        MULT[Apply Multiplier<br/>× 2.3]
        REACH[Calculate Reach<br/>unique_customers × 10]
    end

    subgraph Output["Impact Metrics"]
        BUS[Businesses Supported<br/>COUNT DISTINCT business_id]
        TXN[Total Transactions<br/>COUNT *]
        RAW[Raw Value<br/>Σ amount]
        IMPACT[Economic Impact<br/>RAW × 2.3]
        COMMUNITY[Community Reach<br/>customers × 10]
    end

    subgraph Storage["Persistent Storage"]
        DB[(sponsor_impact_metrics<br/>PostgreSQL)]
    end

    subgraph Display["Sponsor Dashboard"]
        DASH[Real-Time Dashboard<br/>React + Recharts]
    end

    T1 --> AGG
    T2 --> AGG
    T3 --> AGG
    AGG --> SUM
    SUM --> MULT
    AGG --> REACH
    MULT --> IMPACT
    REACH --> COMMUNITY
    AGG --> BUS
    AGG --> TXN
    SUM --> RAW
    BUS --> DB
    TXN --> DB
    RAW --> DB
    IMPACT --> DB
    COMMUNITY --> DB
    DB --> DASH

    style MULT fill:#FFD700,stroke:#000,stroke-width:3px
    style IMPACT fill:#90EE90,stroke:#000,stroke-width:2px
```

### CMAL Engine Key Constants

| Constant | Value | Description |
|----------|-------|-------------|
| CIRCULATION_MULTIPLIER | 2.3 | Economic circulation factor |
| REACH_MULTIPLIER | 10 | Community impact per customer |

---

## DIAGRAM 2: Voice AI WebSocket Bridge Architecture

```mermaid
sequenceDiagram
    participant Client as Client Browser
    participant Edge as Edge Function<br/>(Deno)
    participant OpenAI as OpenAI Realtime API

    Note over Client,OpenAI: Connection Establishment Phase
    Client->>Edge: HTTP Upgrade Request<br/>(WebSocket)
    Edge->>Edge: Deno.upgradeWebSocket()
    Edge-->>Client: 101 Switching Protocols
    
    Edge->>OpenAI: WSS Connection<br/>+ API Key + Beta Headers
    OpenAI-->>Edge: Connection Established
    
    OpenAI->>Edge: session.created
    Edge->>Edge: Prepare persona config
    Edge->>OpenAI: session.update<br/>{instructions, voice, VAD}
    
    Note over Client,OpenAI: Bidirectional Audio Streaming
    
    loop Voice Conversation
        Client->>Edge: PCM16 Audio Chunk
        Edge->>OpenAI: Forward Audio
        OpenAI->>OpenAI: VAD Detection<br/>Transcription<br/>LLM Processing
        OpenAI->>Edge: response.audio.delta
        Edge->>Client: Forward Audio
    end
    
    Note over Client,OpenAI: Graceful Termination
    Client->>Edge: Close Connection
    Edge->>OpenAI: Close Connection
    OpenAI-->>Edge: Connection Closed
    Edge-->>Client: Connection Closed
```

### Voice AI Session Configuration

```json
{
  "type": "session.update",
  "session": {
    "modalities": ["text", "audio"],
    "instructions": "[Persona Instructions - ~2000 chars]",
    "voice": "shimmer",
    "input_audio_format": "pcm16",
    "output_audio_format": "pcm16",
    "input_audio_transcription": {
      "model": "whisper-1"
    },
    "turn_detection": {
      "type": "server_vad",
      "threshold": 0.5,
      "prefix_padding_ms": 300,
      "silence_duration_ms": 800
    },
    "temperature": 0.8
  }
}
```

---

## DIAGRAM 3: Multi-Tier Commission Cascade

```mermaid
flowchart TD
    subgraph Tier1["Tier 1: Direct Commission"]
        CUST[New Customer<br/>Signs Up]
        AGENT1[Sales Agent<br/>Referral Code: ABC123]
        COMM1[Direct Commission<br/>10-15% of Subscription]
    end

    subgraph Tier2["Tier 2: Team Override"]
        AGENT0[Recruiter Agent<br/>Recruited AGENT1]
        OVERRIDE[Team Override<br/>2.5% of AGENT1's Commission]
    end

    subgraph Tier3["Recruitment Bonus"]
        BONUS[Recruitment Bonus<br/>$50 One-Time]
    end

    subgraph DB["Database Records"]
        REF[(referrals)]
        ACOMM[(agent_commissions)]
        TOVER[(agent_team_overrides)]
        RBON[(agent_recruitment_bonuses)]
    end

    CUST -->|Uses referral code| AGENT1
    AGENT1 -->|Earns| COMM1
    COMM1 -->|tier = 1| REF
    COMM1 --> ACOMM

    AGENT1 -.->|Recruited by| AGENT0
    AGENT0 -->|Earns| OVERRIDE
    OVERRIDE -->|2.5% of COMM1| TOVER

    AGENT0 -->|When AGENT1 activates| BONUS
    BONUS --> RBON

    style COMM1 fill:#90EE90,stroke:#000
    style OVERRIDE fill:#87CEEB,stroke:#000
    style BONUS fill:#FFD700,stroke:#000
```

### Commission Rate Schedule

| Agent Tier | Lifetime Referrals | Commission Rate | Team Override |
|------------|-------------------|-----------------|---------------|
| Bronze | 0-24 | 10.00% | 2.50% |
| Silver | 25-99 | 12.00% | 2.50% |
| Gold | 100-199 | 13.00% | 2.50% |
| Platinum | 200-499 | 14.00% | 2.50% |
| Diamond | 500+ | 15.00% | 2.50% |

---

## DIAGRAM 4: Fraud Detection Decision Tree

```mermaid
flowchart TD
    START[Fraud Detection<br/>Triggered] --> FETCH[Fetch Recent Activity<br/>7-day lookback]
    
    FETCH --> QR[QR Scans<br/>500 records max]
    FETCH --> TXN[Transactions<br/>500 records max]
    FETCH --> ACT[Activity Log<br/>1000 records max]
    
    QR --> SANITIZE[Sanitize PII<br/>Redact Sensitive Data]
    TXN --> SANITIZE
    ACT --> SANITIZE
    
    SANITIZE --> PATTERNS[Extract Patterns]
    
    PATTERNS --> P1[Scans per User]
    PATTERNS --> P2[Scans per Business]
    PATTERNS --> P3[Hourly Distribution]
    PATTERNS --> P4[Transactions per User]
    PATTERNS --> P5[Average Amount]
    
    P1 --> AI[AI Analysis<br/>Gemini 2.5 Flash]
    P2 --> AI
    P3 --> AI
    P4 --> AI
    P5 --> AI
    
    AI --> TOOL[Tool Call:<br/>report_fraud_alerts]
    
    TOOL --> ALERTS{Alerts<br/>Generated?}
    
    ALERTS -->|Yes| BATCH[Batch Insert<br/>insert_fraud_alerts_batch]
    ALERTS -->|No| LOG[Log Clean Analysis]
    
    BATCH --> CHECK{Severity<br/>Level?}
    
    CHECK -->|Critical| ESCROW[Hold Points<br/>& Payouts]
    CHECK -->|High| NOTIFY[Notify Admin]
    CHECK -->|Medium| QUEUE[Add to<br/>Review Queue]
    CHECK -->|Low| MONITOR[Continue<br/>Monitoring]
    
    ESCROW --> REVIEW[Manual Review<br/>Required]
    NOTIFY --> REVIEW
    
    style AI fill:#FFD700,stroke:#000,stroke-width:2px
    style ESCROW fill:#FF6B6B,stroke:#000,stroke-width:2px
    style BATCH fill:#90EE90,stroke:#000
```

### Velocity Fraud Detection Formula

```
IMPOSSIBLE TRAVEL DETECTION:

V = D / Δt

Where:
  V = Implied velocity (miles per hour)
  D = Haversine distance between scan locations
  Δt = Time delta between scans (hours)

Haversine Formula:
  a = sin²(Δφ/2) + cos(φ₁) × cos(φ₂) × sin²(Δλ/2)
  c = 2 × atan2(√a, √(1-a))
  D = R × c  (where R = 3,959 miles, Earth's radius)

THRESHOLD: V > 600 mph → CRITICAL ALERT

Example:
  Scan 1: NYC (40.7128°N, 74.0060°W) at 10:00 AM
  Scan 2: LA (34.0522°N, 118.2437°W) at 11:30 AM
  
  D = 2,451 miles
  Δt = 1.5 hours
  V = 2,451 / 1.5 = 1,634 mph
  
  1,634 > 600 → CRITICAL: IMPOSSIBLE TRAVEL DETECTED
```

---

## DIAGRAM 5: B2B Matching Scoring Algorithm

```mermaid
flowchart LR
    subgraph Input["Business Need"]
        NEED[Need Posted<br/>Category: Catering<br/>Budget: $5,000<br/>Urgency: within_week<br/>Location: Chicago, IL]
    end

    subgraph Candidates["Candidate Capabilities"]
        CAP1[Capability 1<br/>Category: Catering]
        CAP2[Capability 2<br/>Category: Catering]
        CAP3[Capability 3<br/>Category: Catering]
    end

    subgraph Scoring["Multi-Factor Scoring"]
        S1[Category Match<br/>+30 pts]
        S2[Location Score<br/>+10-20 pts]
        S3[Service Area<br/>+15 pts]
        S4[Budget Fit<br/>+15 pts]
        S5[Rating Bonus<br/>+0-15 pts]
        S6[Timeline Match<br/>+10 pts]
    end

    subgraph Output["Ranked Results"]
        R1[Match 1: 92/100<br/>+ AI Recommendation]
        R2[Match 2: 78/100]
        R3[Match 3: 65/100]
    end

    NEED --> CAP1
    NEED --> CAP2
    NEED --> CAP3
    
    CAP1 --> S1
    CAP1 --> S2
    CAP1 --> S3
    CAP1 --> S4
    CAP1 --> S5
    CAP1 --> S6
    
    S1 --> R1
    S2 --> R1
    S3 --> R1
    S4 --> R1
    S5 --> R1
    S6 --> R1
    
    CAP2 --> R2
    CAP3 --> R3

    style R1 fill:#90EE90,stroke:#000,stroke-width:2px
```

### B2B Matching Score Weights

```javascript
const SCORING_WEIGHTS = {
  CATEGORY_MATCH: 30,      // Exact category alignment
  SAME_CITY: 20,           // Identical city location
  SAME_STATE: 10,          // Same state, different city
  SERVICE_AREA_OVERLAP: 15,// Service area includes need
  BUDGET_COMPATIBILITY: 15,// Price within budget
  RATING_BONUS_MAX: 15,    // Scaled by rating (3 pts/star)
  TIMELINE_MATCH: 10,      // Lead time meets urgency
};

const URGENCY_DAYS = {
  immediate: 3,
  within_week: 7,
  within_month: 30,
  planning: 90,
  flexible: 180,
};

// Maximum possible score: 100 (capped)
```

---

## DIAGRAM 6: Coalition Points Flow

```mermaid
flowchart TD
    subgraph Earn["Point Earning"]
        TRANS[Transaction at<br/>Business A]
        BASE[Base Points:<br/>$50 × 10 = 500 pts]
        TIER[Tier Multiplier:<br/>Gold = 1.5x]
        FINAL[Final Points:<br/>500 × 1.5 = 750 pts]
    end

    subgraph Ledger["Central Ledger"]
        BAL[(coalition_points<br/>customer_id<br/>points: 3,250<br/>tier: gold)]
    end

    subgraph Redeem["Point Redemption"]
        RED[Redeem 1,000 pts<br/>at Business B]
        VALUE[$10 Value<br/>100 pts = $1]
        DEDUCT[Deduct from<br/>Balance]
    end

    subgraph Audit["Transaction Log"]
        LOG[(coalition_transactions<br/>type: earn/redeem<br/>source_business<br/>redeem_business)]
    end

    TRANS --> BASE
    BASE --> TIER
    TIER --> FINAL
    FINAL --> BAL
    FINAL --> LOG

    BAL --> RED
    RED --> VALUE
    VALUE --> DEDUCT
    DEDUCT --> BAL
    RED --> LOG

    style FINAL fill:#FFD700,stroke:#000
    style BAL fill:#90EE90,stroke:#000
```

### Coalition Tier Benefits

| Tier | Min Points | Multiplier | Benefits |
|------|------------|------------|----------|
| Bronze | 0 | 1.0x | Base earning, coalition access |
| Silver | 1,000 | 1.25x | +25% points, early reward access |
| Gold | 5,000 | 1.5x | +50% points, VIP events, priority |
| Platinum | 15,000 | 2.0x | +100% points, exclusive rewards, concierge |

---

## DIAGRAM 7: QR Transaction Processing

```mermaid
sequenceDiagram
    participant User as Customer
    participant App as Mobile App
    participant Edge as Edge Function
    participant Stripe as Stripe Connect
    participant DB as Supabase DB
    participant Bus as Business Account

    User->>App: Scan QR Code
    App->>Edge: POST /process-qr-transaction<br/>{businessId, amount}
    
    Edge->>Edge: Validate with Zod
    Edge->>DB: Get payment_account<br/>stripe_account_id
    DB-->>Edge: {stripe_account_id,<br/>charges_enabled: true}
    
    Edge->>Edge: Calculate Commission<br/>7.5% = $7.50 on $100
    
    Edge->>Stripe: Create PaymentIntent<br/>amount: $100<br/>application_fee: $7.50<br/>destination: business_stripe_id
    Stripe-->>Edge: {client_secret, id}
    
    Edge->>DB: Insert qr_scans record
    Edge->>DB: Insert transaction record<br/>points_earned: 1000
    Edge->>DB: Record commission
    
    Edge-->>App: {clientSecret, commission}
    
    App->>Stripe: Confirm Payment
    Stripe->>Bus: Transfer $92.50
    Stripe->>Bus: Platform receives $7.50

    style Edge fill:#FFD700,stroke:#000
```

### Commission Split Calculation

```
PLATFORM_COMMISSION_RATE = 7.5%

For $100 transaction:
  amountInCents = 100 × 100 = 10,000 cents
  commission = 10,000 × 0.075 = 750 cents ($7.50)
  businessAmount = 10,000 - 750 = 9,250 cents ($92.50)

Stripe PaymentIntent:
  amount: 10000
  application_fee_amount: 750
  transfer_data.destination: acct_business123
```

---

## DIAGRAM 8: Temporal Founding Member System

```mermaid
flowchart TD
    subgraph Registration["User Registration"]
        REG[User Registers<br/>created_at: 2026-01-15]
    end

    subgraph Trigger["Database Trigger"]
        TRIG[set_founding_member_on_signup<br/>BEFORE INSERT]
        FUNC[set_founding_member_status()]
        CHECK{created_at <<br/>2026-03-31<br/>23:59:59 UTC?}
    end

    subgraph SetStatus["Status Assignment"]
        SET_TRUE[is_founding_member = TRUE<br/>founding_member_since = created_at]
        SET_FALSE[is_founding_member = FALSE<br/>founding_member_since = NULL]
    end

    subgraph Protection["Immutability Protection"]
        PROT[protect_founding_member_status<br/>BEFORE UPDATE]
        REVOKE{Attempting to<br/>revoke status?}
        EXCEPTION[RAISE EXCEPTION<br/>'Cannot be revoked']
        ALLOW[Allow Update]
    end

    subgraph Benefits["Lifetime Benefits"]
        B1[2x Point Multiplier]
        B2[Priority Support]
        B3[Waived Fees]
        B4[Founding Badge]
    end

    REG --> TRIG
    TRIG --> FUNC
    FUNC --> CHECK
    CHECK -->|Yes| SET_TRUE
    CHECK -->|No| SET_FALSE
    
    SET_TRUE --> PROT
    PROT --> REVOKE
    REVOKE -->|Yes| EXCEPTION
    REVOKE -->|No| ALLOW
    
    SET_TRUE --> B1
    SET_TRUE --> B2
    SET_TRUE --> B3
    SET_TRUE --> B4

    style CHECK fill:#FFD700,stroke:#000,stroke-width:2px
    style EXCEPTION fill:#FF6B6B,stroke:#000
    style SET_TRUE fill:#90EE90,stroke:#000
```

### Temporal Cutoff Constant

```sql
-- Immutable temporal boundary
DECLARE
  v_cutoff_timestamp CONSTANT TIMESTAMP WITH TIME ZONE := '2026-03-31T23:59:59Z';
BEGIN
  IF NEW.created_at < v_cutoff_timestamp THEN
    NEW.is_founding_member := true;
    NEW.founding_member_since := NEW.created_at;
  END IF;
  RETURN NEW;
END;
```

---

## DIAGRAM 9: Economic Karma System (NEW)

```mermaid
flowchart TD
    subgraph Earning["Karma Earning Events"]
        E1[Transaction<br/>karma = amount × 0.1 × 2.3]
        E2[Business Referral<br/>karma = 100]
        E3[User Referral<br/>karma = 50]
        E4[Review Written<br/>karma = 10-25]
        E5[Cross-Business<br/>Point Circulation<br/>karma = points × 0.05]
        E6[Challenge<br/>Participation<br/>karma = contribution × 0.02]
    end

    subgraph Score["Karma Score"]
        TOTAL[(economic_karma<br/>user_id<br/>current_score<br/>lifetime_score)]
    end

    subgraph Effects["Karma Effects"]
        F1[Recommendation<br/>Priority Boost]
        F2[Support Queue<br/>Priority]
        F3[B2B Match<br/>Score Bonus]
        F4[Transaction<br/>Point Bonus]
    end

    subgraph Decay["Karma Decay"]
        DECAY[5% Monthly Decay<br/>if inactive 30+ days]
    end

    subgraph Export["Data Export"]
        CEREBRO[Cerebro-Compatible<br/>Feed Export<br/>for VC Analytics]
    end

    E1 --> TOTAL
    E2 --> TOTAL
    E3 --> TOTAL
    E4 --> TOTAL
    E5 --> TOTAL
    E6 --> TOTAL

    TOTAL --> F1
    TOTAL --> F2
    TOTAL --> F3
    TOTAL --> F4

    TOTAL <--> DECAY
    TOTAL --> CEREBRO

    style TOTAL fill:#FFD700,stroke:#000,stroke-width:2px
    style CEREBRO fill:#87CEEB,stroke:#000
```

### Karma Calculation Formulas

```javascript
// Transaction Karma
transaction_karma = transaction_amount × CIRCULATION_MULTIPLIER × 0.1
// Example: $100 × 2.3 × 0.1 = 23 karma

// Referral Karma
business_referral_karma = 100 + (referred_business_tier_bonus × 10)
user_referral_karma = 50 + (referred_user_activity_bonus × 5)

// Review Karma
review_karma = base_karma + (word_count / 50) + (helpfulness_votes × 2)
// Range: 10-25 karma per review

// Cross-Business Circulation Karma (NEW)
circulation_karma = points_used × 0.05
// Rewards using points at different businesses than where earned

// Decay Formula
if (days_since_last_activity > 30) {
  current_karma = current_karma × 0.95; // 5% monthly decay
}
```

---

## END OF SYSTEM DIAGRAMS

---

© 2024-2026 Thomas D. Bowling. All rights reserved.

These technical diagrams are part of the patent specification and are protected intellectual property.
