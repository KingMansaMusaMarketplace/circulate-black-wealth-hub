-- =============================================
-- AI AGENT / AGENTIC AI SYSTEM
-- Autonomous AI that takes actions, not just chats
-- =============================================

-- Lead Scores: AI-generated qualification scores
CREATE TABLE public.lead_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES public.b2b_external_leads(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    score_factors JSONB DEFAULT '{}',
    engagement_score INTEGER DEFAULT 0,
    fit_score INTEGER DEFAULT 0,
    intent_score INTEGER DEFAULT 0,
    recommended_action TEXT,
    ai_reasoning TEXT,
    scored_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '7 days'),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT lead_or_customer CHECK (customer_id IS NOT NULL OR lead_id IS NOT NULL)
);

-- Churn Predictions: AI predicts which customers might leave
CREATE TABLE public.churn_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    churn_probability DECIMAL(5,4) NOT NULL CHECK (churn_probability >= 0 AND churn_probability <= 1),
    risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    risk_factors JSONB DEFAULT '[]',
    days_since_last_activity INTEGER,
    lifetime_value DECIMAL(12,2),
    recommended_actions JSONB DEFAULT '[]',
    ai_reasoning TEXT,
    predicted_at TIMESTAMPTZ DEFAULT now(),
    action_taken BOOLEAN DEFAULT false,
    action_taken_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Deal Scores: Predict which deals will close
CREATE TABLE public.deal_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    connection_id UUID REFERENCES public.b2b_connections(id) ON DELETE CASCADE,
    deal_name TEXT,
    deal_value DECIMAL(12,2),
    close_probability DECIMAL(5,4) NOT NULL CHECK (close_probability >= 0 AND close_probability <= 1),
    expected_close_date DATE,
    score_factors JSONB DEFAULT '{}',
    engagement_signals JSONB DEFAULT '[]',
    competitor_risk TEXT CHECK (competitor_risk IN ('none', 'low', 'medium', 'high')),
    recommended_next_steps JSONB DEFAULT '[]',
    ai_reasoning TEXT,
    scored_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- AI Agent Rules: Configurable rules for autonomous actions
CREATE TABLE public.ai_agent_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    rule_type TEXT NOT NULL CHECK (rule_type IN ('lead_qualification', 'churn_prevention', 'deal_scoring', 'ticket_resolution', 'follow_up', 'custom')),
    trigger_conditions JSONB NOT NULL DEFAULT '{}',
    action_type TEXT NOT NULL CHECK (action_type IN ('execute_workflow', 'send_notification', 'update_status', 'add_tag', 'create_task', 'auto_respond', 'escalate')),
    action_config JSONB NOT NULL DEFAULT '{}',
    requires_approval BOOLEAN DEFAULT false,
    confidence_threshold DECIMAL(3,2) DEFAULT 0.7,
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 5,
    execution_count INTEGER DEFAULT 0,
    last_executed_at TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- AI Agent Actions: Log of all autonomous actions taken
CREATE TABLE public.ai_agent_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    rule_id UUID REFERENCES public.ai_agent_rules(id) ON DELETE SET NULL,
    action_type TEXT NOT NULL,
    target_type TEXT NOT NULL CHECK (target_type IN ('customer', 'lead', 'ticket', 'deal', 'workflow')),
    target_id UUID NOT NULL,
    trigger_data JSONB DEFAULT '{}',
    action_data JSONB DEFAULT '{}',
    ai_confidence DECIMAL(3,2),
    ai_reasoning TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'executed', 'failed', 'rejected')),
    requires_approval BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMPTZ,
    executed_at TIMESTAMPTZ,
    error_message TEXT,
    outcome_data JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- AI Agent Queue: Pending actions awaiting execution
CREATE TABLE public.ai_agent_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    action_id UUID NOT NULL REFERENCES public.ai_agent_actions(id) ON DELETE CASCADE,
    priority INTEGER DEFAULT 5,
    scheduled_for TIMESTAMPTZ DEFAULT now(),
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    last_attempt_at TIMESTAMPTZ,
    next_attempt_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Ticket Auto-Resolution Templates: AI learns from resolved tickets
CREATE TABLE public.ticket_resolution_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    issue_pattern TEXT NOT NULL,
    resolution_template TEXT NOT NULL,
    success_rate DECIMAL(5,4) DEFAULT 0,
    usage_count INTEGER DEFAULT 0,
    requires_human_review BOOLEAN DEFAULT true,
    confidence_threshold DECIMAL(3,2) DEFAULT 0.8,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_lead_scores_business ON public.lead_scores(business_id);
