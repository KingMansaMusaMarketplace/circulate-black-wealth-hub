# PROVISIONAL PATENT APPLICATION — SPECIFICATION (SECOND FILING)

## UNITED STATES PATENT AND TRADEMARK OFFICE

---

**PRIVATE & CONFIDENTIAL — DO NOT COPY, FORWARD, OR DISTRIBUTE**
Attorney–Client Work Product. Prepared for: Thomas D. Bowling, Founder & Chief Architect.

---

# System and Method for an Agent-Accessible Vertical Commerce Operating System Featuring a Model Context Protocol Discovery Layer, a Hierarchical Autonomous Agentic Workforce, White-Label Enterprise Organization Tenancy with Chapter-Level Revenue Attribution, and Self-Remediating Privileged-Column Security Enforcement

---

**Intended Filing Date:** _______________
**Application Number:** _______________
**Applicant/Inventor:** Thomas D. Bowling
**Correspondence Address:** 1000 E. 111th Street, Suite 1100, Chicago, Illinois 60628
**Accompanying Claims Document:** `USPTO_FORMAL_CLAIMS_28-40.md` (Claims 28–40)
**Accompanying Drawings:** `USPTO_SYSTEM_DIAGRAMS_28-40.md` (FIG. 1–FIG. 9)

---

## CROSS-REFERENCE TO RELATED APPLICATIONS

This application is related to and continues the subject matter of U.S. Provisional Patent
Application No. 63/969,202, filed January 26, 2026, entitled "System and Method for a Multi-Tenant
Vertical Marketplace Operating System Featuring Temporal Incentives, Circulatory Multiplier
Attribution, Cross-Business Coalition Loyalty Networks, Voice-Enabled AI Concierge, Hierarchical
Sales Agent Networks, and Geospatial Velocity Fraud Detection," containing twenty-seven (27) claims.
The entire disclosure of said application is incorporated herein by reference.

Because a provisional application may not be amended to add new matter, the subject matter disclosed
herein — conceived and reduced to practice after January 26, 2026 — is presented as a separate
provisional filing. Applicant intends to consolidate both provisional applications into a single
non-provisional utility application on or before **January 26, 2027**.

Claim numbering herein begins at 28 to continue, without collision, the numbering of the parent
application.

---

## FIELD OF THE INVENTION

The present invention relates generally to electronic commerce infrastructure, and more specifically
to a commerce operating system that is directly consumable by autonomous artificial-intelligence
agents, operated by a hierarchical workforce of autonomous software agents in substitution for human
back-office staff, tenanted for white-label deployment to member-based external organizations with
automatic chapter-level revenue attribution, and secured by a generalized privileged-column
enforcement framework with autonomous scan-and-remediate capability.

Specifically, the invention addresses:

1. Machine-readable discovery of a verification-gated vertical directory by third-party AI assistants
2. Attribution and monetization of commerce that originates inside an AI assistant conversation
3. Hierarchical delegation and permission-binding across a fixed roster of autonomous agents
4. Auditable cost-avoidance accounting for back-office substitution
5. Multi-tenant white-label organization and chapter hierarchies
6. Automatic merchant-to-organization attribution and revenue-share settlement
7. Generalized prevention of owner-driven privilege escalation across heterogeneous tables
8. Scheduled autonomous security scanning, remediation, verification, and digest reporting
9. Autonomous enrichment of external entities into verified, deduplicated contact records
10. Contribution-authenticity enforcement in rotating savings and credit associations
11. Compliance-aware monetization switching between native and web platforms
12. Single-source verification state with cross-channel propagation
13. Directed economic circulation graphs yielding capital-allocation signals

---

## BACKGROUND OF THE INVENTION

### Problem Statement

Since the filing of the parent application, the primary discovery surface for commerce has begun
shifting from search engines and mobile applications to conversational artificial-intelligence
assistants. A consumer who once typed a query into a search engine now asks an AI assistant
directly. This shift creates a structural problem for verified vertical directories:

**AI assistants cannot distinguish a verified merchant from an unverified scraped listing.** They
synthesize answers from unstructured, uncited, and frequently stale web content. For a directory
whose entire value rests on human and biometric verification, being reduced to one more scraped
page destroys the value of the verification work and severs the economic relationship between the
directory and the merchants it verifies.

A second, related problem is economic. When an AI assistant surfaces a merchant, the directory that
performed the verification receives no attribution, no analytics, and no revenue. The value created
by verification accrues entirely to the assistant.

