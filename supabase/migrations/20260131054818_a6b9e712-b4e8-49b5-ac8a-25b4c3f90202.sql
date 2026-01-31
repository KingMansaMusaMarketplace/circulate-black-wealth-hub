-- =============================================
-- CRM TABLES (customers, customer_tags, customer_interactions)
-- =============================================

-- Customers table for CRM
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  job_title TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT,
  customer_status TEXT NOT NULL DEFAULT 'lead' CHECK (customer_status IN ('lead', 'active', 'inactive', 'vip')),
  lifecycle_stage TEXT NOT NULL DEFAULT 'lead' CHECK (lifecycle_stage IN ('lead', 'prospect', 'customer', 'evangelist', 'churned')),
  source TEXT,
  lifetime_value DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_purchases INTEGER NOT NULL DEFAULT 0,
  last_purchase_date TIMESTAMP WITH TIME ZONE,
  last_contact_date TIMESTAMP WITH TIME ZONE,
  next_followup_date TIMESTAMP WITH TIME ZONE,
  birthday DATE,
  anniversary DATE,
  notes TEXT,
  custom_fields JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Customer tags
CREATE TABLE public.customer_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Customer interactions
CREATE TABLE public.customer_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('call', 'email', 'meeting', 'note', 'purchase', 'support', 'other')),
  subject TEXT NOT NULL,
  description TEXT,
  interaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  duration_minutes INTEGER,
  outcome TEXT,
  followup_required BOOLEAN NOT NULL DEFAULT false,
  followup_date TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- WORKFLOW AUTOMATION TABLES
-- =============================================

-- Create enum for trigger types
CREATE TYPE workflow_trigger_type AS ENUM (
  'purchase',
  'customer_created',
  'customer_updated',
  'tag_added',
  'tag_removed',
  'inactivity',
  'threshold_reached',
  'custom'
);

-- Create enum for action types
CREATE TYPE workflow_action_type AS ENUM (
  'send_email',
  'add_tag',
  'remove_tag',
  'update_status',
  'notify_user',
  'create_task',
  'update_customer_field',
  'webhook'
);

-- Create enum for execution status
CREATE TYPE workflow_execution_status AS ENUM (
  'pending',
  'running',
  'completed',
  'failed',
  'skipped'
);

-- Workflows table
CREATE TABLE public.workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  trigger_type workflow_trigger_type NOT NULL,
  trigger_config JSONB NOT NULL DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Workflow actions table
CREATE TABLE public.workflow_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  action_type workflow_action_type NOT NULL,
  action_config JSONB NOT NULL DEFAULT '{}',
  execution_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Workflow executions table
CREATE TABLE public.workflow_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  trigger_data JSONB DEFAULT '{}',
  status workflow_execution_status NOT NULL DEFAULT 'pending',
  error_message TEXT,
  executed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- HELPDESK ENHANCEMENT TABLES
-- =============================================

-- Knowledge base articles
CREATE TABLE public.knowledge_base_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  is_published BOOLEAN NOT NULL DEFAULT false,
  view_count INTEGER NOT NULL DEFAULT 0,
  helpful_count INTEGER NOT NULL DEFAULT 0,
  not_helpful_count INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- SLA policies
CREATE TABLE public.sla_policies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  priority TEXT NOT NULL,
  first_response_hours INTEGER NOT NULL DEFAULT 24,
  resolution_hours INTEGER NOT NULL DEFAULT 72,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(business_id, priority)
);

-- Canned responses
CREATE TABLE public.canned_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  shortcut TEXT,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- ENABLE RLS
-- =============================================

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sla_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canned_responses ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES - CUSTOMERS (using owner_id)
-- =============================================

