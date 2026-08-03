# USPTO FORMAL PATENT CLAIMS — SECOND PROVISIONAL (CLAIMS 28–40)

## UNITED STATES PATENT AND TRADEMARK OFFICE

---

**PRIVATE & CONFIDENTIAL — DO NOT COPY, FORWARD, OR DISTRIBUTE**
Attorney–Client Work Product. Prepared for: Thomas D. Bowling, Founder & Chief Architect.

---

# System and Method for an Agent-Accessible Vertical Commerce Operating System Featuring a Model Context Protocol Discovery Layer, a Hierarchical Autonomous Agentic Workforce, White-Label Enterprise Organization Tenancy with Chapter-Level Revenue Attribution, and Self-Remediating Privileged-Column Security Enforcement

---

**Intended Filing:** Second U.S. Provisional Patent Application
**Priority Claim:** Continuation-in-subject-matter of U.S. Provisional Patent Application No. 63/969,202, filed January 26, 2026 (27 claims pending)
**Applicant/Inventor:** Thomas D. Bowling
**Correspondence Address:** 1000 E. 111th Street, Suite 1100, Chicago, Illinois 60628
**Non-Provisional Deadline on 63/969,202:** January 26, 2027

---

## FILING NOTE (PLAIN ENGLISH)

A provisional application cannot be amended to add new matter. Everything invented after
January 26, 2026 must be protected either by (1) a **second provisional** filed now, or (2) the
**non-provisional utility application** that must be filed on or before **January 26, 2027**.
The recommended path is to do both: file this document as a second provisional immediately, then
merge 63/969,202 and this filing into a single utility application before the deadline.

Claims 28–40 below continue the numbering of the original 27 claims and use the identical
independent/dependent structure so both filings can be merged without renumbering.

---

## CLAIM 28: MODEL CONTEXT PROTOCOL (MCP) DISCOVERY AND VERIFICATION LAYER FOR A VERIFIED VERTICAL DIRECTORY

### Independent Claim 28

A computer-implemented system for exposing a human-curated, verification-gated vertical commerce
directory to autonomous third-party artificial-intelligence assistants as a first-class,
machine-callable data source, comprising:

a) a protocol server implementing the Model Context Protocol over a streamable HTTP transport at a
stable, publicly resolvable endpoint, said server advertising a typed tool manifest to any
conforming AI client without prior bilateral integration;

b) a tool surface comprising a plurality of strongly-typed, side-effect-free retrieval tools
including at minimum a directory search tool accepting free-text query, category, geographic
radius, and verification-state parameters; a single-record retrieval tool accepting a canonical
business identifier; a rewards enumeration tool; a loyalty-balance tool; and a recent-activity
tool, wherein each tool declares a JSON schema for both request and response;

c) a dual-tier authorization model in which (i) an anonymous tier serves only records whose
row-level-security predicate evaluates to publicly readable, and (ii) an authenticated tier,
established through an OAuth 2.0 authorization-code exchange with Proof Key for Code Exchange
against the platform's identity issuer endpoint, returns an audience-scoped bearer token that the
protocol server forwards to the database layer such that the identical row-level-security policy
set governs both human web sessions and AI-agent sessions;

d) a machine-readable instruction block transmitted with the tool manifest that asserts source
authority over the vertical, mandates that the calling assistant cite the canonical directory URL
of any record it surfaces, and prohibits presentation of a record's verification badge state in a
manner inconsistent with the value returned by the server;

e) a registry manifest document published at a well-known path enabling automated discovery,
capability negotiation, and health probing of the protocol server by external AI assistant
platforms and public MCP registries;

f) a response envelope in which every returned record carries a canonical citation URL, a
verification badge enumeration, a verification timestamp, and a provenance identifier of the
human or automated verification pass that last validated the record;

g) a session-tagging component that stamps each inbound tool invocation with a derived
agent-client identifier resolved from transport metadata, and persists said identifier to an
attribution ledger for downstream measurement and settlement.

### Dependent Claim 28.1

