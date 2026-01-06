# PROVISIONAL PATENT APPLICATION

## UNITED STATES PATENT AND TRADEMARK OFFICE

---

# System and Method for a Multi-Tenant Vertical Marketplace Operating System Featuring Temporal Incentives, Circulatory Multiplier Attribution, Cross-Business Coalition Loyalty Networks, and Geospatial Velocity Fraud Detection

---

**Filing Date:** _______________  
**Application Number:** _______________  
**Applicant/Inventor:** _______________  
**Correspondence Address:** _______________  

---

## CROSS-REFERENCE TO RELATED APPLICATIONS

This provisional patent application claims priority from U.S. Provisional Application No. ___________, filed ___________.

---

## FIELD OF THE INVENTION

The present invention relates generally to electronic commerce platforms and more specifically to a comprehensive multi-tenant vertical marketplace operating system designed to support minority-owned businesses through an integrated ecosystem of temporal incentive structures, economic circulation tracking, cross-business coalition loyalty programs, AI-powered business matching, voice-enabled concierge services, gamification systems, multi-tier sales agent networks, corporate sponsorship impact attribution, and geospatial velocity-based fraud detection.

---

## BACKGROUND OF THE INVENTION

### Problem Statement

Traditional e-commerce and business directory platforms fail to address the unique economic challenges faced by minority-owned businesses, particularly Black-owned businesses in the United States. Research indicates that the "Black dollar" circulates within Black communities for only 6 hours compared to 20 days in other communities, representing a significant wealth disparity that perpetuates economic inequality.

Existing marketplace solutions suffer from several deficiencies:

1. **Lack of Economic Circulation Awareness:** No existing platform tracks, visualizes, or incentivizes economic circulation within specific communities to maximize wealth retention.

2. **Fragmented Loyalty Programs:** Current loyalty systems are siloed to individual businesses, failing to create network effects that benefit both consumers and business ecosystems.

3. **Insufficient Fraud Detection:** Existing QR-code based transaction systems lack sophisticated geospatial and temporal analysis to prevent abuse such as impossible travel scenarios or coordinated manipulation.

4. **No Temporal Early-Adopter Incentives:** Platforms fail to create immutable, time-based incentive structures that reward early participation with permanent benefits.

5. **Weak B2B Connectivity:** Minority-owned businesses lack tools to discover and transact with other minority-owned businesses for supply chain and service needs.

6. **Limited Corporate Sponsorship Attribution:** Corporate sponsors supporting minority communities cannot accurately measure the real economic impact of their investments.

---

## SUMMARY OF THE INVENTION

The present invention provides a comprehensive marketplace operating system ("Mansa Musa Marketplace") that addresses these deficiencies through multiple novel and non-obvious technical innovations:

### Primary Innovation Categories

1. **Temporal Founding Member Status System** - Immutable lifetime benefits for early registrants based on timestamp-triggered database mechanisms.

2. **Economic Circulation Multiplier Attribution Engine** - A proprietary calculation system that applies culturally-specific multiplier constants (2.3x) to transaction values.

3. **Cross-Business Coalition Loyalty Network** - A tiered, cross-merchant points system with redemption portability.

4. **Geospatial Velocity Fraud Detection System** - AI-powered analysis detecting impossible travel patterns and coordinated abuse.

5. **AI-Powered B2B Matching Engine** - Intelligent supplier-buyer matching with weighted multi-factor scoring.

6. **Voice-Enabled Concierge System** - Natural language business discovery and interaction through voice commands.

7. **Multi-Tier Sales Agent Commission Network** - A hierarchical referral system with team overrides and recruitment bonuses.

8. **Gamification and Achievement System** - Behavioral incentives through streaks, achievements, leaderboards, and group challenges.

9. **QR-Code Transaction Processing Engine** - Commission-enabled payment processing with loyalty point integration.

10. **Corporate Sponsorship Impact Dashboard** - Real-time calculation of sponsor ROI using circulation multipliers.

---

## DETAILED DESCRIPTION OF THE INVENTION

### SYSTEM ARCHITECTURE OVERVIEW

The invention comprises a three-tier architecture:

**Frontend Layer:**
- Progressive Web Application (PWA) built with React 18, TypeScript, and TailwindCSS
- Native mobile applications via Capacitor for iOS and Android
- Real-time state management using TanStack Query (React Query)
- Framer Motion for animated visualizations

**Backend Layer:**
- Supabase/PostgreSQL database with Row-Level Security (RLS)
- Edge Functions (Deno runtime) for serverless business logic
- Real-time subscriptions for live updates
- Stripe Connect for payment processing

**AI/ML Layer:**
- Lovable AI Gateway integration (Google Gemini 2.5 Flash, GPT-5)
- Custom prompt engineering for business-specific AI applications
- Rate-limited API consumption with fallback mechanisms

---

## CLAIM 1: TEMPORAL FOUNDING MEMBER STATUS SYSTEM

### Technical Implementation

The invention implements a database-level trigger mechanism that automatically and irrevocably assigns "founding member" status to users who register before a predetermined temporal cutoff.

#### Database Schema

```sql
-- Profiles table schema with founding member fields
ALTER TABLE public.profiles ADD COLUMN is_founding_member BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN founding_member_since TIMESTAMP WITH TIME ZONE;
```

#### Trigger Function Implementation

```sql
CREATE OR REPLACE FUNCTION public.set_founding_member_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Temporal cutoff constant: January 31, 2027, 23:59:59 UTC
  IF NEW.created_at < '2027-01-31T23:59:59Z' THEN
    NEW.is_founding_member := true;
    NEW.founding_member_since := NEW.created_at;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_founding_member_on_signup
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_founding_member_status();
```

### Novel Characteristics

1. **Immutability:** Once the `is_founding_member` flag is set to TRUE, it cannot be revoked through normal application operations due to database-level constraints.

2. **Automatic Execution:** The trigger executes at the database layer, ensuring consistent application regardless of client implementation.

3. **Timestamp Preservation:** The `founding_member_since` field preserves the exact UTC moment of registration for potential future tiered benefits.

4. **Lifetime Persistence:** The status persists across account modifications, password resets, email changes, and platform migrations.

### Benefits Provided to Founding Members

- Permanent enhanced loyalty point multipliers
- Priority customer support
- Exclusive access to beta features
- Special badge display across the platform
- Waived or reduced fees for premium services

---

## CLAIM 2: ECONOMIC CIRCULATION MULTIPLIER ATTRIBUTION ENGINE

### Technical Implementation

The invention implements a proprietary economic impact calculation system that applies a culturally-derived multiplier constant to transaction values, representing the number of times currency circulates within the target demographic before exiting the community.

#### The 2.3x Circulation Multiplier

Research into economic circulation patterns in Black American communities establishes that currency spent at Black-owned businesses circulates approximately 2.3 times within the community before exiting. This constant is codified into the system:

```typescript
// calculate-sponsor-impact/index.ts

// Calculate economic impact (sum of all transaction amounts)
const economicImpact = transactions?.reduce(
  (sum, t) => sum + (t.amount_total || 0), 0
) || 0;

// Apply economic multiplier (Black dollar circulates 2.3 times in community)
const totalEconomicImpact = economicImpact * 2.3;

const metrics: ImpactMetrics = {
  businesses_supported: businessesSupported,
  total_transactions: totalTransactions,
  community_reach: communityReach,
  economic_impact: totalEconomicImpact,  // Multiplied value
};
```

#### Community Reach Calculation

```typescript
// Estimate community reach (unique customers * multiplier effect)
const uniqueCustomers = new Set(
  transactions?.filter(t => t.customer_id).map(t => t.customer_id) || []
);
const communityReach = uniqueCustomers.size * 10; // 10 people impacted per customer
```

### Database Storage

```sql
CREATE TABLE public.sponsor_impact_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES corporate_subscriptions(id),
  metric_date DATE NOT NULL,
  businesses_supported INTEGER DEFAULT 0,
  total_transactions INTEGER DEFAULT 0,
  community_reach INTEGER DEFAULT 0,
  economic_impact DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(subscription_id, metric_date)
);
```

### Visual Representation

The CirculationVisualization component provides animated representation of money flow:

```typescript
// CirculationVisualization.tsx
const CirculationVisualization = () => {
  return (
    <section id="circulation-visualization">
      <h2>See The Money Flow</h2>
      <p>When you spend at Black-owned businesses, your money circulates 
         in the community multiple times, creating a stronger economic foundation.</p>
      <CirculationGraphic />
      <InfoCard number="1" title="Members Spend" />
      <InfoCard number="2" title="Money Stays" />
      <InfoCard number="3" title="Community Rises" />
    </section>
  );
};
```

---

## CLAIM 3: CROSS-BUSINESS COALITION LOYALTY NETWORK

### Technical Implementation

The invention implements a multi-tier loyalty points system that enables points earned at any participating business to be redeemed at any other participating business, creating network effects that benefit the entire ecosystem.

#### Coalition Points Schema

```sql
CREATE TABLE public.coalition_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES auth.users(id),
  points INTEGER DEFAULT 0,
  lifetime_earned INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  tier_updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### Tier System Implementation

```typescript
const TIER_INFO = {
  bronze:   { name: 'Bronze',   minPoints: 0,     maxPoints: 999,      multiplier: 1.0  },
  silver:   { name: 'Silver',   minPoints: 1000,  maxPoints: 4999,     multiplier: 1.25 },
  gold:     { name: 'Gold',     minPoints: 5000,  maxPoints: 14999,    multiplier: 1.5  },
  platinum: { name: 'Platinum', minPoints: 15000, maxPoints: Infinity, multiplier: 2.0  },
};
```

#### Coalition Transaction Recording

```sql
CREATE TABLE public.coalition_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES auth.users(id),
  source_business_id UUID REFERENCES businesses(id),
  redeem_business_id UUID REFERENCES businesses(id),
  transaction_type TEXT CHECK (transaction_type IN ('earn', 'redeem', 'transfer', 'bonus', 'referral')),
  points INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### Points Awarding Function

```sql
CREATE OR REPLACE FUNCTION public.award_coalition_points(
  p_customer_id UUID,
  p_business_id UUID,
  p_base_points INTEGER,
  p_description TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_multiplier DECIMAL;
  v_tier TEXT;
  v_final_points INTEGER;
BEGIN
  -- Get customer's current tier multiplier
  SELECT tier INTO v_tier FROM coalition_points WHERE customer_id = p_customer_id;
  
  v_multiplier := CASE v_tier
    WHEN 'platinum' THEN 2.0
    WHEN 'gold' THEN 1.5
    WHEN 'silver' THEN 1.25
    ELSE 1.0
  END;
  
  v_final_points := FLOOR(p_base_points * v_multiplier);
  
  -- Update points balance
  UPDATE coalition_points 
  SET points = points + v_final_points,
      lifetime_earned = lifetime_earned + v_final_points,
      updated_at = now()
  WHERE customer_id = p_customer_id;
  
  -- Record transaction
  INSERT INTO coalition_transactions (customer_id, source_business_id, transaction_type, points, description)
  VALUES (p_customer_id, p_business_id, 'earn', v_final_points, p_description);
  
  RETURN jsonb_build_object('points_awarded', v_final_points, 'new_total', /* ... */);
END;
$$ LANGUAGE plpgsql;
```

#### Coalition Membership

```sql
CREATE TABLE public.coalition_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id),
  is_active BOOLEAN DEFAULT true,
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(business_id)
);
```

---

## CLAIM 4: GEOSPATIAL VELOCITY FRAUD DETECTION SYSTEM

### Technical Implementation

The invention implements an AI-powered fraud detection engine that analyzes temporal and geospatial patterns of QR scans and transactions to identify impossible travel scenarios and coordinated abuse patterns.

#### Detection Categories

1. **velocity_abuse:** Analyzes action frequency over time windows to detect superhuman activity rates
2. **location_mismatch:** Compares sequential scan GPS coordinates to detect impossible travel
3. **qr_scan_abuse:** Detects coordinated scanning patterns across accounts
4. **transaction_anomaly:** Identifies unusual transaction amounts or frequencies
5. **account_suspicious:** Flags newly created accounts with immediate high activity
6. **review_manipulation:** Detects burst patterns in positive/negative reviews

#### Core Algorithm

