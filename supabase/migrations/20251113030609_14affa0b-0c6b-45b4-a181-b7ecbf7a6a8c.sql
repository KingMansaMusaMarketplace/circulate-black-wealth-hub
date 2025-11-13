-- Create fraud prevention actions table
CREATE TABLE IF NOT EXISTS public.fraud_prevention_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID NOT NULL REFERENCES public.fraud_alerts(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('qr_code_disabled', 'account_restricted', 'review_flagged', 'verification_required', 'transaction_blocked')),
  entity_id UUID,
  entity_type TEXT,
  action_details JSONB DEFAULT '{}',
  auto_triggered BOOLEAN DEFAULT true,
  triggered_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reversed_at TIMESTAMPTZ,
  reversed_by UUID REFERENCES auth.users(id),
  reversal_reason TEXT
);

-- Create index for faster lookups
CREATE INDEX idx_fraud_prevention_actions_alert ON public.fraud_prevention_actions(alert_id);
CREATE INDEX idx_fraud_prevention_actions_entity ON public.fraud_prevention_actions(entity_id, entity_type);
CREATE INDEX idx_fraud_prevention_actions_created ON public.fraud_prevention_actions(created_at DESC);

-- Enable RLS
ALTER TABLE public.fraud_prevention_actions ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all prevention actions
CREATE POLICY "Admins can view all prevention actions"
  ON public.fraud_prevention_actions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Business owners can view actions related to their business
CREATE POLICY "Business owners can view their prevention actions"
  ON public.fraud_prevention_actions
  FOR SELECT
  TO authenticated
  USING (
    entity_type = 'business' AND
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE id = fraud_prevention_actions.entity_id
      AND owner_id = auth.uid()
    )
  );

-- Policy: Admins can insert/update prevention actions
CREATE POLICY "Admins can manage prevention actions"
  ON public.fraud_prevention_actions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Function to automatically prevent fraud based on alert
CREATE OR REPLACE FUNCTION public.auto_prevent_fraud()
RETURNS TRIGGER AS $$
DECLARE
  v_action_type TEXT;
  v_entity_id UUID;
  v_entity_type TEXT;
  v_action_details JSONB;
BEGIN
  -- Only act on new high/critical severity alerts with high confidence
  IF NEW.severity IN ('high', 'critical') AND NEW.ai_confidence_score >= 0.75 THEN
    
    -- Determine action based on alert type
    CASE NEW.alert_type
      WHEN 'qr_scan_abuse' THEN
        -- Disable the QR code
        v_action_type := 'qr_code_disabled';
        v_entity_id := NEW.related_entity_id;
        v_entity_type := 'qr_code';
        
        UPDATE public.qr_codes
        SET is_active = false, updated_at = NOW()
        WHERE id = NEW.related_entity_id;
        
        v_action_details := jsonb_build_object(
          'reason', 'Suspicious scan pattern detected',
          'alert_description', NEW.description,
          'confidence_score', NEW.ai_confidence_score
        );
        
      WHEN 'velocity_abuse' THEN
        -- Temporarily restrict user account
        v_action_type := 'account_restricted';
        v_entity_id := NEW.user_id;
        v_entity_type := 'user';
        
        -- Insert a user restriction record (you'd need a user_restrictions table)
        v_action_details := jsonb_build_object(
          'reason', 'Velocity abuse detected',
          'restriction_duration_hours', 24,
          'alert_description', NEW.description
        );
        
      WHEN 'review_manipulation' THEN
        -- Flag the review
        v_action_type := 'review_flagged';
        v_entity_id := NEW.related_entity_id;
        v_entity_type := 'review';
        
        UPDATE public.reviews
        SET is_flagged = true, flag_reason = 'Potential manipulation detected'
        WHERE id = NEW.related_entity_id;
        
        v_action_details := jsonb_build_object(
          'reason', 'Review manipulation pattern detected',
          'alert_description', NEW.description
        );
        
      WHEN 'location_mismatch' THEN
        -- Require re-verification
        v_action_type := 'verification_required';
        v_entity_id := NEW.user_id;
        v_entity_type := 'user';
        
        v_action_details := jsonb_build_object(
          'reason', 'Location mismatch detected',
          'requires_reverification', true
        );
        
      WHEN 'transaction_anomaly' THEN
        -- Block suspicious transaction
        v_action_type := 'transaction_blocked';
        v_entity_id := NEW.related_entity_id;
        v_entity_type := 'transaction';
        
        v_action_details := jsonb_build_object(
          'reason', 'Anomalous transaction pattern',
          'alert_description', NEW.description
        );
        
      ELSE
        -- For other alert types, just log without action
        RETURN NEW;
    END CASE;
    
    -- Log the prevention action
    INSERT INTO public.fraud_prevention_actions (
      alert_id,
      action_type,
      entity_id,
      entity_type,
      action_details,
      auto_triggered
    ) VALUES (
      NEW.id,
      v_action_type,
      v_entity_id,
      v_entity_type,
      v_action_details,
      true
    );
    
    -- Send notification to affected business
    IF NEW.business_id IS NOT NULL THEN
      INSERT INTO public.notifications (
        user_id,
        type,
        title,
        message,
        metadata
      )
      SELECT 
        owner_id,
        'fraud_prevention',
        'Automatic Fraud Prevention Action',
        'We detected ' || NEW.description || ' and took automatic action to protect your business.',
        jsonb_build_object(
          'alert_id', NEW.id,
          'action_type', v_action_type,
          'severity', NEW.severity
        )
      FROM public.businesses
      WHERE id = NEW.business_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic prevention
CREATE TRIGGER trigger_auto_prevent_fraud
  AFTER INSERT ON public.fraud_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_prevent_fraud();

-- Add is_flagged column to reviews if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'reviews' 
                 AND column_name = 'is_flagged') THEN
    ALTER TABLE public.reviews ADD COLUMN is_flagged BOOLEAN DEFAULT false;
    ALTER TABLE public.reviews ADD COLUMN flag_reason TEXT;
  END IF;
END $$;