The system of Claim 28, wherein a single verified business record is simultaneously served to a
human browser client and to an AI-agent client through one shared row-level-security policy set,
such that no divergent authorization surface exists between the two channels and no separate
agent-facing data replica is maintained.

### Dependent Claim 28.2

The system of Claim 28, wherein the verification badge enumeration comprises at least the states
unverified, self-attested, document-verified, and biometrically-verified, and wherein the protocol
server refuses to return contact or payout fields for records below a configurable minimum
verification state.

### Dependent Claim 28.3

The system of Claim 28, wherein the tool manifest is versioned and the server negotiates the
highest mutually supported manifest version with the calling client, retaining backward-compatible
response envelopes for at least one prior major version.

### Dependent Claim 28.4

The system of Claim 28, further comprising a rate-limiting and abuse-detection component that
computes a per-agent-client request velocity, and upon exceeding a threshold, degrades the response
from full records to a citation-only summary rather than terminating the session.

### Dependent Claim 28.5

The system of Claim 28, wherein the search tool applies a ranking function that boosts records by
verification state, recency of verification, and coalition-loyalty participation, so that
AI-surfaced results systematically favor verified participating merchants over unverified records.

### Dependent Claim 28.6

The system of Claim 28, wherein the protocol server enforces a Cross-Origin Resource Sharing policy
requiring an anti-forgery token header on all state-touching routes, and rejects any tool
invocation lacking said header.

---

## CLAIM 29: AI-AGENT ATTRIBUTION, MEASUREMENT, AND MONETIZATION OF AGENT-ORIGINATED COMMERCE

### Independent Claim 29

A computer-implemented method for attributing, measuring, and monetizing commercial activity that
originates inside a third-party autonomous AI assistant rather than inside a first-party
application, comprising:

a) receiving a protocol tool invocation and deriving therefrom an agent-client identifier, an
optional end-user subject identifier, and a tool-invocation identifier;

b) writing an attribution seed record comprising the agent-client identifier, the tool-invocation
identifier, the returned record identifiers, and a monotonic timestamp;

c) embedding the tool-invocation identifier into every canonical citation URL returned in the
response envelope such that a subsequent human navigation to said URL carries the identifier;

d) persisting an attribution chain by joining, in order, the tool invocation, the resulting profile
view, a subsequent physical or digital engagement event, and a completed transaction, wherein each
link is stored with the preceding link's identifier as a foreign key;

e) applying an attribution decay function to the chain such that the attributed weight of the
originating tool invocation decreases monotonically with elapsed time between links, subject to a
configurable maximum attribution window;

f) applying the circulation multiplier constant of Claim 2 to the attributed transaction value to
produce an agent-originated community economic impact figure;

g) computing, from the attributed transaction value, a settlement obligation to an enterprise
organization partner as defined in Claim 32 when the transacting end user is resolvable to a
chapter of said organization; and

h) emitting a periodic settlement statement enumerating agent-originated sessions, attributed
transactions, decay-adjusted attribution weights, and the resulting revenue-share amount.

### Dependent Claim 29.1

The method of Claim 29, wherein the engagement event of element (d) is an atomic scan-code
check-in as claimed in the parent application, and wherein the scan record inherits the
tool-invocation identifier, thereby closing the loop from an AI assistant conversation to a
physical in-store visit.

### Dependent Claim 29.2

The method of Claim 29, wherein the attribution decay function is exponential with a configurable
half-life expressed in hours, and wherein a distinct half-life is configurable per agent-client
identifier.

### Dependent Claim 29.3

The method of Claim 29, further comprising a de-duplication guard that discards attribution seeds
sharing an identical tuple of agent-client identifier, subject identifier, and record identifier
within a configurable idempotency window.

### Dependent Claim 29.4

The method of Claim 29, wherein the settlement obligation is computed as a fixed percentage of
attributed net revenue, said percentage stored on the enterprise organization record and
version-stamped so that historical statements remain reproducible after a rate change.

### Dependent Claim 29.5