A third problem is operational. A pre-revenue platform serving a multi-trillion-dollar addressable
market cannot afford the human back-office staff — support, bookkeeping, compliance, marketing,
partner reporting — that its scope demands, and conventional business-process outsourcing
reintroduces both cost and data-custody risk.

A fourth problem is distributional. Reaching a dispersed community of merchants one at a time is
prohibitively slow. Member-based organizations (denominational bodies, civic associations, youth
programs) already aggregate millions of members, but no commerce platform provides a mechanism to
white-label itself into such an organization while automatically attributing and settling the
revenue that the organization's members generate.

A fifth problem is security. In a platform where merchants, drivers, hosts, sales agents, and
sponsors each own their own records, the dominant vulnerability class is not external intrusion but
**owner-driven privilege escalation** — a record owner updating their own `is_verified`,
`subscription_tier`, `commission_rate`, or `approval_status` column. Per-table hand-written policies
do not scale to hundreds of tables and regress silently.

### Deficiencies in Existing Solutions

1. **Search-engine optimization does not apply to AI assistants.** Ranking signals designed for
   crawlers do not govern what a language model asserts in a conversation. No existing directory
   product exposes itself as an authoritative, typed, authenticated tool surface with per-user
   personalization preserved inside the third-party assistant.

2. **Affiliate and referral tracking cannot follow an AI conversation.** Existing attribution relies
   on browser cookies and click identifiers. There is no established mechanism binding a tool
   invocation inside an assistant to a later physical in-store visit or completed transaction.

3. **Existing multi-agent frameworks are unbounded.** Published agent orchestration systems permit an
   agent to attempt any action its generated output requests. None bind agent capability to
   database-enforced row-level security such that the agent physically cannot exceed its charter,
   and none provide idempotent run logging keyed to a deterministic input hash.

4. **Outsourcing vendors provide no auditable substitution metric.** No system computes a verified
   cost-avoidance figure from metered task completion, degraded automatically by measured human
   rejection rate.

5. **White-label platforms duplicate code per tenant.** Existing white-label commerce systems either
   fork the application per customer or provide only cosmetic theming, with no arbitrary-depth
   chapter hierarchy, no pre-account leadership seat claiming, and no automatic upward rollup of
   attributed revenue.

6. **Row-level security is treated as sufficient.** Existing practice relies on row policies alone,
   overlooking that a policy permitting a row update permits updating *every column* of that row.
   No generalized, registry-driven, column-level enforcement primitive spanning dozens of
   heterogeneous tables is known to applicant.

7. **Security scanning is advisory, not remediating.** Existing scanners report findings. None
   classify auto-remediability, apply a deterministic corrective migration, re-scan to verify
   closure, revert on failure, and escalate the remainder to an autonomous agent workforce for
   proposal generation.

### Objects of the Invention

It is an object of the invention to make a verified vertical directory the authoritative, cited
source consulted by autonomous AI assistants; to attribute and monetize the commerce so originated;
to operate the enterprise with an autonomous agent workforce whose authority is enforced at the
database layer; to distribute the platform through white-label member organizations with automatic
revenue settlement; and to render owner-driven privilege escalation structurally impossible while
detecting and repairing its recurrence without human initiation.

---

## SUMMARY OF THE INVENTION

The invention comprises seven cooperating subsystems, described in detail below and claimed as
Claims 28 through 40.

**A. Protocol Discovery Layer (Claims 28, 39).** A Model Context Protocol server publishes the
verified directory as a typed, side-effect-free tool surface over streamable HTTP. A dual-tier
authorization model serves anonymous public records without credentials and, upon an OAuth 2.0
authorization-code exchange with Proof Key for Code Exchange, serves personalized records under the
*identical* row-level-security policy set that governs the human web client. A machine-readable
instruction block asserts source authority and mandates citation. Every record carries a canonical
citation URL, a verification badge enumeration, an evidence age, and a verification provenance
identifier. Verification state itself is maintained by a state machine whose transitions require
enumerated evidence and which fans out on change to the web surface, the tool surface, enterprise
surfaces, and generated partner kits.

