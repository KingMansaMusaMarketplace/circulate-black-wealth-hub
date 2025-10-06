-- Create invoices table for automated invoice generation
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  tax_amount NUMERIC(10,2) DEFAULT 0,
  total_amount NUMERIC(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  paid_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  line_items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create expenses table for P&L tracking
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  expense_date DATE NOT NULL,
  receipt_url TEXT,
  is_recurring BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create business_insights table for AI coaching
CREATE TABLE IF NOT EXISTS public.business_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  insight_type VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  recommendations JSONB DEFAULT '[]'::jsonb,
  metrics JSONB DEFAULT '{}'::jsonb,
  priority VARCHAR(20) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies for invoices
CREATE POLICY "Business owners can view their invoices"
  ON public.invoices FOR SELECT
  USING (
    auth.uid() IN (
      SELECT owner_id FROM businesses WHERE id = invoices.business_id
    )
  );

CREATE POLICY "Business owners can manage their invoices"
  ON public.invoices FOR ALL
  USING (
    auth.uid() IN (
      SELECT owner_id FROM businesses WHERE id = invoices.business_id
    )
  );

-- RLS Policies for expenses
CREATE POLICY "Business owners can view their expenses"
  ON public.expenses FOR SELECT
  USING (
    auth.uid() IN (
      SELECT owner_id FROM businesses WHERE id = expenses.business_id
    )
  );

CREATE POLICY "Business owners can manage their expenses"
  ON public.expenses FOR ALL
  USING (
    auth.uid() IN (
      SELECT owner_id FROM businesses WHERE id = expenses.business_id
    )
  );

-- RLS Policies for business_insights
CREATE POLICY "Business owners can view their insights"
  ON public.business_insights FOR SELECT
  USING (
    auth.uid() IN (
      SELECT owner_id FROM businesses WHERE id = business_insights.business_id
    )
  );

-- Indexes for performance
CREATE INDEX idx_invoices_business_id ON public.invoices(business_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoices_due_date ON public.invoices(due_date);
CREATE INDEX idx_expenses_business_id ON public.expenses(business_id);
CREATE INDEX idx_expenses_date ON public.expenses(expense_date);
CREATE INDEX idx_business_insights_business_id ON public.business_insights(business_id);

-- Function to auto-generate invoice numbers
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  next_number INTEGER;
  invoice_num TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 5) AS INTEGER)), 0) + 1
  INTO next_number
  FROM invoices
  WHERE invoice_number LIKE 'INV-%';
  
  invoice_num := 'INV-' || LPAD(next_number::TEXT, 6, '0');
  RETURN invoice_num;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();