CREATE POLICY "Business owners can view their customers"
ON public.customers FOR SELECT
USING (
  business_id IN (
    SELECT id FROM public.businesses WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Business owners can create customers"
ON public.customers FOR INSERT
WITH CHECK (
  business_id IN (
    SELECT id FROM public.businesses WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Business owners can update their customers"
ON public.customers FOR UPDATE
USING (
  business_id IN (
    SELECT id FROM public.businesses WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Business owners can delete their customers"
ON public.customers FOR DELETE
USING (
  business_id IN (
    SELECT id FROM public.businesses WHERE owner_id = auth.uid()
  )
);

-- Customer tags
CREATE POLICY "Users can manage tags for their customers"
ON public.customer_tags FOR ALL
USING (
  customer_id IN (
    SELECT id FROM public.customers WHERE business_id IN (
      SELECT id FROM public.businesses WHERE owner_id = auth.uid()
    )
  )
);

-- Customer interactions
CREATE POLICY "Users can manage interactions for their customers"
ON public.customer_interactions FOR ALL
USING (
  business_id IN (
    SELECT id FROM public.businesses WHERE owner_id = auth.uid()
  )
);

-- =============================================
-- RLS POLICIES - WORKFLOWS
-- =============================================

CREATE POLICY "Business owners can view their workflows"
ON public.workflows FOR SELECT
USING (
  business_id IN (
    SELECT id FROM public.businesses WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Business owners can create workflows"
ON public.workflows FOR INSERT
WITH CHECK (
  business_id IN (
    SELECT id FROM public.businesses WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Business owners can update their workflows"
ON public.workflows FOR UPDATE
USING (
  business_id IN (
    SELECT id FROM public.businesses WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Business owners can delete their workflows"
ON public.workflows FOR DELETE
USING (
  business_id IN (
    SELECT id FROM public.businesses WHERE owner_id = auth.uid()
  )
);

-- Workflow actions
CREATE POLICY "Users can manage workflow actions for their workflows"
ON public.workflow_actions FOR ALL
USING (
  workflow_id IN (
    SELECT id FROM public.workflows WHERE business_id IN (
      SELECT id FROM public.businesses WHERE owner_id = auth.uid()
    )
  )
);

-- Workflow executions
CREATE POLICY "Users can view executions for their workflows"
ON public.workflow_executions FOR SELECT
USING (
  workflow_id IN (
    SELECT id FROM public.workflows WHERE business_id IN (
      SELECT id FROM public.businesses WHERE owner_id = auth.uid()
    )
  )
);

-- =============================================
-- RLS POLICIES - KNOWLEDGE BASE
-- =============================================

CREATE POLICY "Anyone can view published knowledge base articles"
ON public.knowledge_base_articles FOR SELECT
USING (
  is_published = true OR
  business_id IS NULL OR
  business_id IN (
    SELECT id FROM public.businesses WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Business owners can manage their knowledge base articles"
ON public.knowledge_base_articles FOR INSERT
WITH CHECK (
  business_id IN (
    SELECT id FROM public.businesses WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Business owners can update their knowledge base articles"
ON public.knowledge_base_articles FOR UPDATE
USING (
  business_id IN (
    SELECT id FROM public.businesses WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Business owners can delete their knowledge base articles"
ON public.knowledge_base_articles FOR DELETE
USING (
  business_id IN (
    SELECT id FROM public.businesses WHERE owner_id = auth.uid()
  )
);

-- =============================================
-- RLS POLICIES - SLA POLICIES
-- =============================================

CREATE POLICY "Business owners can view their SLA policies"
ON public.sla_policies FOR SELECT
USING (
  business_id IS NULL OR
  business_id IN (
    SELECT id FROM public.businesses WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Business owners can manage their SLA policies"
ON public.sla_policies FOR INSERT
WITH CHECK (
  business_id IN (
    SELECT id FROM public.businesses WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Business owners can update their SLA policies"
ON public.sla_policies FOR UPDATE
USING (
  business_id IN (
    SELECT id FROM public.businesses WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Business owners can delete their SLA policies"
ON public.sla_policies FOR DELETE
USING (
  business_id IN (
    SELECT id FROM public.businesses WHERE owner_id = auth.uid()
  )
);

-- =============================================
-- RLS POLICIES - CANNED RESPONSES
-- =============================================

CREATE POLICY "Business owners can view their canned responses"
ON public.canned_responses FOR SELECT
USING (
  business_id IS NULL OR
  business_id IN (
    SELECT id FROM public.businesses WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Business owners can manage their canned responses"
ON public.canned_responses FOR INSERT
WITH CHECK (
  business_id IN (
    SELECT id FROM public.businesses WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Business owners can update their canned responses"
ON public.canned_responses FOR UPDATE
USING (
  business_id IN (
    SELECT id FROM public.businesses WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Business owners can delete their canned responses"
ON public.canned_responses FOR DELETE
USING (
  business_id IN (
    SELECT id FROM public.businesses WHERE owner_id = auth.uid()
  )
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_customers_business_id ON public.customers(business_id);
CREATE INDEX idx_customers_status ON public.customers(customer_status);
CREATE INDEX idx_customers_lifecycle_stage ON public.customers(lifecycle_stage);
CREATE INDEX idx_customers_email ON public.customers(email);
CREATE INDEX idx_customer_tags_customer_id ON public.customer_tags(customer_id);
CREATE INDEX idx_customer_interactions_customer_id ON public.customer_interactions(customer_id);
CREATE INDEX idx_customer_interactions_business_id ON public.customer_interactions(business_id);
CREATE INDEX idx_workflows_business_id ON public.workflows(business_id);
CREATE INDEX idx_workflows_is_active ON public.workflows(is_active);
CREATE INDEX idx_workflows_trigger_type ON public.workflows(trigger_type);
CREATE INDEX idx_workflow_actions_workflow_id ON public.workflow_actions(workflow_id);
CREATE INDEX idx_workflow_executions_workflow_id ON public.workflow_executions(workflow_id);
CREATE INDEX idx_workflow_executions_status ON public.workflow_executions(status);
CREATE INDEX idx_knowledge_base_articles_business_id ON public.knowledge_base_articles(business_id);
CREATE INDEX idx_knowledge_base_articles_category ON public.knowledge_base_articles(category);
CREATE INDEX idx_knowledge_base_articles_is_published ON public.knowledge_base_articles(is_published);
CREATE INDEX idx_sla_policies_business_id ON public.sla_policies(business_id);
CREATE INDEX idx_canned_responses_business_id ON public.canned_responses(business_id);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_interactions_updated_at
BEFORE UPDATE ON public.customer_interactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at
BEFORE UPDATE ON public.workflows
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_knowledge_base_articles_updated_at
BEFORE UPDATE ON public.knowledge_base_articles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sla_policies_updated_at
BEFORE UPDATE ON public.sla_policies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_canned_responses_updated_at
BEFORE UPDATE ON public.canned_responses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();