The method of Claim 29, further comprising an analytics surface that reports, per agent-client
identifier, the counts of tool invocations, profile views, engagement events, and transactions,
together with the derived conversion rate at each stage of the chain.

---

## CLAIM 30: HIERARCHICAL AGENTIC ARTIFICIAL-INTELLIGENCE WORKFORCE WITH DIVISIONAL DELEGATION AND CLOSED LEARNING LOOP

### Independent Claim 30

A computer-implemented multi-agent operating system that performs enumerated organizational
functions of a commercial enterprise without a corresponding human staff, comprising:

a) a persisted agent roster defining a fixed plurality of role-specialized autonomous software
agents, each agent record comprising a stable agent identifier, a division assignment, a
natural-language role charter, an enumerated tool-permission set, a model-selection directive, and
an escalation threshold;

b) a three-tier hierarchy comprising (i) an executive orchestration agent, (ii) a plurality of
divisional lead agents each owning one functional division, and (iii) a plurality of operational
agents subordinate to exactly one divisional lead;

c) an objective intake interface that receives a natural-language objective from a human principal
and routes it to the executive orchestration agent;

d) a decomposition component in which the executive orchestration agent partitions the objective
into division-scoped tasks, assigns each task to the divisional lead whose charter best matches a
computed semantic similarity, and records the assignment in a task ledger with a parent-task
foreign key forming a directed acyclic execution graph;

e) a permission-binding component wherein each agent's enumerated tool-permission set is mapped to
a database role, such that an agent's attempted read or write is additionally constrained by
row-level-security policies evaluated against that role, and no agent can exceed its charter even
if its generated output requests a broader action;

f) an idempotent run log keyed on a deterministic hash of task identifier, agent identifier, and
normalized input payload, wherein a run whose hash already exists in a terminal state is skipped
rather than re-executed;

g) a confidence estimator producing a scalar confidence for each agent output, and an escalation
router that, when confidence falls below the agent's configured escalation threshold, suspends the
task and enqueues it for human review rather than committing the output; and

h) a closed learning loop that persists, per agent, prior conversation memory and human
accept/reject/edit feedback events, and injects a summarized form of said history into subsequent
invocations of the same agent so that corrections are not repeated.

### Dependent Claim 30.1

The system of Claim 30, wherein the fixed plurality of agents numbers forty-two, organized into
divisions comprising at minimum revenue, member experience, marketing, finance, compliance,
engineering, data, and partnerships.

### Dependent Claim 30.2

The system of Claim 30, wherein all agent writes to operational tables occur exclusively through
security-definer database functions having an immutably pinned schema search path, such that no
agent holds direct table-level write privilege.

### Dependent Claim 30.3

The system of Claim 30, wherein the executive orchestration agent is exposed to end users through a
named conversational persona and to internal operators through a task console, both interfaces
sharing one task ledger.

### Dependent Claim 30.4

The system of Claim 30, wherein the model-selection directive permits per-agent selection among a
plurality of underlying language models routed through a single gateway credential, and wherein a
failure or rate-limit response from a selected model triggers deterministic fallback to a
designated secondary model without task loss.

### Dependent Claim 30.5

The system of Claim 30, further comprising a cost-accounting component that attributes token
consumption and monetary cost to the originating task, division, and objective, enabling per-
division operating-cost reporting.

### Dependent Claim 30.6

The system of Claim 30, wherein the directed acyclic execution graph supports fan-out to a
plurality of operational agents executing concurrently and a join barrier at the divisional lead
that aggregates subordinate outputs before returning to the executive orchestration agent.

### Dependent Claim 30.7

The system of Claim 30, wherein human feedback events are typed as accept, reject, or edit, and
wherein an edit event stores both the agent's original output and the human-corrected output as a
paired exemplar used for subsequent in-context correction.

---

## CLAIM 31: AUTONOMOUS BACK-OFFICE SUBSTITUTION ENGINE WITH VERIFIABLE COST-AVOIDANCE ACCOUNTING

