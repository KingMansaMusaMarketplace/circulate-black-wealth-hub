# USPTO SYSTEM ARCHITECTURE DIAGRAMS — SECOND FILING (CLAIMS 28–40)

## UNITED STATES PATENT AND TRADEMARK OFFICE

---

**PRIVATE & CONFIDENTIAL — DO NOT COPY, FORWARD, OR DISTRIBUTE**
Attorney–Client Work Product. Prepared for: Thomas D. Bowling, Founder & Chief Architect.

---

# System and Method for an Agent-Accessible Vertical Commerce Operating System

## Technical Specification Drawings

---

**Intended Filing Date:** _______________
**Applicant/Inventor:** Thomas D. Bowling
**Companion Documents:** `USPTO_FORMAL_CLAIMS_28-40.md`, `USPTO_PROVISIONAL_SPECIFICATION_28-40.md`

---

## BRIEF DESCRIPTION OF THE DRAWINGS

| Figure | Title | Supports Claim(s) |
|---|---|---|
| FIG. 1 | MCP Discovery Layer — Dual-Tier Authorization Topology | 28, 39 |
| FIG. 2 | Agent-Originated Commerce — Attribution Chain and Decay | 29 |
| FIG. 3 | Hierarchical Agentic Workforce — Delegation and Permission Binding | 30 |
| FIG. 4 | Back-Office Substitution Engine — Cost-Avoidance Accounting | 31 |
| FIG. 5 | Enterprise Tenancy — Organization, Chapter, and Seat Claim | 32 |
| FIG. 6 | Merchant Attribution and Revenue-Share Settlement Rollup | 33 |
| FIG. 7 | Privileged-Column Lock Framework — Before-Update Decision Path | 34 |
| FIG. 8 | Security Autopilot — Scan, Remediate, Verify, Digest Cycle | 35 |
| FIG. 9 | Economic Circulation Graph — Retention, Leakage, Allocation Signal | 40 |

---

## FIG. 1 — MCP Discovery Layer: Dual-Tier Authorization Topology
### (Supports Claim 28 and Claim 39)

```mermaid
flowchart TD
    subgraph Clients["External AI Assistant Clients (102)"]
        A1[Assistant Client A]
        A2[Assistant Client B]
        A3[Developer IDE Agent]
    end

    subgraph Registry["Discovery (104)"]
        MAN[Well-Known Registry Manifest<br/>capability + health probe]
    end

    subgraph Server["MCP Protocol Server (106)"]
        NEG[Manifest Version Negotiator]
        TOOLS[Typed Tool Surface<br/>search_directory / get_business /<br/>list_rewards / get_points_balance /<br/>get_recent_scans]
        INSTR[Machine-Readable Instruction Block<br/>source authority + citation mandate]
        RL[Rate Limiter<br/>degrade to citation-only]
        TAG[Session Tagger<br/>derive agent_client_id]
    end

    subgraph Auth["Authorization (108)"]
        ANON[Anonymous Tier<br/>anon DB role]
        OAUTH[OAuth 2.0 + PKCE<br/>audience-scoped JWT]
    end

    subgraph Data["Shared Data Plane (110)"]
        RLS[[Single Row-Level-Security Policy Set]]
        DB[(Verified Directory<br/>PostgreSQL)]
        VSM[Verification State Machine<br/>FIG. 1A]
    end

    subgraph Human["Human Web Client (112)"]
        WEB[Browser Session]
    end

    A1 --> MAN
    A2 --> MAN
    A3 --> MAN
    MAN --> NEG
    NEG --> TOOLS
    TOOLS --> INSTR
    TOOLS --> RL
    RL --> TAG
    TAG --> ANON
    TAG --> OAUTH
    ANON --> RLS
    OAUTH --> RLS
    WEB --> RLS
    RLS --> DB
    VSM --> DB
    DB --> ENV[Response Envelope<br/>citation URL + badge state +<br/>evidence age + provenance id]
    ENV --> A1
```

### FIG. 1A — Verification Badge Propagation State Machine (Claim 39)