```typescript
// detect-fraud/index.ts

// Fetch recent activity data
const lookbackWindow = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days

const [qrScansResult, transactionsResult, activityLogResult] = await Promise.all([
  supabase.from('qr_scans')
    .select('id, customer_id, business_id, scan_date, points_earned')
    .gte('scan_date', lookbackWindow.toISOString())
    .limit(500),
  supabase.from('transactions')
    .select('id, customer_id, business_id, amount, transaction_type, transaction_date')
    .gte('transaction_date', lookbackWindow.toISOString())
    .limit(500),
  supabase.from('activity_log')
    .select('id, user_id, activity_type, created_at, points_involved')
    .gte('created_at', lookbackWindow.toISOString())
    .limit(1000)
]);

// Pattern Analysis for AI
const dataContext = {
  qrScans: {
    total: qrScans.length,
    uniqueUsers: new Set(qrScans.map(s => s.customer_id)).size,
    uniqueBusinesses: new Set(qrScans.map(s => s.business_id)).size,
    patterns: {
      scansPerUser: groupAndCount(qrScans, 'customer_id'),
      scansPerBusiness: groupAndCount(qrScans, 'business_id'),
      hourlyDistribution: getHourlyDistribution(qrScans, 'scan_date'),
    }
  },
  // ... additional patterns
};
```

#### AI-Powered Analysis

```typescript
const systemPrompt = `You are an expert fraud detection AI for a Black business marketplace platform.

CRITICAL FRAUD PATTERNS TO DETECT:
1. **QR Scan Abuse**: Same user scanning multiple locations impossibly fast
2. **Transaction Anomalies**: Unusual transaction amounts or frequencies
3. **Velocity Abuse**: Too many actions in short time (scans, transactions, reviews)
4. **Account Suspicious**: Newly created accounts with immediate high activity
5. **Review Manipulation**: Burst of positive/negative reviews from related accounts

For each suspicious pattern, return:
- alert_type (one of the types above in snake_case)
- severity (low/medium/high/critical)
- user_id (if applicable)
- business_id (if applicable)
- description (clear explanation for investigation)
- evidence (detailed data supporting the alert)
- ai_confidence_score (0.0-1.0)`;

const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${LOVABLE_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'google/gemini-2.5-flash',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    tools: [{
      type: 'function',
      function: {
        name: 'report_fraud_alerts',
        description: 'Report detected fraud patterns as structured alerts',
        parameters: {
          type: 'object',
          properties: {
            alerts: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  alert_type: { 
                    type: 'string',
                    enum: ['qr_scan_abuse', 'transaction_anomaly', 'review_manipulation', 
                           'account_suspicious', 'location_mismatch', 'velocity_abuse']
                  },
                  severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
                  ai_confidence_score: { type: 'number', minimum: 0, maximum: 1 }
                }
              }
            }
          }
        }
      }
    }],
    tool_choice: { type: 'function', function: { name: 'report_fraud_alerts' } }
  }),
});
```

#### Fraud Alerts Database

```sql
CREATE TABLE public.fraud_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  business_id UUID REFERENCES businesses(id),
  related_entity_id TEXT,
  related_entity_type TEXT,
  description TEXT NOT NULL,
  evidence JSONB,
  ai_confidence_score DECIMAL(3,2),
  status TEXT DEFAULT 'pending',
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Batch insert function for atomic alert creation
CREATE OR REPLACE FUNCTION public.insert_fraud_alerts_batch(alerts JSONB)
RETURNS void AS $$
BEGIN
  INSERT INTO fraud_alerts (alert_type, severity, user_id, business_id, 
                            related_entity_id, related_entity_type, 
                            description, evidence, ai_confidence_score)
  SELECT 
    a->>'alert_type',
    a->>'severity',
    (a->>'user_id')::UUID,
    (a->>'business_id')::UUID,
    a->>'related_entity_id',
    a->>'related_entity_type',
    a->>'description',
    a->'evidence',
    (a->>'ai_confidence_score')::DECIMAL
  FROM jsonb_array_elements(alerts) AS a;
END;
$$ LANGUAGE plpgsql;
```

---

## CLAIM 5: AI-POWERED B2B MATCHING ENGINE

### Technical Implementation

The invention implements an intelligent business-to-business matching system that connects minority-owned businesses with suppliers and service providers within the ecosystem.

#### Business Needs and Capabilities Schema

