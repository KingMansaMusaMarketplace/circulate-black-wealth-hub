-- Bank accounts table for reconciliation
CREATE TABLE IF NOT EXISTS bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  account_name TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('checking', 'savings', 'credit_card', 'other')),
  account_number_last4 TEXT,
  bank_name TEXT,
  currency TEXT DEFAULT 'USD',
  current_balance DECIMAL(15,2) DEFAULT 0,
  opening_balance DECIMAL(15,2) DEFAULT 0,
  opening_balance_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Bank transactions for reconciliation
CREATE TABLE IF NOT EXISTS bank_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_account_id UUID NOT NULL REFERENCES bank_accounts(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  transaction_date DATE NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('debit', 'credit')),
  category TEXT,
  is_reconciled BOOLEAN DEFAULT false,
  reconciled_at TIMESTAMPTZ,
  reconciled_by UUID,
  matched_expense_id UUID REFERENCES expenses(id),
  matched_invoice_id UUID REFERENCES invoices(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  budget_name TEXT NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  period_type TEXT NOT NULL CHECK (period_type IN ('monthly', 'quarterly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Fixed assets table
CREATE TABLE IF NOT EXISTS fixed_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  asset_name TEXT NOT NULL,
  asset_category TEXT NOT NULL,
  purchase_date DATE NOT NULL,
  purchase_price DECIMAL(15,2) NOT NULL,
  salvage_value DECIMAL(15,2) DEFAULT 0,
  useful_life_years INTEGER NOT NULL,
  depreciation_method TEXT NOT NULL CHECK (depreciation_method IN ('straight_line', 'declining_balance', 'sum_of_years')),
  accumulated_depreciation DECIMAL(15,2) DEFAULT 0,
  current_book_value DECIMAL(15,2),
  is_disposed BOOLEAN DEFAULT false,
  disposal_date DATE,
  disposal_value DECIMAL(15,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE fixed_assets ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Business owners can manage their bank accounts"
ON bank_accounts FOR ALL
USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

CREATE POLICY "Business owners can manage their bank transactions"
ON bank_transactions FOR ALL
USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

CREATE POLICY "Business owners can manage their budgets"
ON budgets FOR ALL
USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

CREATE POLICY "Business owners can manage their fixed assets"
ON fixed_assets FOR ALL
USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bank_transactions_date ON bank_transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_reconciled ON bank_transactions(is_reconciled, bank_account_id);
CREATE INDEX IF NOT EXISTS idx_budgets_period ON budgets(business_id, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_fixed_assets_business ON fixed_assets(business_id, is_disposed);

-- Triggers
CREATE TRIGGER update_bank_accounts_updated_at
  BEFORE UPDATE ON bank_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_financial_updated_at();

CREATE TRIGGER update_bank_transactions_updated_at
  BEFORE UPDATE ON bank_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_financial_updated_at();

CREATE TRIGGER update_budgets_updated_at
  BEFORE UPDATE ON budgets
  FOR EACH ROW
  EXECUTE FUNCTION update_financial_updated_at();

CREATE TRIGGER update_fixed_assets_updated_at
  BEFORE UPDATE ON fixed_assets
  FOR EACH ROW
  EXECUTE FUNCTION update_financial_updated_at();

-- Function to calculate depreciation
CREATE OR REPLACE FUNCTION calculate_asset_depreciation(
  p_asset_id UUID,
  p_as_of_date DATE DEFAULT CURRENT_DATE
) RETURNS DECIMAL AS $$
DECLARE
  v_asset RECORD;
  v_years_elapsed DECIMAL;
  v_annual_depreciation DECIMAL;
  v_total_depreciation DECIMAL;
BEGIN
  SELECT * INTO v_asset FROM fixed_assets WHERE id = p_asset_id;
  
  IF NOT FOUND THEN
    RETURN 0;
  END IF;
  
  -- Calculate years elapsed
  v_years_elapsed := EXTRACT(YEAR FROM AGE(p_as_of_date, v_asset.purchase_date)) + 
                     (EXTRACT(MONTH FROM AGE(p_as_of_date, v_asset.purchase_date)) / 12.0);
  
  -- Limit to useful life
  v_years_elapsed := LEAST(v_years_elapsed, v_asset.useful_life_years);
  
  IF v_asset.depreciation_method = 'straight_line' THEN
    v_annual_depreciation := (v_asset.purchase_price - v_asset.salvage_value) / v_asset.useful_life_years;
    v_total_depreciation := v_annual_depreciation * v_years_elapsed;
  ELSIF v_asset.depreciation_method = 'declining_balance' THEN
    -- 200% declining balance
    v_total_depreciation := v_asset.purchase_price * (1 - POWER(1 - (2.0 / v_asset.useful_life_years), v_years_elapsed));
  ELSE
    -- Default to straight line
    v_annual_depreciation := (v_asset.purchase_price - v_asset.salvage_value) / v_asset.useful_life_years;
    v_total_depreciation := v_annual_depreciation * v_years_elapsed;
  END IF;
  
  -- Don't depreciate below salvage value
  v_total_depreciation := LEAST(v_total_depreciation, v_asset.purchase_price - v_asset.salvage_value);
  
  RETURN v_total_depreciation;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO public;