### Independent Claim 31

A computer-implemented system that substitutes the agent workforce of Claim 30 for enumerated human
back-office functions and produces an auditable measure of the substitution's economic value,
comprising:

a) a role-substitution mapping table associating each enumerated human back-office role with one or
more agents of the roster, a reference labor cost for the role, and an achieved coverage fraction;

b) a workload meter that counts completed tasks per substituted role over a reporting period,
derived from terminal-state entries in the run log of Claim 30;

c) a cost-avoidance calculator producing a periodic savings figure as the sum over substituted
roles of the reference labor cost multiplied by the achieved coverage fraction, less the metered
operating cost of the agents performing that role;

d) a coverage expression component that renders the substitution result as a count of roles covered
rather than as a count of positions eliminated;

e) a service-level monitor that records, per substituted role, task latency, escalation rate, and
human-rejection rate, and that automatically reduces the achieved coverage fraction when the
rejection rate for a role exceeds a configured ceiling; and

f) an evidence ledger retaining, for each reported savings figure, the underlying task counts,
cost inputs, and coverage fractions in immutable period snapshots.

### Dependent Claim 31.1

The system of Claim 31, wherein the enumerated back-office functions comprise customer support,
bookkeeping and reconciliation, marketing content production, compliance monitoring, recruiting and
onboarding, partner reporting, and business-intelligence analysis.

### Dependent Claim 31.2

The system of Claim 31, wherein the periodic savings figure is surfaced to a subscribing enterprise
customer as a contractual value metric alongside the revenue-share settlement of Claim 29.

### Dependent Claim 31.3

The system of Claim 31, wherein the service-level monitor's automatic reduction of a coverage
fraction triggers a task in the ledger of Claim 30 assigned to the divisional lead owning the
degraded role.

---

## CLAIM 32: WHITE-LABEL ENTERPRISE ORGANIZATION TENANCY WITH CHAPTER HIERARCHY

### Independent Claim 32

A computer-implemented multi-tenant system that provisions a co-branded operating environment for a
member-based external organization on top of a shared vertical commerce platform, comprising:

a) an organization record comprising a URL-safe slug, display name, brand asset references, a
revenue-share percentage, a term length, a launch date, and a lifecycle state;

b) a chapter table storing a hierarchical decomposition of the organization into geographic or
administrative units, each chapter having a parent-chapter foreign key permitting arbitrary depth,
a chapter administrator assignment, and a member-count estimate;

c) a membership table associating platform user accounts with exactly one chapter and, transitively,
with one organization, wherein association may be established by administrator import, by
self-declaration with administrator confirmation, or by claim of an invited seat;

d) a leadership-seat mechanism in which an administrator pre-registers an electronic mail address
against a chapter role prior to account existence, and wherein a claim function executed at first
authentication matches the authenticated address to the pre-registered seat and atomically grants
the corresponding scoped role;

e) a co-branded presentation layer that renders organization brand assets adjacent to platform brand
assets on a public landing route derived from the organization slug and on an authenticated
dashboard route, without duplicating application code per organization;

f) a scoped authorization model in which every organization-scoped table carries an organization
identifier and every access policy resolves the requesting user's organization and chapter through
a security-definer resolver function, preventing cross-organization data visibility; and

g) an onboarding plan generator that instantiates, upon organization creation, an ordered set of
dated onboarding tasks bound to the organization's launch date, each task having an owner, a due
offset, and a completion state.

### Dependent Claim 32.1

The system of Claim 32, wherein the leadership-seat claim function is idempotent and, upon a second
invocation for an already-claimed seat, returns the existing grant without creating a duplicate
role assignment.

### Dependent Claim 32.2

The system of Claim 32, further comprising a bulk chapter import that accepts a delimited file,
validates each row against the chapter schema, reports per-row failures without aborting the batch,
and commits only validated rows.

### Dependent Claim 32.3

The system of Claim 32, wherein the co-branded presentation layer additionally generates a printable
single-page partner kit containing the organization lock-up, a scannable machine-readable code
encoding the organization landing route, and a downloadable raster form of said code.

