-- Add agent recruitment tracking and commission structure

-- Add recruited_by field to sales_agents table
ALTER TABLE sales_agents
ADD COLUMN recruited_by_agent_id uuid REFERENCES sales_agents(id),
ADD COLUMN recruitment_date timestamp with time zone,
ADD COLUMN team_override_end_date timestamp with time zone;

-- Create agent_recruitment_bonuses table for one-time bonuses
CREATE TABLE agent_recruitment_bonuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_agent_id uuid NOT NULL REFERENCES sales_agents(id),
  recruited_agent_id uuid NOT NULL REFERENCES sales_agents(id),
  bonus_amount numeric NOT NULL DEFAULT 75.00,
  status text NOT NULL DEFAULT 'pending', -- pending, paid, cancelled
  earned_date timestamp with time zone NOT NULL DEFAULT now(),
  paid_date timestamp with time zone,
  payment_reference text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create agent_team_overrides table for ongoing commission tracking
CREATE TABLE agent_team_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_agent_id uuid NOT NULL REFERENCES sales_agents(id),
  recruited_agent_id uuid NOT NULL REFERENCES sales_agents(id),
  referral_id uuid NOT NULL REFERENCES referrals(id),
  base_commission_amount numeric NOT NULL,
  override_percentage numeric NOT NULL DEFAULT 7.5, -- 7.5% default
  override_amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  earned_date timestamp with time zone NOT NULL DEFAULT now(),
  paid_date timestamp with time zone,
  payment_reference text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE agent_recruitment_bonuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_team_overrides ENABLE ROW LEVEL SECURITY;

-- RLS Policies for agent_recruitment_bonuses
CREATE POLICY "Recruiters can view their recruitment bonuses"
ON agent_recruitment_bonuses
FOR SELECT
USING (recruiter_agent_id IN (
  SELECT id FROM sales_agents WHERE user_id = auth.uid()
));

CREATE POLICY "Admins can manage recruitment bonuses"
ON agent_recruitment_bonuses
FOR ALL
USING (is_admin_secure());

-- RLS Policies for agent_team_overrides
CREATE POLICY "Recruiters can view their team overrides"
ON agent_team_overrides
FOR SELECT
USING (recruiter_agent_id IN (
  SELECT id FROM sales_agents WHERE user_id = auth.uid()
));

CREATE POLICY "Admins can manage team overrides"
ON agent_team_overrides
FOR ALL
USING (is_admin_secure());

-- Create indexes for performance
CREATE INDEX idx_sales_agents_recruited_by ON sales_agents(recruited_by_agent_id);
CREATE INDEX idx_recruitment_bonuses_recruiter ON agent_recruitment_bonuses(recruiter_agent_id);
CREATE INDEX idx_recruitment_bonuses_status ON agent_recruitment_bonuses(status);
CREATE INDEX idx_team_overrides_recruiter ON agent_team_overrides(recruiter_agent_id);
CREATE INDEX idx_team_overrides_status ON agent_team_overrides(status);

-- Create function to calculate team override end date (6 months from recruitment)
CREATE OR REPLACE FUNCTION calculate_override_end_date(recruitment_date timestamp with time zone)
RETURNS timestamp with time zone
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN recruitment_date + interval '6 months';
END;
$$;

-- Create trigger to set team_override_end_date when recruited_by is set
CREATE OR REPLACE FUNCTION set_team_override_end_date()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.recruited_by_agent_id IS NOT NULL AND NEW.recruitment_date IS NOT NULL THEN
    NEW.team_override_end_date := calculate_override_end_date(NEW.recruitment_date);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_team_override_end_date
BEFORE INSERT OR UPDATE ON sales_agents
FOR EACH ROW
EXECUTE FUNCTION set_team_override_end_date();

-- Add comments for documentation
COMMENT ON COLUMN sales_agents.recruited_by_agent_id IS 'ID of the agent who recruited this agent';
COMMENT ON COLUMN sales_agents.recruitment_date IS 'Date when this agent was recruited';
COMMENT ON COLUMN sales_agents.team_override_end_date IS 'Date when team override commissions end (6 months from recruitment)';
COMMENT ON TABLE agent_recruitment_bonuses IS 'One-time bonuses paid to agents for recruiting new agents';
COMMENT ON TABLE agent_team_overrides IS 'Ongoing commission overrides earned on recruited agents sales (7.5% for 6 months)';