**B. Agent Attribution and Settlement (Claim 29).** Each tool invocation is stamped with a derived
agent-client identifier and a tool-invocation identifier. The tool-invocation identifier is embedded
into every returned citation URL, so a later human navigation carries it. An attribution chain is
persisted as tool invocation → profile view → engagement event (including an atomic scan-code
check-in as claimed in the parent application) → transaction, each link keyed to its predecessor. An
exponential decay function with per-agent-client half-life discounts the originating invocation over
elapsed time within a maximum window. The circulation multiplier constant of parent Claim 2 converts
attributed value into community economic impact, and a version-stamped revenue-share percentage
converts it into a settlement obligation to an enterprise partner.

**C. Agentic Workforce (Claims 30, 31).** A fixed roster of forty-two role-specialized autonomous
agents is organized into executive, divisional, and operational tiers. A natural-language objective
is received by the executive orchestration agent, decomposed by semantic similarity into
division-scoped tasks, and recorded in a task ledger forming a directed acyclic execution graph with
fan-out and join barriers. Each agent's tool-permission set maps to a database role, so row-level
security constrains the agent regardless of what its generated output requests; all writes occur
through security-definer functions with immutably pinned schema search paths. An idempotent run log
keyed on a hash of task, agent, and normalized input prevents duplicate execution. A confidence
estimator escalates below-threshold outputs to human review instead of committing them. A closed
learning loop persists accept/reject/edit feedback — an edit storing the original and corrected
output as a paired exemplar — and injects a summary into subsequent invocations. A substitution
engine maps human back-office roles to agents, meters completed tasks, and computes a cost-avoidance
figure that is automatically degraded when a role's human-rejection rate exceeds a ceiling, with all
inputs retained in immutable period snapshots.

**D. Enterprise Tenancy (Claims 32, 33).** An organization record carries a slug, brand assets, a
revenue-share percentage (which may be zero, establishing a no-fee distribution partnership),
a term, a launch date, and a lifecycle state. A chapter table decomposes the organization to
arbitrary depth via parent-chapter foreign keys. Leadership seats are pre-registered against an
electronic mail address *before the account exists*; an idempotent claim function executed at first
authentication matches the authenticated address and atomically grants the scoped role. Co-branded
public and authenticated routes derive from the slug without per-tenant code duplication, and a
printable partner kit with a scannable machine-readable code is generated from the same record. On
merchant creation, a trigger resolves an attribution signal — referral parameter, partner code,
member-resolvable creator, AI tool-invocation identifier, or administrator override — and writes an
immutable binding that survives later ownership change. Net revenue is accumulated per period,
multiplied by the version-stamped share percentage, rolled up the chapter hierarchy, and frozen into
an immutable period statement.

**E. Privileged-Column Lock Framework (Claim 34).** A registry associates each protected table with
its privileged column list. One generalized before-update enforcement function, attached by trigger
declaration to more than twenty heterogeneous tables without per-table duplication, compares
pre-image to post-image for each registered column. On difference, an authority resolver reads role
membership from a dedicated role-assignment table through a security-definer function with a pinned
search path — never from a user-editable profile record. Absent the administrative role, the
transaction is aborted at the database layer, so no application-layer bypass exists. An
owner-permitted exception list allows non-privileged lifecycle columns. A service-context bypass
permits trusted server execution while denying the identical mutation to a browser session bearing
the owner's credentials. The registry is itself protected, and every rejection emits an audit record.

**F. Security Autopilot (Claim 35).** An in-database scheduled job invokes a scan battery covering
row-level-security coverage, explicit-grant coverage, privileged-column registry coverage, function
search-path mutability, unauthenticated serverless endpoints, and dependency vulnerabilities.
Findings receive stable identifiers hashed from defect class and affected object, so a regression
reuses its prior identifier and retains its remediation history. A classifier assigns severity and
marks findings auto-remediable where a deterministic corrective migration template exists; the
executor applies the template, re-runs the scan to verify closure, and reverts on failure. The
remainder escalates to the agent workforce for proposal generation and then to a human approver. A
digest generator emails a periodic summary of new, auto-remediated, verified, and pending items.

**G. Supporting Subsystems (Claims 36, 37, 38, 40).** An enrichment pipeline converts a bare entity
name into a verified contact record via domain resolution, retrieval, schema-constrained model
extraction with a confidence scalar, field-level validation, composite-key deduplication, and
storage of personally identifying fields in a private administrator-only table joined to the public
entity table — with no duplicate copy of any PII field on the public side. A rotating savings and
credit association subsystem permits contribution rows to be created only by a security-definer
function from a trusted context, requires a confirmed external settlement identifier before a
contribution may advance to funded, immutably guards funded rows, and releases a cycle payout only
when funded contributions equal member count within the same transaction. A monetization switch
carries a native-eligibility flag per tier and a single shared suppression predicate consumed by all
purchase surfaces, reconciling native receipts and web payments against one canonical entitlement to
prevent double billing. Finally, an economic circulation graph weights edges by transaction value,
the circulation multiplier, and the attribution decay function, computes per-node retention ratios,
detects leakage categories, and emits merchant-acquisition target specifications directly into the
agent task ledger — closing the loop between measurement and autonomous action.