CREATE INDEX idx_lead_scores_customer ON public.lead_scores(customer_id);
CREATE INDEX idx_lead_scores_score ON public.lead_scores(score DESC);
CREATE INDEX idx_churn_predictions_business ON public.churn_predictions(business_id);
CREATE INDEX idx_churn_predictions_risk ON public.churn_predictions(risk_level, churn_probability DESC);
CREATE INDEX idx_deal_scores_business ON public.deal_scores(business_id);
CREATE INDEX idx_deal_scores_probability ON public.deal_scores(close_probability DESC);
CREATE INDEX idx_ai_agent_rules_business ON public.ai_agent_rules(business_id, is_active);
CREATE INDEX idx_ai_agent_actions_business ON public.ai_agent_actions(business_id, created_at DESC);
CREATE INDEX idx_ai_agent_actions_status ON public.ai_agent_actions(status, requires_approval);
CREATE INDEX idx_ai_agent_queue_pending ON public.ai_agent_queue(status, scheduled_for) WHERE status = 'pending';

-- RLS Policies
ALTER TABLE public.lead_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.churn_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agent_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agent_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agent_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_resolution_templates ENABLE ROW LEVEL SECURITY;

-- Business owners can manage their AI agent data
CREATE POLICY "Business owners can manage lead scores"
ON public.lead_scores FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.businesses b
        WHERE b.id = lead_scores.business_id AND b.owner_id = auth.uid()
    )
);

CREATE POLICY "Business owners can manage churn predictions"
ON public.churn_predictions FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.businesses b
        WHERE b.id = churn_predictions.business_id AND b.owner_id = auth.uid()
    )
);

CREATE POLICY "Business owners can manage deal scores"
ON public.deal_scores FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.businesses b
        WHERE b.id = deal_scores.business_id AND b.owner_id = auth.uid()
    )
);

CREATE POLICY "Business owners can manage AI agent rules"
ON public.ai_agent_rules FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.businesses b
        WHERE b.id = ai_agent_rules.business_id AND b.owner_id = auth.uid()
    )
);

CREATE POLICY "Business owners can view AI agent actions"
ON public.ai_agent_actions FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.businesses b
        WHERE b.id = ai_agent_actions.business_id AND b.owner_id = auth.uid()
    )
);

CREATE POLICY "Business owners can manage AI agent queue"
ON public.ai_agent_queue FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.ai_agent_actions a
        JOIN public.businesses b ON b.id = a.business_id
        WHERE a.id = ai_agent_queue.action_id AND b.owner_id = auth.uid()
    )
);

CREATE POLICY "Business owners can manage resolution templates"
ON public.ticket_resolution_templates FOR ALL
USING (
    business_id IS NULL OR EXISTS (
        SELECT 1 FROM public.businesses b
        WHERE b.id = ticket_resolution_templates.business_id AND b.owner_id = auth.uid()
    )
);

-- Admin policies
CREATE POLICY "Admins can manage all lead scores"
ON public.lead_scores FOR ALL
USING (public.is_admin_secure());

CREATE POLICY "Admins can manage all churn predictions"
ON public.churn_predictions FOR ALL
USING (public.is_admin_secure());

CREATE POLICY "Admins can manage all deal scores"
ON public.deal_scores FOR ALL
USING (public.is_admin_secure());

CREATE POLICY "Admins can manage all AI agent rules"
ON public.ai_agent_rules FOR ALL
USING (public.is_admin_secure());

CREATE POLICY "Admins can manage all AI agent actions"
ON public.ai_agent_actions FOR ALL
USING (public.is_admin_secure());

CREATE POLICY "Admins can manage all AI agent queue"
ON public.ai_agent_queue FOR ALL
USING (public.is_admin_secure());

CREATE POLICY "Admins can manage all resolution templates"
ON public.ticket_resolution_templates FOR ALL
USING (public.is_admin_secure());

-- Updated at triggers
CREATE TRIGGER update_lead_scores_updated_at
    BEFORE UPDATE ON public.lead_scores
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_deal_scores_updated_at
    BEFORE UPDATE ON public.deal_scores
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_agent_rules_updated_at
    BEFORE UPDATE ON public.ai_agent_rules
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resolution_templates_updated_at
    BEFORE UPDATE ON public.ticket_resolution_templates
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();