```mermaid
stateDiagram-v2
    [*] --> Unverified
    Unverified --> SelfAttested: owner attestation evidence
    SelfAttested --> DocumentVerified: document artifact + reviewer id
    DocumentVerified --> BiometricallyVerified: biometric artifact + reviewer id
    BiometricallyVerified --> DocumentVerified: evidence age > max
    DocumentVerified --> SelfAttested: evidence age > max
    SelfAttested --> Unverified: evidence age > max

    note right of DocumentVerified
        Transition permitted ONLY via
        admin role or trusted service
        (enforced by FIG. 7 framework).
        On change, fan-out invalidates:
        web surface, MCP tool surface,
        enterprise surfaces, partner kits.
    end note
```

---

## FIG. 2 — Agent-Originated Commerce: Attribution Chain and Decay
### (Supports Claim 29)

```mermaid
sequenceDiagram
    participant U as End User
    participant AI as AI Assistant (agent_client_id)
    participant MCP as MCP Server
    participant L as Attribution Ledger
    participant W as Web Surface
    participant POS as In-Store QR Check-In
    participant S as Settlement Engine

    U->>AI: "Find a verified barbershop near me"
    AI->>MCP: search_directory(...)
    MCP->>L: write seed {agent_client_id, TI-id, record_ids, t0}
    MCP-->>AI: records + citation URLs carrying TI-id
    AI-->>U: cited recommendation
    U->>W: taps citation URL (?ti=TI-id)
    W->>L: profile_view {TI-id, t1}
    U->>POS: scans QR at merchant (parent Claim: atomic check-in)
    POS->>L: engagement {TI-id, t2}
    U->>W: transaction settles
    W->>L: transaction {TI-id, amount, t3}
    L->>S: chain complete
    S->>S: weight = exp(-ln2 * (t3-t0) / halflife[agent_client_id])
    S->>S: impact = amount * 2.3 * weight   (parent Claim 2 constant)
    S->>S: payable = net_revenue * org.share_pct_versioned
    S-->>U: (reporting) period settlement statement
```

```mermaid
flowchart LR
    subgraph Guard["De-duplication Guard (202)"]
        G1{seen tuple<br/>agent+subject+record<br/>within window?}
        G1 -->|yes| DROP[Discard seed]
        G1 -->|no| KEEP[Persist seed]
    end
    subgraph Decay["Attribution Decay (204)"]
        D1[elapsed = t_link - t0]
        D2{elapsed > max window?}
        D2 -->|yes| ZERO[weight = 0]
        D2 -->|no| EXP[weight = exp -ln2*elapsed/halflife]
    end
    KEEP --> D1 --> D2
```

---

## FIG. 3 — Hierarchical Agentic Workforce: Delegation and Permission Binding
### (Supports Claim 30)

```mermaid
flowchart TD
    H[Human Principal<br/>natural-language objective] --> EXEC

    subgraph T1["Tier 1 — Executive (302)"]
        EXEC[Executive Orchestration Agent<br/>named conversational persona]
        DEC[Decomposition by<br/>semantic similarity to charter]
    end

    subgraph T2["Tier 2 — Divisional Leads (304)"]
        D1[Revenue]
        D2[Member Experience]
        D3[Marketing]
        D4[Finance]
        D5[Compliance]
        D6[Engineering]
        D7[Data]
        D8[Partnerships]
    end

    subgraph T3["Tier 3 — Operational Agents (306)<br/>42 total roster"]
        O1[Op Agent]
        O2[Op Agent]
        O3[Op Agent]
        ON[Op Agent N]
    end

    subgraph Ctrl["Control Plane (308)"]
        LEDGER[(Task Ledger<br/>parent_task_id → DAG)]
        RUNLOG[(Idempotent Run Log<br/>hash task+agent+input)]
        CONF{Confidence ≥<br/>escalation threshold?}
        HUMAN[Human Review Queue]
        MEM[(Chat Memory +<br/>accept/reject/edit exemplars)]
    end

    subgraph Enf["Enforcement Plane (310)"]
        ROLE[Tool Permissions → DB Role]
        RLS[[Row-Level Security]]
        SDF[SECURITY DEFINER fns<br/>pinned search_path]
        TBL[(Operational Tables)]
    end

    EXEC --> DEC --> LEDGER
    LEDGER --> D1 & D2 & D3 & D4 & D5 & D6 & D7 & D8
    D8 --> O1 & O2 & O3 & ON
    O1 & O2 & O3 & ON --> JOIN[Join Barrier at Divisional Lead]
    JOIN --> RUNLOG
    RUNLOG --> CONF
    CONF -->|below| HUMAN
    CONF -->|at or above| ROLE
    HUMAN --> MEM
    MEM -.injected into next invocation.-> EXEC
    ROLE --> RLS --> SDF --> TBL
```