---

## DETAILED DESCRIPTION OF THE PREFERRED EMBODIMENT

### 1. Operating Environment

The preferred embodiment executes as a single-page web application delivered over a content
distribution network; a native mobile application shell wrapping bundled application assets; a
managed PostgreSQL database with row-level security enabled on every table in the public schema;
a fleet of serverless edge functions; and a protocol server exposing the Model Context Protocol over
streamable HTTP at a stable public endpoint. An identity provider issues JSON Web Tokens consumed
identically by the web client, the native shell, and the protocol server.

### 2. Protocol Discovery Layer — Implementation Detail

The protocol server advertises a versioned tool manifest. Version negotiation selects the highest
mutually supported manifest, retaining backward-compatible envelopes for one prior major version.
Tools are side-effect-free retrieval operations with JSON schemas for request and response.

Anonymous invocations execute against the database with the anonymous role, so only rows whose
row-level-security predicate evaluates to publicly readable are returned. Authenticated invocations
carry an audience-scoped bearer token obtained through an authorization-code exchange with Proof Key
for Code Exchange; the protocol server forwards the token to the database layer, causing the same
policies that govern the user's browser session to govern the agent session. No agent-facing data
replica is maintained, eliminating divergence between channels.

Records below a configurable minimum verification state are returned without contact or payout
fields. The search ranking function boosts by verification state, verification recency, and
coalition-loyalty participation, systematically favoring verified participating merchants.

A rate limiter computes per-agent-client request velocity and, on exceedance, degrades the response
to a citation-only summary rather than terminating the session, preserving the citation obligation
even under abuse.

### 3. Attribution Chain — Worked Example

```text
t0   Assistant calls search_directory("Black-owned barbershop, Atlanta")
     → server derives agent_client_id = "assistant-A"
     → server mints tool_invocation_id = TI-8f3c...
     → writes attribution seed {assistant-A, TI-8f3c, [biz_412, biz_907], t0}
     → returns records with citation URLs carrying ?ti=TI-8f3c

t1   Human taps citation URL for biz_412
     → profile_view row {biz_412, ti=TI-8f3c, t1}

t2   Human scans in-store QR code (parent-application atomic check-in)
     → scan row inherits ti=TI-8f3c

t3   Transaction settles, $180.00
     → transaction row inherits ti=TI-8f3c

     attributed_weight = e^(−ln2 × (t3 − t0) / halflife(assistant-A))
     community_impact  = 180.00 × 2.3 × attributed_weight
     partner_settlement= net_revenue(180.00) × org.share_pct_versioned
```

A de-duplication guard discards seeds sharing an identical tuple of agent-client identifier, subject
identifier, and record identifier within an idempotency window.

### 4. Agent Workforce — Roster and Execution

The roster comprises forty-two agents across divisions including revenue, member experience,
marketing, finance, compliance, engineering, data, and partnerships. Each agent record stores a
stable identifier, division assignment, natural-language role charter, enumerated tool-permission
set, model-selection directive, and escalation threshold.

The executive orchestration agent is exposed to end users through a named conversational persona and
to internal operators through a task console; both share one task ledger. Decomposition assigns each
sub-task to the divisional lead of highest computed semantic similarity to the task text. Execution
fans out to operational agents concurrently and joins at the divisional lead before returning
upward.

The model-selection directive permits per-agent selection among multiple underlying language models
routed through one gateway credential; a rate-limit or failure response triggers deterministic
fallback to a designated secondary model without task loss. A cost-accounting component attributes
token consumption and monetary cost to the originating task, division, and objective.

Idempotency is enforced by hashing `(task_id, agent_id, normalize(input_payload))`; a run whose hash
already exists in a terminal state is skipped.

### 5. Privileged-Column Enforcement — Reference Structure