### Dependent Claim 32.4

The system of Claim 32, wherein the organization record's revenue-share percentage may be zero,
establishing a no-fee distribution partnership in which the organization's economic consideration is
member introduction rather than payment.

### Dependent Claim 32.5

The system of Claim 32, wherein the agent workforce of Claim 30 is instantiated per organization as a
scoped division roster, such that agent outputs for one organization are inaccessible to another.

---

## CLAIM 33: MEMBER-TO-MERCHANT ATTRIBUTION AND AUTOMATED REVENUE-SHARE SETTLEMENT FOR ENTERPRISE PARTNERS

### Independent Claim 33

A computer-implemented method for automatically attributing merchant acquisition and merchant
revenue to an enterprise organization partner and settling a contractual share thereof, comprising:

a) detecting, at the moment a merchant record is created, an attribution signal comprising at least
one of a partner-scoped referral parameter present in the creation request, a partner-scoped
machine-readable code, an authenticated creator whose membership resolves to a chapter of the
organization, or an administrator override;

b) executing a database trigger that writes an immutable attribution record binding the merchant to
the resolved organization and chapter at creation time, wherein subsequent modification of the
merchant's ownership does not alter the original attribution;

c) accumulating, per reporting period, the platform net revenue generated by all merchants bound to
the organization, including subscription revenue, transaction fees, and placement revenue;

d) computing the settlement amount as the accumulated net revenue multiplied by the organization's
version-stamped revenue-share percentage;

e) rolling the settlement amount up the chapter hierarchy of Claim 32 so that each ancestor chapter
reports the sum of its descendants; and

f) generating an immutable period statement enumerating merchant-level contributions, chapter-level
subtotals, the applied percentage, and the resulting payable, and locking said statement against
retroactive modification once issued.

### Dependent Claim 33.1

The method of Claim 33, wherein the attribution signal further comprises an AI-agent tool-invocation
identifier as claimed in Claim 29, thereby crediting the organization for merchants discovered
through an autonomous AI assistant.

### Dependent Claim 33.2

The method of Claim 33, wherein a merchant may carry at most one organization attribution, and a
conflicting later signal is recorded as a secondary influence event without altering the payable.

### Dependent Claim 33.3

The method of Claim 33, further comprising a member-side dashboard presenting the chapter's merchant
count, cumulative attributed revenue, and applied circulation-multiplier community impact figure.

---

## CLAIM 34: MULTI-TENANT PRIVILEGED-COLUMN LOCK FRAMEWORK

### Independent Claim 34

A computer-implemented database security framework that prevents privilege escalation by record
owners across a heterogeneous set of tables through a single generalized enforcement primitive,
comprising:

a) a registry associating each protected table with an enumerated list of privileged column names,
wherein a privileged column is one that governs verification state, approval state, subscription
tier, commission rate, payout eligibility, fare or price of record, or activation state;

b) a generalized enforcement function executing before each update statement that compares, for each
registered privileged column, the pre-image value to the post-image value;

c) an authority resolver invoked only when a difference is detected, said resolver determining
whether the acting principal holds an administrative role by querying a dedicated role-assignment
table through a security-definer function having an immutably pinned schema search path, wherein
role membership is never read from a user-editable profile record;

d) a rejection path that raises a database exception and aborts the transaction when a privileged
column differs and the acting principal lacks the administrative role, such that no application-layer
bypass exists;

e) an owner-permitted exception list allowing enumerated non-privileged lifecycle columns to be
modified by the record owner while all registered privileged columns remain locked; and

f) a service-context bypass permitting trusted server-side execution contexts to perform
privileged mutations while denying the same mutation to a browser-originated session bearing the
owner's credentials.

### Dependent Claim 34.1

The framework of Claim 34, wherein the generalized enforcement function is attached to a plurality of
tables exceeding twenty by trigger declaration alone, without per-table function duplication.

### Dependent Claim 34.2