---

## FIG. 4 — Back-Office Substitution Engine: Cost-Avoidance Accounting
### (Supports Claim 31)

```mermaid
flowchart TD
    subgraph Map["Role-Substitution Map (402)"]
        R1[Support → agents a,b]
        R2[Bookkeeping → agents c,d]
        R3[Marketing → agents e,f]
        R4[Compliance → agent g]
        R5[Recruiting → agent h]
        R6[Partner Reporting → agent i]
        R7[Analytics → agent j]
    end

    RUN[(Run Log terminal states<br/>FIG. 3)] --> METER[Workload Meter<br/>tasks completed per role]
    Map --> CALC
    METER --> CALC

    subgraph CALC["Cost-Avoidance Calculator (404)"]
        F["savings = Σ(reference_labor_cost × coverage_fraction)<br/>− metered_agent_operating_cost"]
    end

    subgraph SLA["Service-Level Monitor (406)"]
        L1[Task Latency]
        L2[Escalation Rate]
        L3[Human Rejection Rate]
        CEIL{rejection > ceiling?}
    end

    CALC --> EXPR[Coverage Expression<br/>'~N Roles Covered'<br/>never 'positions eliminated']
    CALC --> LEDGERSNAP[(Evidence Ledger<br/>immutable period snapshot)]
    L3 --> CEIL
    CEIL -->|yes| RED[Auto-reduce coverage_fraction]
    RED --> CALC
    CEIL -->|yes| TASK[Create remediation task →<br/>divisional lead, FIG. 3 ledger]
    EXPR --> REPORT[Enterprise Value Metric<br/>alongside FIG. 6 settlement]
```

---

## FIG. 5 — Enterprise Tenancy: Organization, Chapter, and Seat Claim
### (Supports Claim 32)

```mermaid
erDiagram
    ORGANIZATION ||--o{ CHAPTER : contains
    CHAPTER ||--o{ CHAPTER : parent_of
    CHAPTER ||--o{ MEMBERSHIP : rosters
    ORGANIZATION ||--o{ LEADER_SEAT : preregisters
    ORGANIZATION ||--o{ ONBOARDING_TASK : instantiates
    ORGANIZATION ||--o{ MERCHANT_ATTRIBUTION : credited_by
    MEMBERSHIP }o--|| USER_ACCOUNT : links

    ORGANIZATION {
        text slug PK
        text display_name
        jsonb brand_assets
        numeric share_pct
        int share_pct_version
        int term_years
        date launch_date
        text lifecycle_state
    }
    CHAPTER {
        uuid chapter_id PK
        uuid parent_chapter_id FK
        uuid admin_user_id
        int member_estimate
    }
    LEADER_SEAT {
        citext email
        text role
        timestamptz claimed_at
    }
```

```mermaid
sequenceDiagram
    participant ADM as Org Administrator
    participant SYS as Platform
    participant USR as Future Leader (no account yet)

    ADM->>SYS: pre-register seat (email, chapter, role)
    Note over SYS: seat stored BEFORE account exists
    USR->>SYS: sign up with that email
    SYS->>SYS: claim_enterprise_leader_seats() at first auth
    SYS->>SYS: match authenticated email → pending seat
    SYS->>SYS: atomic grant of scoped role; mark claimed
    SYS-->>USR: co-branded dashboard at /enterprise/{slug}/dashboard
    USR->>SYS: second login (idempotent)
    SYS-->>USR: returns existing grant, no duplicate role
```

```mermaid
flowchart LR
    ORG[(Organization Record)] --> LAND["/{slug} co-branded landing"]
    ORG --> DASH["/enterprise/{slug}/dashboard"]
    ORG --> KIT["/enterprise/{slug}/kit<br/>printable one-pager +<br/>scannable code + raster download"]
    ORG --> PLAN[Onboarding Plan Generator<br/>dated tasks bound to launch_date]
    ORG --> AGENTS[Per-Org Scoped Agent Roster<br/>FIG. 3, isolated per tenant]
    note1[No per-tenant code fork:<br/>one codebase, slug-derived routes]
```

---

## FIG. 6 — Merchant Attribution and Revenue-Share Settlement Rollup
### (Supports Claim 33)