```text
registry(table_name, privileged_columns[], owner_permitted_columns[])

BEFORE UPDATE trigger on each registered table
  → for each c in privileged_columns:
        if OLD.c IS DISTINCT FROM NEW.c:
            if current context is trusted service:      allow
            elif has_role(auth.uid(), 'admin'):         allow
            else: write audit row; RAISE EXCEPTION
```

`has_role` is a security-definer function with an immutably pinned schema search path reading a
dedicated role-assignment table. Role membership is never stored on, or read from, a profile record.
Table-level grants are issued explicitly per role at table creation; absence of an explicit grant
results in denial, so row policies are never the sole control.

### 6. Security Autopilot — Cycle

```text
cron → acquire execution lock (reclaim if abandoned beyond max age)
     → run scan battery
     → upsert findings by stable_id = hash(defect_class, affected_object)
     → classify severity; mark auto_remediable where template exists
     → for auto_remediable: apply template → re-scan → verify or revert
     → for remainder: create agent task (compliance division) → human approval queue
     → compose and send digest email
     → release lock
```

### 7. Enterprise Tenancy — Seat Claim Sequence

```text
Admin pre-registers  ("leader@org.example", chapter=National, role=org_leader)
User signs up later with leader@org.example
  → on first authenticated session, claim_enterprise_leader_seats() runs
  → matches authenticated email to pending seat
  → atomically inserts scoped role assignment, marks seat claimed
  → second invocation returns existing grant (idempotent), no duplicate role
```

### 8. Data Structures (Representative, Non-Limiting)

| Structure | Key Fields |
|---|---|
| Attribution seed | agent_client_id, tool_invocation_id, record_ids[], created_at |
| Attribution chain | invocation_id, view_id, engagement_id, transaction_id, weight |
| Agent roster | agent_id, division, charter, tool_permissions[], model, escalation_threshold |
| Run log | run_hash, task_id, agent_id, state, confidence, cost_tokens |
| Feedback event | agent_id, type(accept/reject/edit), original_output, corrected_output |
| Organization | slug, name, brand_assets, share_pct, share_pct_version, term, launch_date, state |
| Chapter | chapter_id, org_id, parent_chapter_id, admin_user_id, member_estimate |
| Leader seat | org_id, chapter_id, email, role, claimed_at |
| Merchant attribution | merchant_id, org_id, chapter_id, signal_type, bound_at (immutable) |
| Column registry | table_name, privileged_columns[], owner_permitted_columns[] |
| Finding | stable_id, defect_class, affected_object, severity, auto_remediable, history[] |
| Contribution | circle_id, member_id, cycle, amount, settlement_ref, status |
| Circulation edge | from_node, to_node, edge_type, value, weight |

### 9. Alternative Embodiments

The protocol layer is described using the Model Context Protocol but applies to any typed,
discoverable tool-invocation protocol consumed by autonomous agents. The agent roster is described as
forty-two agents in three tiers but may comprise any fixed plurality in any number of tiers greater
than one. The enterprise tenant is described as a denominational youth organization but applies to
any member-based organization possessing a chapter or lodge structure. The database is described as
PostgreSQL with row-level security; any database providing per-row predicate evaluation and
before-update triggers with definer-rights functions may be substituted.

---

## ADVANTAGES OVER THE PRIOR ART

1. The verified directory becomes a **cited, authoritative source** inside third-party AI assistants
   rather than one more scraped page.
2. Commerce originating inside an AI conversation becomes **measurable and billable** for the first
   time, including conversion to a physical in-store visit.
3. Agent authority is enforced **at the database layer**, so a compromised or hallucinating agent
   cannot exceed its charter.
4. Back-office substitution produces an **auditable** cost-avoidance figure that self-degrades on
   measured quality loss.
5. White-label distribution requires **no per-tenant code fork**, and revenue attribution is
   immutable at merchant-creation time.
6. Owner-driven privilege escalation — the dominant vulnerability class in owner-record platforms —
   is blocked by **one generalized primitive** across dozens of tables.
7. Security defects are **repaired and verified autonomously**, with regression history preserved
   through stable finding identifiers.

---

## INDUSTRIAL APPLICABILITY

The invention is applicable to any verification-gated vertical marketplace seeking discoverability
inside autonomous AI assistants, to any platform operator seeking to substitute autonomous agents
for back-office staff with auditable accounting, to any member-based organization seeking a
co-branded commerce environment with automatic revenue participation, and to any multi-tenant
application seeking generalized protection against owner-driven privilege escalation.

---

**This document is a technical draft prepared for patent counsel. It is not legal advice.**