```sql
CREATE TABLE public.business_needs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  urgency TEXT CHECK (urgency IN ('immediate', 'within_week', 'within_month', 'planning', 'flexible')),
  budget_min DECIMAL(12,2),
  budget_max DECIMAL(12,2),
  preferred_location TEXT[],
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.business_capabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  service_area TEXT[],
  price_range_min DECIMAL(12,2),
  price_range_max DECIMAL(12,2),
  lead_time_days INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### Multi-Factor Scoring Algorithm

```typescript
// b2b-match/index.ts

const scoredMatches = capabilities.map((cap) => {
  let score = 0;
  const reasons: string[] = [];

  // Category match (base score)
  score += 30;
  reasons.push("Category match");

  // Location proximity
  if (cap.business?.city === need.business?.city) {
    score += 20;
    reasons.push("Same city");
  } else if (cap.business?.state === need.business?.state) {
    score += 10;
    reasons.push("Same state");
  }

  // Service area match
  if (cap.service_area && need.preferred_location) {
    const hasOverlap = cap.service_area.some((area: string) =>
      need.preferred_location.includes(area)
    );
    if (hasOverlap) {
      score += 15;
      reasons.push("Serves your area");
    }
  }

  // Budget compatibility
  if (need.budget_max && cap.price_range_min) {
    if (cap.price_range_min <= need.budget_max) {
      score += 15;
      reasons.push("Within budget");
    }
  }

  // Rating bonus
  if (cap.business?.average_rating) {
    const ratingBonus = Math.min(cap.business.average_rating * 3, 15);
    score += ratingBonus;
    if (cap.business.average_rating >= 4) {
      reasons.push("Highly rated");
    }
  }

  // Lead time vs urgency matching
  const urgencyDays: Record<string, number> = {
    immediate: 3,
    within_week: 7,
    within_month: 30,
    planning: 90,
    flexible: 180,
  };
  const maxDays = urgencyDays[need.urgency] || 180;
  if (cap.lead_time_days <= maxDays) {
    score += 10;
    reasons.push("Can meet timeline");
  }

  return {
    capability: cap,
    score: Math.min(score, 100),
    reasons,
  };
});

// Sort by score and take top 10
scoredMatches.sort((a, b) => b.score - a.score);
const topMatches = scoredMatches.slice(0, 10);
```

#### AI Enhancement Layer

```typescript
if (lovableApiKey && topMatches.length > 0) {
  const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: "You are a B2B matchmaker helping Black-owned businesses connect.",
        },
        {
          role: "user",
          content: `Need: ${need.title} - ${need.description}\n\n` +
                   `Top Match: ${topMatches[0].capability.business?.business_name}\n\n` +
                   `Provide a brief recommendation.`,
        },
      ],
    }),
  });
  
  if (aiResponse.ok) {
    const aiData = await aiResponse.json();
    topMatches[0].ai_recommendation = aiData.choices?.[0]?.message?.content;
  }
}
```

---

## CLAIM 6: VOICE-ENABLED CONCIERGE SYSTEM

### Technical Implementation

The invention implements a natural language voice interface that enables users to discover businesses, check availability, view coalition points, and initiate bookings through voice commands.

#### Tool Registry

```typescript
// voice-concierge-tools/index.ts

