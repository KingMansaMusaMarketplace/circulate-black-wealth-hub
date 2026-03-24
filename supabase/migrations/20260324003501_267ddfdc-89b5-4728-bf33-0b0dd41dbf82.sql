-- Phase 3: Kayla Economic OS Tables

-- 1. Inventory & Vendor Management
CREATE TABLE IF NOT EXISTS kayla_inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  category TEXT,
  current_stock INTEGER DEFAULT 0,
  min_stock_level INTEGER DEFAULT 5,
  unit_cost NUMERIC(10,2) DEFAULT 0,
  supplier_name TEXT,
  supplier_contact TEXT,
  last_restocked_at TIMESTAMPTZ,
  reorder_recommended BOOLEAN DEFAULT FALSE,
  ai_notes TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kayla_vendor_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  vendor_name TEXT NOT NULL,
  vendor_type TEXT,
  estimated_savings NUMERIC(10,2),
  recommendation_reason TEXT,
  confidence_score NUMERIC(3,2),
  contact_info JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tax Prep Assistance
CREATE TABLE IF NOT EXISTS kayla_tax_prep (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  tax_year INTEGER NOT NULL,
  estimated_revenue NUMERIC(12,2),
  estimated_expenses NUMERIC(12,2),
  estimated_tax_liability NUMERIC(12,2),
  deductions_found JSONB DEFAULT '[]',
  quarterly_estimates JSONB DEFAULT '[]',
  filing_deadline DATE,
  prep_status TEXT DEFAULT 'not_started',
  ai_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Investment Readiness Scoring
CREATE TABLE IF NOT EXISTS kayla_investment_readiness (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  overall_score INTEGER DEFAULT 0,
  financial_health_score INTEGER DEFAULT 0,
  market_position_score INTEGER DEFAULT 0,
  team_readiness_score INTEGER DEFAULT 0,
  documentation_score INTEGER DEFAULT 0,
  growth_trajectory_score INTEGER DEFAULT 0,
  strengths JSONB DEFAULT '[]',
  weaknesses JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  investor_type_fit TEXT[],
  ai_assessment TEXT,
  assessed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Compliance Reminders
CREATE TABLE IF NOT EXISTS kayla_compliance_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  state TEXT,
  category TEXT DEFAULT 'general',
  urgency TEXT DEFAULT 'normal',
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  ai_generated BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Legal Template Generation
CREATE TABLE IF NOT EXISTS kayla_legal_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  template_type TEXT NOT NULL,
  template_name TEXT NOT NULL,
  content TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  is_customized BOOLEAN DEFAULT FALSE,
  ai_generated BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE kayla_inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE kayla_vendor_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE kayla_tax_prep ENABLE ROW LEVEL SECURITY;
ALTER TABLE kayla_investment_readiness ENABLE ROW LEVEL SECURITY;
ALTER TABLE kayla_compliance_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE kayla_legal_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Business owners manage inventory" ON kayla_inventory_items FOR ALL TO authenticated
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

CREATE POLICY "Business owners view vendor recs" ON kayla_vendor_recommendations FOR ALL TO authenticated
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

CREATE POLICY "Business owners manage tax prep" ON kayla_tax_prep FOR ALL TO authenticated
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

CREATE POLICY "Business owners view investment readiness" ON kayla_investment_readiness FOR ALL TO authenticated
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

CREATE POLICY "Business owners manage compliance" ON kayla_compliance_reminders FOR ALL TO authenticated
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

CREATE POLICY "Business owners manage legal templates" ON kayla_legal_templates FOR ALL TO authenticated
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_kayla_inventory_business ON kayla_inventory_items(business_id);
CREATE INDEX IF NOT EXISTS idx_kayla_vendor_recs_business ON kayla_vendor_recommendations(business_id);
CREATE INDEX IF NOT EXISTS idx_kayla_tax_prep_business ON kayla_tax_prep(business_id);
CREATE INDEX IF NOT EXISTS idx_kayla_investment_business ON kayla_investment_readiness(business_id);
CREATE INDEX IF NOT EXISTS idx_kayla_compliance_business ON kayla_compliance_reminders(business_id);
CREATE INDEX IF NOT EXISTS idx_kayla_legal_business ON kayla_legal_templates(business_id);