```mermaid
flowchart TD
    subgraph Signals["Attribution Signal Detection at Merchant Creation (602)"]
        S1[Partner referral parameter]
        S2[Partner machine-readable code]
        S3[Creator resolves to chapter membership]
        S4[AI tool_invocation_id — FIG. 2]
        S5[Administrator override]
    end

    S1 & S2 & S3 & S4 & S5 --> TRG[BEFORE/AFTER INSERT Trigger<br/>resolve org + chapter]
    TRG --> IMM[(Immutable Attribution Record<br/>survives later ownership change)]
    TRG --> SEC[Conflicting later signal →<br/>secondary influence event only]

    IMM --> ACC[Period Accumulator<br/>subscription + transaction fees + placements]
    ACC --> MULT["payable = net_revenue × share_pct (version-stamped)"]

    subgraph Rollup["Chapter Hierarchy Rollup (604)"]
        L3[Local Chapter] --> L2[Regional]
        L2 --> L1[National]
        L1 --> ORGT[Organization Total]
    end

    MULT --> L3
    ORGT --> STMT[(Immutable Period Statement<br/>locked once issued)]
    STMT --> VIEW[Member/Chapter Dashboard:<br/>merchant count, attributed revenue,<br/>×2.3 community impact]
```

---

## FIG. 7 — Privileged-Column Lock Framework: Before-Update Decision Path
### (Supports Claim 34)

```mermaid
flowchart TD
    UPD[UPDATE statement on protected table] --> REG{Column in<br/>privileged registry?}
    REG -->|no| OWNEX{In owner-permitted<br/>exception list?}
    OWNEX -->|yes| ALLOW1[ALLOW]
    OWNEX -->|no| ALLOW1

    REG -->|yes| DIFF{OLD.col IS DISTINCT<br/>FROM NEW.col?}
    DIFF -->|no| ALLOW2[ALLOW — no change]
    DIFF -->|yes| SVC{Trusted service<br/>execution context?}
    SVC -->|yes| ALLOW3[ALLOW]
    SVC -->|no| AUTH[Authority Resolver<br/>has_role auth.uid,'admin']

    AUTH --> SDF[[SECURITY DEFINER fn<br/>pinned search_path]]
    SDF --> RT[(Dedicated user_roles table<br/>NEVER a profile column)]
    RT --> ISADM{Admin role present?}
    ISADM -->|yes| ALLOW4[ALLOW]
    ISADM -->|no| AUDIT[(Audit row:<br/>principal, table, column,<br/>pre-image, attempted value, ts)]
    AUDIT --> RAISE[RAISE EXCEPTION —<br/>transaction aborted at DB layer.<br/>No application-layer bypass exists.]

    subgraph Scope["Applied by trigger declaration to 20+ tables (702)"]
        T1[businesses] 
        T2[corporate_subscriptions]
        T3[directory_partners]
        T4[featured_placements]
        T5[noir_drivers]
        T6[sales_agents]
        T7[vacation_properties]
        TN[... N tables, one shared function]
    end

    subgraph Meta["Registry Self-Protection (704)"]
        RSELF[Registry is itself a protected table;<br/>its column lists are privileged columns<br/>→ protections cannot be de-registered]
    end

    subgraph Grants["Explicit Grant Layer (706)"]
        GR[Per-role GRANT issued at table creation.<br/>Absent grant = denial.<br/>RLS is never the sole control.]
    end
```

---

## FIG. 8 — Security Autopilot: Scan, Remediate, Verify, Digest Cycle
### (Supports Claim 35)