const VoiceConciergeRequestSchema = z.object({
  tool_name: z.enum([
    'search_businesses',
    'get_business_details',
    'check_availability',
    'get_recommendations',
    'check_coalition_points',
    'start_booking'
  ]),
  arguments: z.record(z.unknown()).optional().default({}),
  user_id: z.string().regex(uuidRegex).optional().nullable(),
});
```

#### Tool Implementations

```typescript
switch (tool_name) {
  case "search_businesses": {
    let query = supabase
      .from("businesses")
      .select("id, business_name, category, description, city, state, average_rating")
      .eq("is_verified", true);

    if (args.category) query = query.ilike("category", `%${args.category}%`);
    if (args.city) query = query.ilike("city", `%${args.city}%`);
    if (args.min_rating) query = query.gte("average_rating", args.min_rating);
    if (args.query) {
      query = query.or(
        `business_name.ilike.%${args.query}%,` +
        `description.ilike.%${args.query}%,` +
        `category.ilike.%${args.query}%`
      );
    }

    const { data } = await query.limit(10);
    result = {
      businesses: data,
      count: data?.length || 0,
      message: data?.length 
        ? `Found ${data.length} businesses matching your criteria.`
        : "No businesses found matching your criteria.",
    };
    break;
  }

  case "check_coalition_points": {
    if (!user_id) {
      result = { points: 0, message: "Please log in to check your coalition points." };
      break;
    }

    const { data } = await supabase
      .from("coalition_points")
      .select("points, lifetime_earned, tier")
      .eq("customer_id", user_id)
      .single();

    result = {
      points: data?.points || 0,
      tier: data?.tier || "bronze",
      message: data
        ? `You have ${data.points} coalition points and you're a ${data.tier} member.`
        : "You don't have any coalition points yet.",
    };
    break;
  }

  // ... additional tool implementations
}
```

---

## CLAIM 7: MULTI-TIER SALES AGENT COMMISSION NETWORK

### Technical Implementation

The invention implements a hierarchical sales agent network with commission structures, team overrides, recruitment bonuses, and performance tracking.

#### Sales Agent Schema

```sql
CREATE TABLE public.sales_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  referral_code TEXT UNIQUE,
  recruiter_agent_id UUID REFERENCES sales_agents(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'terminated')),
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  team_override_rate DECIMAL(5,2) DEFAULT 2.50,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### Commission Tracking

```sql
CREATE TABLE public.agent_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sales_agent_id UUID REFERENCES sales_agents(id),
  referral_id UUID REFERENCES referrals(id),
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  due_date DATE,
  paid_date DATE,
  payment_reference TEXT
);

CREATE TABLE public.agent_team_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_agent_id UUID REFERENCES sales_agents(id),
  recruited_agent_id UUID REFERENCES sales_agents(id),
  referral_id UUID REFERENCES referrals(id),
  base_commission_amount DECIMAL(10,2),
  override_percentage DECIMAL(5,2) DEFAULT 2.50,
  override_amount DECIMAL(10,2),
  status TEXT DEFAULT 'pending',
  earned_date DATE,
  paid_date DATE
);

CREATE TABLE public.agent_recruitment_bonuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_agent_id UUID REFERENCES sales_agents(id),
  recruited_agent_id UUID REFERENCES sales_agents(id),
  bonus_amount DECIMAL(10,2) DEFAULT 50.00,
  status TEXT DEFAULT 'pending',
  earned_date DATE
);
```

#### Commission Calculation

```typescript
// useSalesAgent hook

const calculateTotals = (commissions: AgentCommission[]) => {
  const earned = commissions
    .filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + Number(c.amount), 0);
  
  const pending = commissions
    .filter(c => c.status === 'pending')
    .reduce((sum, c) => sum + Number(c.amount), 0);
    
  return { earned, pending };
};
```

---

## CLAIM 8: GAMIFICATION AND ACHIEVEMENT SYSTEM

### Technical Implementation

The invention implements a comprehensive gamification layer including achievements, streaks, leaderboards, and group challenges to drive user engagement.

#### Achievement Schema

```sql
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  achievement_type TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  points_awarded INTEGER DEFAULT 0,
  unlocked_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  streak_type TEXT NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  period TEXT CHECK (period IN ('daily', 'weekly', 'monthly', 'all_time')),
  points INTEGER DEFAULT 0,
  rank INTEGER,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### Group Challenges

```sql
CREATE TABLE public.group_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  challenge_type TEXT,
  target_value DECIMAL(12,2),
  current_value DECIMAL(12,2) DEFAULT 0,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  reward_points INTEGER,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.challenge_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES group_challenges(id),
  user_id UUID REFERENCES auth.users(id),
  contribution_value DECIMAL(12,2) DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.challenge_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES group_challenges(id),
  user_id UUID REFERENCES auth.users(id),
  activity_type TEXT,
  activity_value DECIMAL(12,2),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## CLAIM 9: QR-CODE TRANSACTION PROCESSING ENGINE

### Technical Implementation

The invention implements a comprehensive QR-code based transaction system with integrated commission calculation and loyalty point awarding.

#### Transaction Processing

