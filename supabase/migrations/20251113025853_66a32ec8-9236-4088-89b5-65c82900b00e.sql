-- Create fraud_alerts table to store detected suspicious activities
CREATE TABLE IF NOT EXISTS public.fraud_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL CHECK (alert_type IN ('qr_scan_abuse', 'transaction_anomaly', 'review_manipulation', 'account_suspicious', 'location_mismatch', 'velocity_abuse')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  related_entity_id UUID, -- Can be transaction_id, qr_scan_id, etc
  related_entity_type TEXT, -- 'transaction', 'qr_scan', 'review', etc
  description TEXT NOT NULL,
  evidence JSON NOT NULL, -- Stores detailed pattern analysis
  ai_confidence_score DECIMAL(3,2) CHECK (ai_confidence_score >= 0 AND ai_confidence_score <= 1),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'confirmed', 'false_positive', 'resolved')),
  investigated_by UUID,
  investigated_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_fraud_alerts_user_id ON fraud_alerts(user_id);
CREATE INDEX idx_fraud_alerts_business_id ON fraud_alerts(business_id);
CREATE INDEX idx_fraud_alerts_status ON fraud_alerts(status);
CREATE INDEX idx_fraud_alerts_severity ON fraud_alerts(severity);
CREATE INDEX idx_fraud_alerts_created_at ON fraud_alerts(created_at DESC);

-- Enable RLS
ALTER TABLE fraud_alerts ENABLE ROW LEVEL SECURITY;

-- Admins can see all fraud alerts
CREATE POLICY "Admins can view all fraud alerts"
ON fraud_alerts FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Admins can update fraud alerts
CREATE POLICY "Admins can update fraud alerts"
ON fraud_alerts FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Business owners can see alerts related to their business
CREATE POLICY "Business owners can view their business fraud alerts"
ON fraud_alerts FOR SELECT
TO authenticated
USING (
  business_id IN (
    SELECT id FROM businesses WHERE owner_id = auth.uid()
  )
);

-- Create fraud_detection_logs table for tracking all analyses
CREATE TABLE IF NOT EXISTS public.fraud_detection_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_type TEXT NOT NULL,
  user_id UUID,
  business_id UUID,
  patterns_analyzed JSON NOT NULL,
  alerts_generated INTEGER DEFAULT 0,
  analysis_duration_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_fraud_logs_created_at ON fraud_detection_logs(created_at DESC);

-- Enable RLS for fraud_detection_logs
ALTER TABLE fraud_detection_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view logs
CREATE POLICY "Admins can view fraud detection logs"
ON fraud_detection_logs FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Create updated_at trigger for fraud_alerts
CREATE OR REPLACE FUNCTION update_fraud_alerts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER fraud_alerts_updated_at
BEFORE UPDATE ON fraud_alerts
FOR EACH ROW
EXECUTE FUNCTION update_fraud_alerts_updated_at();

-- Insert function for AI detection service
CREATE OR REPLACE FUNCTION insert_fraud_alerts_batch(alerts JSON[])
RETURNS INTEGER AS $$
DECLARE
  inserted_count INTEGER := 0;
  alert JSON;
BEGIN
  FOREACH alert IN ARRAY alerts
  LOOP
    INSERT INTO fraud_alerts (
      alert_type,
      severity,
      user_id,
      business_id,
      related_entity_id,
      related_entity_type,
      description,
      evidence,
      ai_confidence_score
    ) VALUES (
      (alert->>'alert_type')::TEXT,
      (alert->>'severity')::TEXT,
      (alert->>'user_id')::UUID,
      (alert->>'business_id')::UUID,
      (alert->>'related_entity_id')::UUID,
      (alert->>'related_entity_type')::TEXT,
      (alert->>'description')::TEXT,
      (alert->'evidence')::JSON,
      (alert->>'ai_confidence_score')::DECIMAL
    );
    inserted_count := inserted_count + 1;
  END LOOP;
  
  RETURN inserted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;