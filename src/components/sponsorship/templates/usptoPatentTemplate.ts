
// USPTO Patent Filing Package Content Template
// This file contains structured data for generating the patent Word document

export interface PatentClaim {
  number: number;
  title: string;
  independentClaim: string;
  dependentClaims: { id: string; text: string }[];
  technicalImplementation?: string;
}

export interface USPTOPatentContent {
  title: string;
  filingDate: string;
  applicantName: string;
  correspondenceAddress: string;
  contact: string;
  commercialNames: string;
  abstract: string;
  fieldOfInvention: string;
  background: {
    problemStatement: string;
    deficiencies: string[];
  };
  summary: {
    architectureTiers: { name: string; description: string; features: string[] }[];
  };
  claims: PatentClaim[];
  keyConstants: { constant: string; value: string; location: string; claim: string }[];
  technologyMatrix: { technology: string; equivalents: string }[];
  pctLanguage: string;
  pctCountries: string[];
  legalSafeguards: {
    broadInterpretation: string[];
    doctrineOfEquivalents: string;
  };
  filingChecklist: { document: string; status: string }[];
  filingFees: { entityType: string; fee: string }[];
}

export const getUSPTOPatentContent = (): USPTOPatentContent => {
  return {
    title: "System and Method for a Multi-Tenant Vertical Marketplace Operating System Featuring Temporal Incentives, Circulatory Multiplier Attribution, Cross-Business Coalition Loyalty Networks, Voice-Enabled AI Concierge, Hierarchical Sales Agent Networks, and Geospatial Velocity Fraud Detection",
    filingDate: "January 22, 2026",
    applicantName: "Thomas D. Bowling",
    correspondenceAddress: "1000 E. 111th Street, Suite 1100, Chicago, Illinois 60628",
    contact: "312.709.6006 | contact@1325.ai",
    commercialNames: "1325.AI (dba Mansa Musa Marketplace)",
    
    abstract: `A comprehensive multi-tenant marketplace operating system designed to support minority-owned businesses through an integrated ecosystem of novel technical systems. The invention includes:

1. Temporal Founding Member Status Assignment via database triggers with immutable lifetime benefits
2. Economic Circulation Multiplier Attribution (CMAL) using culturally-derived 2.3x constant
3. Cross-Business Coalition Loyalty Networks with tiered point multipliers (Bronze 1x, Silver 1.25x, Gold 1.5x, Platinum 2x)
4. Geospatial Velocity-Based Fraud Detection using AI pattern analysis with impossible travel detection
5. Intelligent B2B Matching with weighted multi-factor scoring (category 30pts, location 20pts, budget 15pts, rating 15pts)
6. Voice-Enabled Concierge Services via WebSocket bridge to OpenAI Realtime API
7. Hierarchical Sales Agent Commission Networks with team overrides and recruitment bonuses
8. Gamification Layers including achievements, streaks, leaderboards, and group challenges
9. QR-Code Transaction Processing with 7.5% integrated commission splitting via Stripe Connect
10. AI-Powered Personalized Business Recommendations with Gemini 2.5 Flash integration
11. Real-Time Voice AI Bridge Architecture with persona injection and VAD configuration
12. AI Tool Registry for Voice Concierge with typed Zod validation
13. Atomic Fraud Alert Batch Insertion using PostgreSQL JSONB array processing
14. Economic Karma Scoring System for Cerebro-compatible data feeds`,

    fieldOfInvention: `The present invention relates generally to electronic commerce platforms and more specifically to a comprehensive multi-tenant vertical marketplace operating system designed to support minority-owned businesses through an integrated ecosystem of:

1. Temporal incentive structures with immutable founding member status
2. Economic circulation tracking with culturally-derived multiplier constants
3. Cross-business coalition loyalty programs with tiered point systems
4. AI-powered business matching with multi-factor weighted scoring
5. Voice-enabled concierge services with natural language processing
6. Gamification systems with achievements, streaks, and group challenges
7. Multi-tier sales agent networks with commission hierarchies
8. Corporate sponsorship impact attribution with real-time metrics
9. Geospatial velocity-based fraud detection using AI pattern analysis
10. QR-code transaction processing with integrated commission splitting
11. Real-time voice AI interface with WebSocket streaming
12. Community finance instruments (Susu circles)
13. HBCU student verification and discount programs
14. Business import and lead generation systems`,

    background: {
      problemStatement: `Traditional e-commerce and business directory platforms fail to address the unique economic challenges faced by minority-owned businesses, particularly Black-owned businesses in the United States. Research indicates that the "Black dollar" circulates within Black communities for only 6 hours compared to 20 days in other communities, representing a significant wealth disparity that perpetuates economic inequality.`,
      deficiencies: [
        "Lack of Economic Circulation Awareness: No existing platform tracks, visualizes, or incentivizes economic circulation within specific communities to maximize wealth retention.",
        "Fragmented Loyalty Programs: Current loyalty systems are siloed to individual businesses, failing to create network effects that benefit both consumers and business ecosystems.",
        "Insufficient Fraud Detection: Existing QR-code based transaction systems lack sophisticated geospatial and temporal analysis to prevent abuse such as impossible travel scenarios or coordinated manipulation.",
        "No Temporal Early-Adopter Incentives: Platforms fail to create immutable, time-based incentive structures that reward early participation with permanent benefits.",
        "Weak B2B Connectivity: Minority-owned businesses lack tools to discover and transact with other minority-owned businesses for supply chain and service needs.",
        "Limited Corporate Sponsorship Attribution: Corporate sponsors supporting minority communities cannot accurately measure the real economic impact of their investments.",
        "No Voice-First Accessibility: Existing platforms lack natural language voice interfaces for users who prefer verbal interaction.",
        "Absence of Commission-Based Growth Networks: No existing platform provides structured sales agent programs with hierarchical commission structures for platform growth."
      ]
    },

    summary: {
      architectureTiers: [
        {
          name: "Frontend Layer",
          description: "Progressive Web Application (PWA) and native mobile capabilities",
          features: [
            "React 18.3.1, TypeScript 5.x, and TailwindCSS 3.x",
            "Native mobile applications via Capacitor 7.4.3 for iOS and Android",
            "Real-time state management using TanStack Query (React Query) 5.56.2",
            "Framer Motion 12.10.0 for animated visualizations",
            "Offline-first architecture with service worker caching"
          ]
        },
        {
          name: "Backend Layer",
          description: "Serverless infrastructure with real-time capabilities",
          features: [
            "Supabase/PostgreSQL 15+ database with Row-Level Security (RLS)",
            "Edge Functions (Deno 1.x runtime) for serverless business logic",
            "Real-time subscriptions via WebSocket connections",
            "Stripe Connect for payment processing with 7.5% platform commission",
            "Rate limiting at function level with in-memory stores"
          ]
        },
        {
          name: "AI/ML Layer",
          description: "Artificial intelligence and machine learning integration",
          features: [
            "Lovable AI Gateway integration (Google Gemini 2.5 Flash, OpenAI GPT-4o)",
            "OpenAI Realtime API for voice interactions",
            "Custom prompt engineering for business-specific AI applications",
            "Rate-limited API consumption with fallback mechanisms",
            "Tool-based structured output extraction"
          ]
        }
      ]
    },

    claims: [
      {
        number: 1,
        title: "TEMPORAL FOUNDING MEMBER STATUS SYSTEM",
        independentClaim: `A computer-implemented method for automatically and irrevocably assigning founding member status to platform users, comprising:

a) receiving a user registration request at a server, wherein said request includes an associated timestamp representing the moment of registration;

b) executing a database trigger function that compares said registration timestamp against a predetermined temporal cutoff constant stored within said trigger function, wherein said cutoff constant is defined as a specific date and time value that cannot be modified at runtime;

c) upon determining that the registration timestamp precedes the temporal cutoff constant, automatically setting a founding member boolean flag to TRUE within a user profile record;

d) simultaneously storing a founding_member_since timestamp that preserves the exact registration moment with microsecond precision;

e) enforcing immutability of said founding member status through database-level constraint triggers that prevent any subsequent modification, revocation, or deletion of the founding member flag through any application interface, administrative action, or direct database manipulation;

f) persisting said founding member status across all account modifications including but not limited to password resets, email address changes, account merges, and platform version upgrades.`,
        dependentClaims: [
          { id: "1.1", text: "The method of Claim 1, wherein the temporal cutoff constant is encoded as a UTC timestamp in ISO 8601 format and stored as a CONSTANT declaration within the database trigger function, thereby preventing modification without database migration." },
          { id: "1.2", text: "The method of Claim 1, further comprising a secondary constraint trigger that raises a database exception when any UPDATE statement attempts to change the is_founding_member field from TRUE to FALSE, with the exception message stating \"Founding member status cannot be revoked.\"" },
          { id: "1.3", text: "The method of Claim 1, wherein the founding member status provides automatic enrollment in a lifetime benefits program comprising: Permanent 2x loyalty point multiplier on all transactions, Priority customer support queue placement, Waived premium subscription fees, Distinguished visual badge display across all platform interfaces, Reduced platform transaction fees." },
          { id: "1.4", text: "The method of Claim 1, wherein the founding_member_since timestamp is used to establish tiered founding member classifications based on registration order, including \"First 100,\" \"First 1,000,\" and \"First 10,000\" designations, each with progressively differentiated benefit packages." }
        ],
        technicalImplementation: `DECLARE
  v_cutoff_timestamp CONSTANT TIMESTAMP WITH TIME ZONE := '2026-03-31T23:59:59Z';
BEGIN
  IF NEW.created_at < v_cutoff_timestamp THEN
    NEW.is_founding_member := true;
    NEW.founding_member_since := NEW.created_at;
  END IF;
  RETURN NEW;
END;`
      },
      {
        number: 2,
        title: "ECONOMIC CIRCULATION MULTIPLIER ATTRIBUTION ENGINE (CMAL)",
        independentClaim: `A computer-implemented system for calculating and attributing community economic impact through application of a culturally-derived circulation multiplier constant, comprising:

a) a transaction monitoring component that captures all monetary transactions occurring within a multi-tenant marketplace platform, wherein each transaction includes at minimum: transaction amount, business identifier, customer identifier, and timestamp;

b) a multiplier attribution engine that applies a circulation multiplier constant of 2.3 to each transaction amount, wherein said constant represents the empirically-derived number of times currency circulates within the target demographic community before exiting, as established by Federal Reserve Bank studies on minority business economics;

c) a community reach calculator that estimates the number of individuals impacted by applying a reach multiplier constant of 10 to the count of unique customers, representing the extended network effect of each transaction;

d) an aggregation service that computes cumulative metrics including: total businesses supported (count of unique business_ids), total transactions (count of all transaction records), raw transaction value (sum of transaction amounts), and total economic impact (raw transaction value multiplied by the 2.3 circulation constant);

e) a sponsor attribution component that associates said metrics with corporate sponsor subscriptions, enabling real-time visualization of sponsor investment returns through dashboard interfaces;

f) a persistent storage mechanism that stores daily snapshots of impact metrics with subscription_id and metric_date as a composite unique constraint, enabling time-series analysis of community investment performance.`,
        dependentClaims: [
          { id: "2.1", text: "The system of Claim 2, wherein the circulation multiplier constant of 2.3 is derived from peer-reviewed economic research specific to Black American communities, including National Bureau of Economic Research publications on minority business wealth retention patterns." },
          { id: "2.2", text: "The system of Claim 2, further comprising an animated visualization component that displays the multiplication effect in real-time, showing the flow from initial purchase amount through community circulation to final economic impact, using motion graphics to illustrate the wealth multiplication process." },
          { id: "2.3", text: "The system of Claim 2, wherein the economic impact calculation is performed by an edge function executing in a serverless environment, with the formula: economic_impact = Σ(transaction_amount) × CIRCULATION_MULTIPLIER where CIRCULATION_MULTIPLIER = 2.3" },
          { id: "2.4", text: "The system of Claim 2, further comprising a sponsor dashboard interface that displays: Businesses supported count with comparison to previous period, Total economic impact with percentage growth, Community reach estimation with visualization, Return on Investment (ROI) calculation comparing sponsor contribution to generated economic activity." }
        ]
      },
      {
        number: 3,
        title: "CROSS-BUSINESS COALITION LOYALTY NETWORK",
        independentClaim: `A computer-implemented cross-merchant loyalty point system enabling universal point earning and redemption across a coalition of participating businesses, comprising:

a) a coalition points ledger maintaining a single unified point balance per customer, stored in a coalition_points table with customer_id as a unique constraint;

b) a tiered membership system with four distinct tiers (Bronze, Silver, Gold, Platinum), each tier defined by lifetime point thresholds and associated with a point earning multiplier (1.0x, 1.25x, 1.5x, 2.0x respectively);

c) an automatic tier promotion mechanism implemented as a database trigger that evaluates lifetime_earned points against tier thresholds after each point transaction and automatically updates the customer's tier designation;

d) a point awarding function that calculates final points by multiplying base points by the customer's current tier multiplier, atomically updating both the current balance and lifetime earned total, and recording the transaction in an audit log;

e) a cross-merchant redemption capability wherein points earned at any coalition member business may be redeemed for value at any other coalition member business, with the redemption transaction recording both the source and destination business identifiers;

f) a coalition membership registry that tracks participating businesses with activation status, total points distributed, and total points redeemed, enabling network-wide analytics.`,
        dependentClaims: [
          { id: "3.1", text: "The system of Claim 3, wherein tier thresholds are defined as: Bronze: 0-999 lifetime points, Silver: 1,000-4,999 lifetime points, Gold: 5,000-14,999 lifetime points, Platinum: 15,000+ lifetime points." },
          { id: "3.2", text: "The system of Claim 3, wherein the point awarding function is implemented as a PostgreSQL stored procedure with SECURITY DEFINER privileges, ensuring consistent application of tier multipliers regardless of calling context." },
          { id: "3.3", text: "The system of Claim 3, further comprising a coalition transactions table that records every point movement with transaction_type classification including: earn, redeem, transfer, bonus, referral, and expiry." },
          { id: "3.4", text: "The system of Claim 3, wherein the coalition network creates a positive-sum economic model where: Customers are incentivized to patronize multiple coalition businesses to maximize point accumulation, Businesses benefit from increased traffic driven by cross-business point redemption, The platform benefits from increased transaction volume and user engagement." }
        ]
      },
      {
        number: 4,
        title: "GEOSPATIAL VELOCITY FRAUD DETECTION SYSTEM",
        independentClaim: `An artificial intelligence-powered fraud detection system utilizing geospatial velocity analysis to identify impossible travel scenarios and abuse patterns, comprising:

a) a data collection component that captures transaction and activity records including geographic coordinates, timestamps, and user identifiers from QR code scans, transactions, and platform activities;

b) a velocity calculation engine that computes implied travel speed between sequential user actions using the formula: V = D / Δt where: V = implied velocity (miles per hour), D = Haversine distance between geographic coordinates, Δt = time delta between actions (hours);

c) a configurable velocity threshold comparator, with a default threshold of 600 mph to account for commercial aviation, that flags any calculated velocity exceeding the threshold as a potential impossible travel scenario;

d) an AI-mediated pattern analysis component utilizing a large language model (LLM) to analyze aggregated activity patterns and identify coordinated abuse, transaction anomalies, and suspicious account behavior;

e) a structured alert generation mechanism using LLM function calling (tool use) to produce typed fraud alerts containing: alert_type, severity level (low/medium/high/critical), affected user_id, affected business_id, human-readable description, supporting evidence, and AI confidence score;

f) an atomic batch insertion function that stores all generated alerts in a single database transaction using PostgreSQL jsonb_array_elements processing;

g) a privacy-preserving data sanitization layer that removes or redacts personally identifiable information (IP addresses, email addresses, phone numbers, user agents) before transmitting data to external AI services.`,
        dependentClaims: [
          { id: "4.1", text: "The system of Claim 4, wherein the fraud alert types include: velocity_abuse (Action frequency exceeding human-possible rates), location_mismatch (Geographically impossible travel detected), qr_scan_abuse (Coordinated scanning patterns across accounts), transaction_anomaly (Unusual transaction amounts or frequencies), account_suspicious (New accounts with immediate high activity), review_manipulation (Burst patterns in reviews from related accounts)." },
          { id: "4.2", text: "The system of Claim 4, wherein detection of a velocity exceeding the threshold triggers an automatic escrow hold on associated points and pending payouts until manual review is completed." },
          { id: "4.3", text: "The system of Claim 4, wherein the AI confidence score is a decimal value between 0.0 and 1.0, with alerts scoring above 0.85 automatically escalated to critical priority and alerts scoring below 0.5 requiring additional evidence before action." },
          { id: "4.4", text: "The system of Claim 4, wherein the batch insertion function is implemented using PostgreSQL's jsonb_array_elements for atomic processing." }
        ]
      },
      {
        number: 5,
        title: "AI-POWERED B2B MATCHING ENGINE",
        independentClaim: `An intelligent business-to-business matching system connecting minority-owned businesses using multi-factor weighted scoring and AI-enhanced recommendations, comprising:

a) a business needs registry where businesses post procurement requirements including category, budget range, urgency level, and preferred geographic area;

b) a business capabilities registry where businesses advertise their products and services with category, pricing range, service area, lead time, and certifications;

c) a multi-factor weighted scoring algorithm that evaluates each capability against each need using the following scoring weights: CATEGORY_MATCH: 30 points, SAME_CITY: 20 points, SAME_STATE: 10 points, SERVICE_AREA_OVERLAP: 15 points, BUDGET_COMPATIBILITY: 15 points, RATING_BONUS_MAX: 15 points, TIMELINE_MATCH: 10 points;

d) a score normalization component that caps the maximum composite score at 100 points;

e) a ranking and filtering service that sorts matches by score descending and returns the top 10 candidates;

f) an AI enhancement layer that generates natural language recommendations for top matches by providing the need description, match details, and score reasons to a large language model;

g) a connection tracking system that records initiated B2B relationships with status progression (pending, contacted, negotiating, contracted, completed, declined) and actual transaction values for network effect measurement.`,
        dependentClaims: [
          { id: "5.1", text: "The system of Claim 5, wherein the urgency to timeline matching uses the following day mappings: immediate: 3 days maximum, within_week: 7 days maximum, within_month: 30 days maximum, planning: 90 days maximum, flexible: 180 days maximum." },
          { id: "5.2", text: "The system of Claim 5, wherein the AI recommendation is generated using Google Gemini 2.5 Flash model with a prompt specifically instructing the model to act as a \"B2B matchmaker helping Black-owned businesses connect.\"" },
          { id: "5.3", text: "The system of Claim 5, further comprising a B2B messaging system that enables direct communication between matched businesses while maintaining conversation history linked to the connection record." }
        ]
      },
      {
        number: 6,
        title: "REAL-TIME VOICE AI BRIDGE ARCHITECTURE",
        independentClaim: `A WebSocket-based voice artificial intelligence interface enabling natural language interaction with a marketplace platform, comprising:

a) an edge function that upgrades incoming HTTP requests to WebSocket connections using Deno.upgradeWebSocket();

b) a secondary WebSocket connection initiated from the edge function to an external real-time voice AI provider (OpenAI Realtime API), creating a bidirectional bridge between the client and AI service;

c) a session configuration mechanism that injects platform-specific persona instructions, knowledge base, and behavioral guidelines into the AI session upon connection establishment;

d) a bidirectional message relay that forwards all messages from the client WebSocket to the AI provider WebSocket and vice versa, maintaining real-time audio streaming capability;

e) a voice-to-text and text-to-voice processing pipeline utilizing PCM16 audio format for both input and output streams;

f) a server-side voice activity detection (VAD) configuration with tunable parameters including threshold (0.5), prefix padding (300ms), and silence duration (800ms) for turn detection;

g) graceful connection lifecycle management that closes both WebSocket connections when either party disconnects.`,
        dependentClaims: [
          { id: "6.1", text: "The system of Claim 6, wherein the persona instructions define a character named \"Kayla\" with specific behavioral guidelines including: Use of natural contractions, Addition of filler words, Expression of genuine emotion, Response length limitation to 2-4 sentences, Platform-specific knowledge injection." },
          { id: "6.2", text: "The system of Claim 6, wherein the voice output uses the \"shimmer\" voice preset with temperature setting of 0.8 for natural variation." },
          { id: "6.3", text: "The system of Claim 6, further comprising a voice concierge tools function that provides structured tool implementations for: search_businesses, get_business_details, check_availability, get_recommendations, check_coalition_points, start_booking." }
        ]
      },
      {
        number: 7,
        title: "MULTI-TIER SALES AGENT COMMISSION NETWORK",
        independentClaim: `A hierarchical sales agent network with tiered commission structures and multi-level incentive systems, comprising:

a) a sales agent registry storing agent profiles with unique referral codes, commission rates, team override rates, tier designations, and recruitment relationships via a self-referencing recruited_by_agent_id foreign key;

b) a five-tier progression system (Bronze, Silver, Gold, Platinum, Diamond) with tier advancement triggered by lifetime referral counts: Bronze: 0-24 referrals (10% commission), Silver: 25-99 referrals (12% commission), Gold: 100-199 referrals (13% commission), Platinum: 200-499 referrals (14% commission), Diamond: 500+ referrals (15% commission);

c) a direct commission calculation engine that applies the agent's tier-based commission rate to subscription revenue from referred users;

d) a team override commission system wherein a recruiter agent receives a percentage (default 2.5%) of commissions earned by agents they recruited, creating a two-tier income structure;

e) a recruitment bonus mechanism that awards a fixed bonus (default $50) to the recruiter when a recruited agent achieves activation criteria;

f) a commission status tracking system with states: pending, approved, processing, paid, and cancelled, with associated payment references and dates;

g) a referral tracking table linking agents to referred users with conversion tracking, commission amounts, and tier designation (1 = direct, 2 = team bonus).`,
        dependentClaims: [
          { id: "7.1", text: "The system of Claim 7, wherein the team override commission is calculated as: override_amount = recruited_agent_commission × team_override_rate where default team_override_rate = 0.025 (2.5%)." },
          { id: "7.2", text: "The system of Claim 7, wherein tier progression is automatically calculated by a database trigger that fires on UPDATE of the lifetime_referrals column." },
          { id: "7.3", text: "The system of Claim 7, further comprising an agent performance dashboard displaying: Total referrals with conversion rate, Current tier with progress to next tier, Pending, approved, and paid commission amounts, Team size and team-generated revenue, Leaderboard ranking among peers." }
        ]
      },
      {
        number: 8,
        title: "GAMIFICATION AND ACHIEVEMENT SYSTEM",
        independentClaim: `A comprehensive gamification system incorporating achievements, streaks, leaderboards, and group challenges to incentivize platform engagement, comprising:

a) an achievement definitions table storing unlock criteria as JSONB, allowing flexible condition specification for achievements across categories: shopping, social, loyalty, community, and special;

b) a user achievements junction table recording achievement unlock timestamps with partial progress tracking for multi-step achievements;

c) a streak tracking system monitoring continuous activity patterns with streak types including daily_visit, weekly_purchase, review_streak, and referral_streak, storing current_streak, longest_streak, and last_activity_date with streak_multiplier bonuses;

d) a leaderboard system with period-based rankings (daily, weekly, monthly, all_time) and automatic rank calculation based on point accumulation within each period;

e) a group challenges framework enabling community-wide goals with challenge types: spending, visits, referrals, reviews, and coalition_points, tracking target_value, current_value, participant_count, and collective reward distribution;

f) a challenge participation table recording individual contributions toward group goals with contribution_value aggregation.`,
        dependentClaims: [
          { id: "8.1", text: "The system of Claim 8, wherein streak bonuses apply a multiplier to points earned, with the multiplier increasing based on streak length: 1-7 days: 1.0x, 8-14 days: 1.1x, 15-30 days: 1.25x, 31+ days: 1.5x." },
          { id: "8.2", text: "The system of Claim 8, wherein secret achievements are hidden from the user interface until unlocked, creating surprise and delight moments that encourage platform exploration." }
        ]
      },
      {
        number: 9,
        title: "QR-CODE TRANSACTION PROCESSING ENGINE",
        independentClaim: `A QR code-based transaction processing system with integrated commission splitting and loyalty point awarding, comprising:

a) a QR code registry storing code configurations including type (loyalty, payment, checkin, promo, menu), discount parameters, base points value (default 25), points multiplier, and usage limits;

b) a transaction processing edge function that validates incoming transaction requests using Zod schema validation for businessId (UUID), amount (positive, max 99,999.99), and optional fields;

c) a business payment account lookup that retrieves the Stripe Connect account ID and verifies charges_enabled status before processing;

d) a commission calculation component applying a platform commission rate (7.5%) to derive the application_fee_amount and business_amount: amountInCents = amount × 100, commission = amountInCents × 0.075, businessAmount = amountInCents - commission;

e) a Stripe PaymentIntent creation with application_fee_amount and transfer_data.destination for automatic split between platform and business;

f) a QR scan recording component that logs the scan with qr_code_id, customer_id, business_id, timestamp, and geographic coordinates (GEOGRAPHY Point) for fraud detection;

g) a loyalty points calculation awarding 10 points per dollar spent, recorded in the transaction metadata.`,
        dependentClaims: [
          { id: "9.1", text: "The system of Claim 9, wherein the geographic coordinates of QR scans are indexed for velocity fraud detection queries: CREATE INDEX idx_qr_scans_velocity ON qr_scans(customer_id, scan_date DESC);" },
          { id: "9.2", text: "The system of Claim 9, further comprising a commission recording function that atomically logs the platform commission for accounting and agent payout purposes." }
        ]
      },
      {
        number: 10,
        title: "AI-POWERED PERSONALIZED RECOMMENDATIONS",
        independentClaim: `A machine learning-powered recommendation system generating personalized business suggestions, comprising:

a) a user preferences table storing explicit preferences including preferred categories, locations, and notification settings;

b) a business interactions tracker recording implicit signals including views, favorites, shares, reviews, and purchases with associated scores and timestamps;

c) a candidate retrieval component that fetches verified businesses ordered by rating, filtering by active status;

d) a context assembly mechanism that combines user preferences, recent interactions, and candidate businesses into a structured prompt for the recommendation model;

e) an AI recommendation engine utilizing Google Gemini 2.5 Flash that analyzes the assembled context and generates exactly 5 recommendations with scores between 0.75 and 1.00;

f) a recommendation persistence layer that stores generated recommendations with user_id, business_id, recommendation_score, recommendation_reason, and expiration timestamp (default 24 hours);

g) a recommendation refresh trigger that regenerates recommendations when user interactions significantly change or upon expiration.`,
        dependentClaims: [
          { id: "10.1", text: "The system of Claim 10, wherein the AI model is instructed to consider: User's preferred categories and locations, Past interaction patterns, Business ratings and quality, Geographic proximity, Diversity of recommendations, Support for lesser-known but quality businesses alongside popular ones." },
          { id: "10.2", text: "The system of Claim 10, wherein recommendation click-through is tracked with clicked boolean and clicked_at timestamp, enabling model feedback and recommendation quality measurement." }
        ]
      },
      {
        number: 11,
        title: "REAL-TIME VOICE AI BRIDGE ARCHITECTURE (Extended)",
        independentClaim: `A WebSocket bridge architecture connecting client applications to external real-time AI voice services through an intermediary edge function, comprising:

a) an HTTP-to-WebSocket upgrade handler in a serverless edge function that establishes a persistent connection with the client;

b) a secondary WebSocket connection from the edge function to an external AI provider (OpenAI Realtime API) with authentication headers including API key and beta feature flags;

c) a session initialization sequence that waits for session.created event before transmitting session.update configuration with platform-specific parameters;

d) persona injection through the session configuration containing: modalities specification (text, audio), detailed natural language instructions defining assistant personality, voice selection, audio format specification (pcm16), turn detection parameters, temperature setting for response variation;

e) bidirectional message forwarding that relays all messages from client to AI and AI to client without modification, maintaining audio stream integrity;

f) connection lifecycle management that closes both connections when either party disconnects, preventing orphaned connections.`,
        dependentClaims: [
          { id: "11.1", text: "The system of Claim 11, wherein the edge function is deployed to a globally distributed edge network, minimizing latency for voice interactions regardless of user geographic location." },
          { id: "11.2", text: "The system of Claim 11, wherein the voice AI session includes input_audio_transcription configuration enabling Whisper-based speech-to-text for logging and analysis purposes." }
        ]
      },
      {
        number: 12,
        title: "AI TOOL REGISTRY FOR VOICE CONCIERGE",
        independentClaim: `A structured tool registry enabling voice AI assistants to execute platform operations through validated tool invocations, comprising:

a) a Zod schema definition specifying valid tool names as an enumerated set: search_businesses, get_business_details, check_availability, get_recommendations, check_coalition_points, start_booking;

b) argument validation using z.record(z.unknown()) with runtime type checking for tool-specific parameters;

c) a switch-based tool router that executes the appropriate database query or service call based on the validated tool_name;

d) natural language response formatting that converts database results into human-readable messages suitable for voice synthesis;

e) rate limiting protection with in-memory stores tracking request counts per IP address with configurable thresholds (default: 20 requests per 60 seconds);

f) user context injection allowing tools to access user_id when available for personalized responses (e.g., coalition points balance).`,
        dependentClaims: [
          { id: "12.1", text: "The system of Claim 12, wherein the search_businesses tool supports optional filters: category: ilike pattern matching, city: ilike pattern matching, min_rating: greater-than-or-equal comparison, query: OR-combined ilike search across business_name, description, and category." },
          { id: "12.2", text: "The system of Claim 12, wherein tool responses include both structured data and a pre-formatted message field for immediate voice synthesis." }
        ]
      },
      {
        number: 13,
        title: "ATOMIC FRAUD ALERT BATCH INSERTION",
        independentClaim: `A PostgreSQL stored function for atomically inserting multiple AI-generated fraud alerts from JSONB input, comprising:

a) a function signature accepting a JSONB array of alert objects;

b) iteration over array elements using jsonb_array_elements();

c) field extraction using the ->> operator for text fields and -> operator for nested JSONB objects;

d) NULL handling using NULLIF() for optional fields that may be empty strings;

e) type casting using ::UUID and ::DECIMAL for strongly-typed database columns;

f) atomic insertion ensuring all alerts succeed or all fail together, preventing partial state;

g) return value of inserted row count using GET DIAGNOSTICS for confirmation.`,
        dependentClaims: [
          { id: "13.1", text: "The function of Claim 13, wherein the implementation uses SECURITY DEFINER privileges with SET search_path = public for secure execution context." }
        ]
      },
      {
        number: 14,
        title: "ECONOMIC KARMA SCORING SYSTEM",
        independentClaim: `A gamified contribution scoring system that tracks and rewards user participation in community economic circulation, comprising:

a) an economic_karma score stored per user, representing their cumulative contribution to community wealth velocity;

b) karma earning events triggered by: Transactions at platform businesses (karma proportional to transaction amount), Business referrals that result in registration, User referrals that result in activation, Review contributions, Coalition point circulation (earning and redeeming across different businesses), Participation in group challenges;

c) karma multiplier effects where users with higher karma scores receive: Increased visibility in recommendation algorithms, Priority in customer support queues, Enhanced matching scores in B2B connections, Bonus points on transactions;

d) karma decay mechanism that gradually reduces inactive karma over time, incentivizing continued platform engagement;

e) karma leaderboards displaying top contributors within geographic regions and platform-wide;

f) karma milestone achievements that unlock special badges and platform privileges at defined thresholds.`,
        dependentClaims: [
          { id: "14.1", text: "The system of Claim 14, wherein karma earning is calculated as: transaction_karma = transaction_amount × circulation_multiplier × 0.1, referral_karma = base_referral_karma × (1 + referred_user_tier_bonus), review_karma = review_length_factor × helpfulness_score." },
          { id: "14.2", text: "The system of Claim 14, wherein karma decay applies a 5% monthly reduction to karma scores for users with no platform activity in the preceding 30 days." },
          { id: "14.3", text: "The system of Claim 14, wherein karma is designed as a \"Cerebro-compatible feed\" that can be exported as a data stream for integration with external investment analytics platforms, providing signal on community economic velocity patterns." }
        ]
      }
    ],

    keyConstants: [
      { constant: "CIRCULATION_MULTIPLIER", value: "2.3", location: "calculate-sponsor-impact", claim: "Claim 2" },
      { constant: "REACH_MULTIPLIER", value: "10", location: "calculate-sponsor-impact", claim: "Claim 2" },
      { constant: "COMMISSION_RATE", value: "7.5%", location: "process-qr-transaction", claim: "Claim 9" },
      { constant: "POINTS_PER_DOLLAR", value: "10", location: "process-qr-transaction", claim: "Claim 9" },
      { constant: "FOUNDING_CUTOFF", value: "2026-03-31T23:59:59Z", location: "Database migration", claim: "Claim 1" },
      { constant: "FRAUD_VELOCITY_THRESHOLD", value: "600 mph", location: "detect-fraud", claim: "Claim 4" }
    ],

    technologyMatrix: [
      { technology: "PostgreSQL database triggers", equivalents: "Any relational database trigger system, MongoDB change streams, Firestore triggers, DynamoDB streams, smart contracts, event-driven serverless functions" },
      { technology: "2.3x circulation multiplier", equivalents: "Any multiplier constant > 1.0 applied to represent community economic circulation, whether 2.3, 2.0, 2.5, or any empirically-derived value" },
      { technology: "Supabase Edge Functions", equivalents: "AWS Lambda, Google Cloud Functions, Azure Functions, Cloudflare Workers, Vercel Edge Functions, Deno Deploy, Netlify Functions, any FaaS platform" },
      { technology: "OpenAI Realtime API", equivalents: "Any real-time voice AI provider including ElevenLabs, Deepgram, AssemblyAI, Amazon Transcribe/Polly, Google Cloud Speech-to-Text, Azure Speech Services" },
      { technology: "Stripe Connect", equivalents: "Any multi-party payment splitting system including PayPal Commerce, Adyen, Square, Plaid, any payment processor supporting application fees and destination charges" },
      { technology: "Google Gemini 2.5 Flash", equivalents: "Any large language model including OpenAI GPT-4/GPT-5, Anthropic Claude, Meta Llama, Mistral, Cohere, any transformer-based AI model" },
      { technology: "WebSocket connections", equivalents: "Any persistent bidirectional communication protocol including Server-Sent Events, WebRTC data channels, gRPC streaming, MQTT" },
      { technology: "Zod schema validation", equivalents: "Any runtime type validation library including Yup, Joi, io-ts, Valibot, AJV, any JSON Schema validator" }
    ],

    pctLanguage: "This provisional application expressly preserves priority rights for international filing under the Patent Cooperation Treaty (PCT) within 12 months of the filing date. The inventor reserves the right to file corresponding applications in all PCT member states.",

    pctCountries: [
      "European Patent Office (EPO)",
      "Japan Patent Office (JPO)",
      "Korean Intellectual Property Office (KIPO)",
      "China National Intellectual Property Administration (CNIPA)",
      "India Patent Office",
      "Brazil National Institute of Industrial Property (INPI)",
      "Canadian Intellectual Property Office (CIPO)",
      "Australian IP Office",
      "United Kingdom Intellectual Property Office (UKIPO)",
      "African Regional Intellectual Property Organization (ARIPO)",
      "Nigeria (particularly relevant for diaspora connection)",
      "Ghana (growing tech hub)",
      "Kenya (East African tech leader)",
      "South Africa (continental economic leader)"
    ],

    legalSafeguards: {
      broadInterpretation: [
        "Cloud-based servers (AWS, Google Cloud, Azure, or any infrastructure provider)",
        "Distributed ledgers (blockchain, DAG-based systems, or other decentralized technologies)",
        "Localized edge computing or hybrid cloud-edge architectures",
        "Any combination of relational databases, NoSQL databases, or graph databases",
        "Any programming languages, frameworks, or runtime environments",
        "Native mobile applications, progressive web applications, or hybrid solutions",
        "Alternative AI/ML providers or self-hosted machine learning models"
      ],
      doctrineOfEquivalents: "Pursuant to the doctrine of equivalents established in Graver Tank & Mfg. Co. v. Linde Air Products Co., 339 U.S. 605 (1950), and Warner-Jenkinson Co. v. Hilton Davis Chemical Co., 520 U.S. 17 (1997), the claims extend to any system, method, or apparatus that performs substantially the same function in substantially the same way to achieve substantially the same result as the inventions described herein."
    },

    filingChecklist: [
      { document: "Specification (this document)", status: "READY" },
      { document: "Formal Claims (14 independent + 25 dependent)", status: "READY" },
      { document: "System Diagrams", status: "READY" },
      { document: "Abstract", status: "READY" },
      { document: "Inventor Declaration", status: "PENDING SIGNATURE" },
      { document: "Application Data Sheet (USPTO Form PTO/AIA/14)", status: "PENDING" },
      { document: "Filing Fee Payment", status: "PENDING" }
    ],

    filingFees: [
      { entityType: "Micro Entity (recommended)", fee: "$80" },
      { entityType: "Small Entity", fee: "$160" },
      { entityType: "Large Entity", fee: "$320" }
    ]
  };
};