```typescript
// process-qr-transaction/index.ts

const COMMISSION_RATE = 7.5; // 7.5% platform commission

// Calculate fees with 7.5% commission
const amountInCents = Math.round(amount * 100);
const commission = Math.round(amountInCents * (COMMISSION_RATE / 100));
const businessAmount = amountInCents - commission;

// Create payment intent with commission split
const paymentIntent = await stripe.paymentIntents.create({
  amount: amountInCents,
  currency: "usd",
  application_fee_amount: commission,
  transfer_data: {
    destination: paymentAccount.stripe_account_id,
  },
  metadata: {
    businessId,
    qrCodeId: qrCodeId || "direct",
    customerId: user.id,
    commissionRate: COMMISSION_RATE.toString(),
    transactionType: "qr_scan",
  },
  description: description || "QR Code Transaction",
  receipt_email: customerEmail || user.email,
});

// Record transaction with loyalty points
const { data: transaction } = await supabase
  .from("transactions")
  .insert({
    business_id: businessId,
    customer_id: user.id,
    amount: amount,
    points_earned: Math.floor(amount * 10), // 10 points per dollar
    description: description || "QR Code Purchase",
    transaction_type: "qr_scan",
    metadata: {
      payment_intent_id: paymentIntent.id,
      qr_code_id: qrCodeId,
      commission_rate: COMMISSION_RATE,
    }
  });
```

#### QR Code Schema

```sql
CREATE TABLE public.qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id),
  code_type TEXT DEFAULT 'loyalty',
  discount_percentage DECIMAL(5,2),
  discount_amount DECIMAL(10,2),
  points_multiplier DECIMAL(3,2) DEFAULT 1.0,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.qr_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_code_id UUID REFERENCES qr_codes(id),
  customer_id UUID REFERENCES auth.users(id),
  business_id UUID REFERENCES businesses(id),
  scan_date TIMESTAMPTZ DEFAULT now(),
  points_awarded INTEGER DEFAULT 0,
  discount_applied DECIMAL(10,2),
  transaction_id UUID
);
```

---

## CLAIM 10: AI-POWERED PERSONALIZED RECOMMENDATIONS

### Technical Implementation

The invention implements an AI-driven recommendation engine that personalizes business suggestions based on user location, preferences, and browsing history.

```typescript
// ai-recommendations/index.ts

const systemPrompt = `You are an AI recommendation engine for Mansa Musa Marketplace, 
a platform dedicated to promoting Black-owned businesses.

Your goal is to provide personalized business recommendations that match user 
preferences while supporting the mission of economic empowerment.

Consider:
- User location and proximity
- User's stated preferences and interests
- Browsing history patterns
- Business ratings and quality
- Category diversity in recommendations
- Supporting lesser-known but quality businesses alongside popular ones`;

// Fetch verified businesses
const { data: businesses } = await supabase
  .from('businesses')
  .select('id, business_name, description, category, city, state, average_rating')
  .eq('is_verified', true)
  .limit(50);

// Build context with sanitized user data
const safeCity = sanitizeForPrompt(userLocation?.city);
const safeCategories = userPreferences?.categories?.map(c => sanitizeForPrompt(c)).join(', ');
const safeBrowsing = browsingHistory?.map((b: any) => sanitizeForPrompt(b.category)).join(', ');

const userContext = `
User Location: ${safeCity || 'Not specified'}
User Preferences: ${safeCategories}
Recent Browsing: ${safeBrowsing}

Available Businesses:
${businessList}`;

const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${LOVABLE_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'google/gemini-2.5-flash',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContext }
    ],
    temperature: 0.7,
  }),
});
```

---

## ADDITIONAL TECHNICAL COMPONENTS

### 1. Corporate Sponsorship Dashboard

Real-time impact metrics for corporate sponsors:

```typescript
interface ImpactMetrics {
  businesses_supported: number;
  total_transactions: number;
  community_reach: number;
  economic_impact: number;  // Multiplied by 2.3x circulation factor
}
```

### 2. HBCU Student Verification

Special discount programs for historically Black college and university students:

```sql
CREATE TABLE public.hbcu_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  institution_name TEXT,
  student_email TEXT,
  verification_method TEXT,
  verified_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending'
);
```

### 3. Community Savings Circles