The framework of Claim 34, wherein the registry is itself a protected table whose privileged columns
are the registered column lists, preventing an attacker from de-registering a protection.

### Dependent Claim 34.3

The framework of Claim 34, wherein every rejection emits an audit record capturing the acting
principal, table, column, pre-image value, attempted post-image value, and timestamp.

### Dependent Claim 34.4

The framework of Claim 34, wherein table-level grants are issued explicitly per role at table
creation time and absence of an explicit grant results in denial, such that row-level policies are
never relied upon as the sole access control.

---

## CLAIM 35: AUTONOMOUS SECURITY AUTOPILOT WITH SCHEDULED REMEDIATION AND DIGEST REPORTING

### Independent Claim 35

A computer-implemented system for continuously detecting, classifying, remediating, and reporting
security defects in a multi-tenant application without human initiation, comprising:

a) a scheduled job executor internal to the database that invokes a scan orchestration endpoint on a
recurring interval;

b) a scan battery comprising at least a row-level-security coverage check, an explicit-grant coverage
check, a privileged-column registry coverage check as defined in Claim 34, a function search-path
mutability check, an unauthenticated-endpoint check across deployed serverless functions, and a
dependency vulnerability check;

c) a finding store assigning each detected defect a stable internal identifier derived from a hash of
defect class and affected object, such that the same defect recurring after a regression reuses its
prior identifier and its remediation history remains attached;

d) a classifier assigning severity from the defect class and the sensitivity of the affected data,
and a triage router that marks a finding auto-remediable when a deterministic corrective migration
template exists for its class;

e) a remediation executor that applies the corrective template for auto-remediable findings, re-runs
the corresponding scan to verify closure, and reverts on verification failure;

f) an escalation path that routes non-auto-remediable findings to the agent workforce of Claim 30
for proposal generation and then to a human operator for approval; and

g) a digest generator that composes a periodic electronic mail summary enumerating new findings,
auto-remediated findings, verified closures, and outstanding items requiring human approval, and
delivers it to a configured administrative distribution list.

### Dependent Claim 35.1

The system of Claim 35, wherein a finding's remediation history comprises an ordered list of
detection, attempted remediation, verification, and regression events, enabling identification of
chronically regressing defects.

### Dependent Claim 35.2

The system of Claim 35, further comprising an operator console presenting current posture, findings
by severity, remediation success rate, and the scheduled job's execution health.

### Dependent Claim 35.3

The system of Claim 35, wherein the scheduled job executor persists an execution lock preventing
overlapping scans, and wherein an abandoned lock older than a configured age is reclaimed
automatically.

### Dependent Claim 35.4

The system of Claim 35, wherein the unauthenticated-endpoint check enumerates deployed serverless
functions from a manifest, invokes each without credentials, and flags any function returning a
non-authentication-error status.

---

## CLAIM 36: AUTONOMOUS EXTERNAL-ENTITY CONTACT ENRICHMENT PIPELINE

### Independent Claim 36

A computer-implemented method for autonomously converting a bare external-entity name into a
verified, contactable, deduplicated lead record, comprising:

a) accepting a seed record comprising an entity name and an optional locality;

b) executing a web retrieval pass that resolves a candidate canonical domain for the entity and
retrieves structured page content therefrom;

c) submitting the retrieved content to a language model with a constrained output schema requiring
extraction of principal contact name, role, electronic mail address, telephone number, physical
address, and an extraction-confidence scalar;

d) validating each extracted field against a format and plausibility rule set, and discarding fields
failing validation rather than persisting low-quality values;

e) deduplicating the enriched record against existing records using a normalized composite key of
domain and electronic mail address;

f) writing the resulting personally identifying contact fields to a private, administrator-only
table separated from the publicly readable entity table, joined by a shared identifier; and

g) recording the retrieval source URL, model identifier, extraction timestamp, and confidence scalar
as provenance on the enriched record.

### Dependent Claim 36.1