```mermaid
flowchart TD
    CRON[In-Database Scheduled Job] --> LOCK{Acquire execution lock<br/>reclaim if abandoned}
    LOCK --> BAT

    subgraph BAT["Scan Battery (802)"]
        B1[RLS coverage]
        B2[Explicit grant coverage]
        B3[Privileged-column registry coverage — FIG. 7]
        B4[Function search_path mutability]
        B5[Unauthenticated serverless endpoint probe]
        B6[Dependency vulnerability scan]
    end

    BAT --> STORE[(Finding Store<br/>stable_id = hash class + object)]
    STORE --> HIST[Remediation History appended:<br/>detect → remediate → verify → regress]
    STORE --> CLS[Classifier: severity from<br/>defect class + data sensitivity]
    CLS --> TRI{Deterministic corrective<br/>template exists?}

    TRI -->|yes| EXEC[Remediation Executor<br/>apply template]
    EXEC --> RESCAN[Re-run corresponding scan]
    RESCAN --> VER{Closure verified?}
    VER -->|yes| CLOSED[Mark remediated]
    VER -->|no| REVERT[Revert migration<br/>reclassify as manual]

    TRI -->|no| AGENT[Escalate to Compliance Division<br/>agent — FIG. 3 — proposal generation]
    REVERT --> AGENT
    AGENT --> APPROVE[Human Approval Queue]

    CLOSED --> DIG
    APPROVE --> DIG
    subgraph DIG["Digest Generator (804)"]
        E1[New findings]
        E2[Auto-remediated]
        E3[Verified closures]
        E4[Pending human approval]
    end
    DIG --> MAIL[Periodic email to<br/>admin distribution list]
    MAIL --> REL[Release lock]
    REL --> CONSOLE[Operator Console:<br/>posture, severity mix,<br/>remediation success rate, job health]
```

---

## FIG. 9 — Economic Circulation Graph: Retention, Leakage, Allocation Signal
### (Supports Claim 40, incorporating Claims 2, 29, 30, 32, 36)

```mermaid
flowchart TD
    subgraph Nodes["Graph Nodes (902)"]
        N1((Merchant))
        N2((Consumer))
        N3((Enterprise Chapter))
        N4((Capital Provider))
        N5((Out-of-Community Sink))
    end

    subgraph Edges["Directed Edges (904)"]
        E1[Settled transaction]
        E2[Attributed acquisition — FIG. 6]
        E3[Loyalty redemption]
        E4[Rotating-savings payout — Claim 37]
    end

    subgraph Weight["Edge Weighting (906)"]
        W["w = value × 2.3 (parent Claim 2)<br/>× decay(t) (FIG. 2)"]
        LBL[Agent-originated edges labeled<br/>→ measures incremental circulation<br/>attributable to MCP layer FIG. 1]
    end

    Nodes --> Edges --> Weight

    Weight --> RET["Retention Metric per node =<br/>in-community flow ÷ out-of-community flow<br/>(rolling window)"]
    RET --> CHAP[Computed at chapter granularity,<br/>rolled up to organization — FIG. 5]

    RET --> LEAK{Category outflow<br/>> threshold?}
    LEAK -->|yes| SPEC[Merchant-Acquisition Target Spec<br/>category + locality]
    SPEC --> TASKQ[(Agent Task Ledger — FIG. 3<br/>Partnerships Division)]
    TASKQ --> ENRICH[Enrichment Pipeline — Claim 36<br/>domain resolve → retrieve →<br/>schema-constrained extraction →<br/>validate → dedupe → private PII table]
    ENRICH --> N1

    RET --> ALLOC[Allocation Signal:<br/>rank deployments by projected<br/>Δretention per unit capital]
    ALLOC --> RPT[Periodic report to enterprise<br/>partners and capital providers]
```

---

## REFERENCE NUMERAL INDEX

| Numeral | Element |
|---|---|
| 102 | External AI assistant clients |
| 104 | Well-known registry manifest / discovery |
| 106 | MCP protocol server |
| 108 | Dual-tier authorization (anonymous / OAuth 2.0 + PKCE) |
| 110 | Shared data plane with single RLS policy set |
| 112 | Human web client |
| 202 | Attribution de-duplication guard |
| 204 | Exponential attribution decay function |
| 302 | Executive orchestration tier |
| 304 | Divisional lead tier |
| 306 | Operational agent tier (42-agent roster) |
| 308 | Control plane (task ledger, run log, confidence, memory) |
| 310 | Enforcement plane (role binding, RLS, definer functions) |
| 402 | Role-substitution mapping table |
| 404 | Cost-avoidance calculator |
| 406 | Service-level monitor with auto coverage reduction |
| 602 | Attribution signal detection at merchant creation |
| 604 | Chapter hierarchy settlement rollup |
| 702 | Shared enforcement function applied across 20+ tables |
| 704 | Registry self-protection |
| 706 | Explicit grant layer |
| 802 | Scan battery |
| 804 | Digest generator |
| 902 | Circulation graph nodes |
| 904 | Circulation graph directed edges |
| 906 | Edge weighting with circulation multiplier and decay |

---

**This document is a technical draft prepared for patent counsel. It is not legal advice.**
