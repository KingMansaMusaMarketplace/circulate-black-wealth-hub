-- Add tax tracking to invoices
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS tax_rate DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2);

-- Update existing invoices to set subtotal = total_amount for backwards compatibility
UPDATE invoices SET subtotal = total_amount WHERE subtotal IS NULL;

-- Create tax rates configuration table
CREATE TABLE IF NOT EXISTS business_tax_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  tax_name TEXT NOT NULL,
  tax_rate DECIMAL(5,2) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for tax rates
ALTER TABLE business_tax_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business owners can manage their tax rates"
ON business_tax_rates
FOR ALL
USING (
  business_id IN (
    SELECT id FROM businesses WHERE owner_id = auth.uid()
  )
);

-- Create recurring invoices table
CREATE TABLE IF NOT EXISTS recurring_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'monthly', 'quarterly', 'yearly')),
  next_invoice_date DATE NOT NULL,
  last_generated_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  subtotal DECIMAL(10,2) NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  line_items JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for recurring invoices
ALTER TABLE recurring_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business owners can manage recurring invoices"
ON recurring_invoices
FOR ALL
USING (
  business_id IN (
    SELECT id FROM businesses WHERE owner_id = auth.uid()
  )
);

-- Create financial audit log table
CREATE TABLE IF NOT EXISTS financial_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for audit log
ALTER TABLE financial_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business owners can view their audit logs"
ON financial_audit_log
FOR SELECT
USING (
  business_id IN (
    SELECT id FROM businesses WHERE owner_id = auth.uid()
  )
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_recurring_invoices_next_date ON recurring_invoices(next_invoice_date) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_audit_log_business_id ON financial_audit_log(business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON financial_audit_log(entity_type, entity_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_financial_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_business_tax_rates_updated_at
  BEFORE UPDATE ON business_tax_rates
  FOR EACH ROW
  EXECUTE FUNCTION update_financial_updated_at();

CREATE TRIGGER update_recurring_invoices_updated_at
  BEFORE UPDATE ON recurring_invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_financial_updated_at();