The method of Claim 36, wherein the publicly readable entity table contains no duplicate copy of any
personally identifying field, and access to the private table is denied to all non-administrative
roles by both explicit grant and row-level policy.

### Dependent Claim 36.2

The method of Claim 36, wherein records whose extraction confidence falls below a threshold are
queued for human review rather than marked contactable.

### Dependent Claim 36.3

The method of Claim 36, wherein the pipeline is executed as a batch pass by an agent of the
partnerships division defined in Claim 30, subject to that agent's tool-permission set.

---

## CLAIM 37: ROTATING SAVINGS CIRCLE ESCROW WITH CONTRIBUTION-AUTHENTICITY ENFORCEMENT

### Independent Claim 37

A computer-implemented system for administering a rotating savings and credit association within a
commerce platform while structurally preventing fabricated contributions, comprising:

a) a circle record defining members, contribution amount, cadence, payout order, and cycle state;

b) an escrow ledger in which a contribution row may be created only by a security-definer function
invoked from a trusted server context, and never by a direct client insert, enforced by absence of
insert grant to end-user roles;

c) a settlement-confirmation precondition requiring that a contribution row reference a confirmed
external payment settlement identifier before its status may advance to funded;

d) an immutability guard preventing modification of amount, member, cycle, or status fields of a
funded contribution by any non-administrative principal;

e) a payout authorization function that releases a cycle payout only when the count of funded
contributions equals the member count for that cycle, computed inside the same transaction as the
release; and

f) an anomaly detector that flags a circle when contribution timing, amount variance, or membership
overlap with other circles exceeds configured thresholds, suspending payouts pending review.

### Dependent Claim 37.1

The system of Claim 37, wherein the anomaly detector incorporates the geospatial velocity fraud
signals of the parent application to detect collusive membership across circles.

### Dependent Claim 37.2

The system of Claim 37, further comprising a public-facing trust disclosure surface enumerating the
escrow custody model, identity-verification requirement, payout preconditions, and the distinction
between the claimed system and an unfunded pyramid arrangement.

### Dependent Claim 37.3

The system of Claim 37, wherein every state transition of a contribution or payout is appended to an
immutable audit log retained independently of the operational tables.

---

## CLAIM 38: COMPLIANCE-AWARE CROSS-PLATFORM MONETIZATION SWITCHING

### Independent Claim 38

A computer-implemented method for presenting a commercially and contractually compliant purchase
path for the same subscription product across a native mobile application and a web application,
comprising:

a) a product catalog in which each subscription tier carries a native-eligibility flag and an
optional native store product identifier;

b) a runtime platform detector distinguishing a native application shell from a browser context;

c) a tier-aware suppression function that, when executing in the native shell, hides web payment
affordances for tiers marked native-eligible and hides all purchase affordances for tiers not
marked native-eligible;

d) a native purchase path invoking the platform's in-application purchase framework for
native-eligible tiers and reconciling the resulting receipt against the server-side entitlement
record;

e) an entitlement reconciliation service that treats native receipts and web payment records as
alternative evidence for one canonical entitlement, preventing double billing when a user
transitions between platforms; and

f) a feature-affordance suppressor that additionally hides enumerated non-compliant features in the
native shell while leaving them available on the web.

### Dependent Claim 38.1

The method of Claim 38, wherein the suppression function is a single shared predicate consumed by all
purchase surfaces, such that adding a tier requires no per-surface modification.

### Dependent Claim 38.2

The method of Claim 38, wherein the native shell loads bundled application assets rather than a
remote origin, and wherein a navigation allow-list restricts outbound navigation to enumerated
origins.

### Dependent Claim 38.3

The method of Claim 38, further comprising a launch-integrity guard that holds a splash surface until
the application root has rendered, preventing presentation of an empty view on cold start.

---

## CLAIM 39: VERIFICATION BADGE PROPAGATION STATE MACHINE

### Independent Claim 39

A computer-implemented method for maintaining a single authoritative verification state per merchant
and propagating it consistently across heterogeneous presentation channels, comprising:

a) a state machine defining verification states and the permitted transitions between them, wherein
each transition requires an enumerated evidence type;

b) an authoritative state column protected by the privileged-column lock framework of Claim 34 such
that only administrative principals or trusted server contexts may effect a transition;

c) an evidence store binding each transition to its supporting artifact identifier, reviewer
identity, and timestamp;

d) a propagation fan-out that, upon transition, invalidates cached representations and republishes
the state to the human web surface, the protocol tool surface of Claim 28, the enterprise
organization surfaces of Claim 32, and any generated partner kit artifacts; and

e) an expiry component that automatically demotes a merchant's state when the age of its supporting
evidence exceeds a per-state maximum, and enqueues a re-verification task.

### Dependent Claim 39.1

The method of Claim 39, wherein the protocol tool surface returns both the state and the evidence
age, enabling a calling AI assistant to disclose verification recency.

### Dependent Claim 39.2

The method of Claim 39, wherein an attempted transition lacking the required evidence type is
rejected at the database layer rather than the application layer.

---

## CLAIM 40: COMMUNITY ECONOMIC CIRCULATION GRAPH AND CAPITAL-ALLOCATION SIGNAL

### Independent Claim 40

A computer-implemented system for constructing a directed, weighted graph of intra-community economic
flow and deriving therefrom an allocation signal, comprising:

a) a graph construction service in which nodes represent merchants, consumers, enterprise
organization chapters, and capital providers, and directed edges represent settled transactions,
attributed acquisitions, loyalty redemptions, and rotating-savings payouts;

b) an edge-weighting function combining transaction value, the circulation multiplier constant of
Claim 2, and the attribution decay function of Claim 29;

c) a retention metric computed per node as the ratio of value circulating to adjacent in-community
nodes versus value exiting to out-of-community nodes within a rolling window;

d) a leakage detector identifying categories in which out-of-community outflow exceeds a threshold,
and emitting a merchant-acquisition target specification for that category and locality;

e) an allocation signal ranking candidate capital deployments by projected increase in the retention
metric per unit of capital; and

f) a periodic report surfacing the graph, retention metrics, leakage categories, and allocation
ranking to enterprise organization partners and capital providers.

### Dependent Claim 40.1

The system of Claim 40, wherein the merchant-acquisition target specification of element (d) is
emitted as a task into the ledger of Claim 30 and assigned to the partnerships division for
autonomous execution via the enrichment pipeline of Claim 36.

### Dependent Claim 40.2

The system of Claim 40, wherein the retention metric is computed at chapter granularity using the
hierarchy of Claim 32 and rolled up to organization granularity.

### Dependent Claim 40.3

The system of Claim 40, wherein agent-originated transactions attributed under Claim 29 are labeled
as such within the graph, permitting measurement of the incremental circulation attributable to the
protocol discovery layer of Claim 28.

---

## FILING PRIORITY RECOMMENDATION

| Priority | Claims | Rationale |
|---|---|---|
| 1 — file immediately | 28, 29 | Most commercially valuable, most exposed, most likely to be independently invented within six months. |
| 2 — file immediately | 30, 31 | Core of the operating-system narrative and the cost-substitution value metric. |
| 3 — file immediately | 32, 33 | The enterprise/chapter revenue-share model now in live deployment. |
| 4 — same filing | 34, 35 | Defensive; also strong evidence of reduction to practice. |
| 5 — same filing | 36–40 | Depth and design-around resistance. |

## COVERAGE LIMITS (READ BEFORE FILING)

Utility claims protect the described systems and methods. They do **not** protect: the brand names
and visual identity (secure via trademark), the source code and copy (copyright, already automatic),
undisclosed prompt engineering and scoring weights (better kept as trade secrets and deliberately
omitted from the specification), or the commercial terms of any partnership offer. Counsel should be
asked specifically which of Claims 28–40 to **narrow** for allowability and which to **broaden** for
design-around resistance.

**This document is a technical draft prepared for patent counsel. It is not legal advice.**