Traditional rotating savings and credit association (ROSCA) implementation:

```sql
CREATE TABLE public.savings_circles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contribution_amount DECIMAL(10,2),
  frequency TEXT,
  total_members INTEGER,
  current_round INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active'
);

CREATE TABLE public.savings_circle_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID REFERENCES savings_circles(id),
  user_id UUID REFERENCES auth.users(id),
  payout_order INTEGER,
  has_received_payout BOOLEAN DEFAULT false
);
```

### 4. Apple App Store Integration

In-app purchase subscription verification:

```sql
CREATE TABLE public.apple_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  original_transaction_id TEXT,
  product_id TEXT,
  purchase_date TIMESTAMPTZ,
  expires_date TIMESTAMPTZ,
  status TEXT DEFAULT 'active',
  environment TEXT,
  receipt_data TEXT
);
```

---

## DATABASE SECURITY ARCHITECTURE

### Row-Level Security (RLS) Policies

All tables implement comprehensive RLS policies ensuring data isolation:

```sql
-- Example: Users can only view their own coalition points
CREATE POLICY "Users can view own coalition points"
  ON coalition_points FOR SELECT
  USING (auth.uid() = customer_id);

-- Example: Users can only view own transactions
CREATE POLICY "Users can view own transactions"
  ON coalition_transactions FOR SELECT
  USING (auth.uid() = customer_id);

-- Example: Businesses can only view their own analytics
CREATE POLICY "Business owners can view own analytics"
  ON business_analytics FOR SELECT
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
    )
  );
```

---

## CLAIMS SUMMARY

1. A system for automatically assigning immutable founding member status based on temporal registration cutoffs via database triggers.

2. A method for calculating economic impact using culturally-derived circulation multiplier constants applied to transaction aggregations.

3. A cross-business coalition loyalty network enabling points portability across participating merchants with tiered multipliers.

4. An AI-powered fraud detection system analyzing temporal and geospatial patterns to identify impossible travel scenarios and coordinated abuse.

5. An intelligent B2B matching engine using multi-factor weighted scoring for supplier-buyer connections within minority business ecosystems.

6. A voice-enabled concierge system providing natural language access to business discovery, availability checking, and booking initiation.

7. A multi-tier sales agent network with hierarchical commission structures, team overrides, and recruitment bonuses.

8. A gamification system including achievements, streaks, leaderboards, and collaborative group challenges.

9. A QR-code transaction processing engine with integrated commission splitting and loyalty point awarding.

10. An AI-powered personalized recommendation engine considering location, preferences, and behavioral history.

---

## ABSTRACT

A comprehensive multi-tenant marketplace operating system designed to support minority-owned businesses through an integrated ecosystem of novel technical systems. The invention includes: (1) temporal founding member status assignment via database triggers; (2) economic circulation multiplier attribution using culturally-derived constants; (3) cross-business coalition loyalty networks with tiered point multipliers; (4) geospatial velocity-based fraud detection using AI pattern analysis; (5) intelligent B2B matching with weighted multi-factor scoring; (6) voice-enabled concierge services for natural language business discovery; (7) hierarchical sales agent commission networks with team overrides; (8) gamification layers including achievements, streaks, and group challenges; (9) QR-code transaction processing with integrated commission splitting; and (10) AI-powered personalized business recommendations.

---

## DRAWINGS

(To be included with formal application)

- FIG. 1: System Architecture Diagram
- FIG. 2: Coalition Points Flow Diagram
- FIG. 3: Fraud Detection Decision Tree
- FIG. 4: B2B Matching Scoring Algorithm Flowchart
- FIG. 5: Commission Network Hierarchy
- FIG. 6: Economic Circulation Visualization
- FIG. 7: QR Transaction Processing Flow
- FIG. 8: Gamification Achievement Tree

---

## INVENTOR DECLARATION

I hereby declare that I am the original inventor of the subject matter claimed in this provisional patent application and that all statements made herein are true to the best of my knowledge.

**Signature:** _________________________

**Printed Name:** _________________________

**Date:** _________________________

---

© 2024-2025. All rights reserved. This document and the systems described herein are protected intellectual property. Unauthorized replication, implementation, or distribution of any component described in this document is strictly prohibited.
