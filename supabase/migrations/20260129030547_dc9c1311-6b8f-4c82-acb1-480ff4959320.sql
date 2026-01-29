-- ============================================================
-- 1325.AI DEVELOPER PLATFORM SCHEMA
-- Protected under USPTO Provisional 63/969,202
-- ============================================================

-- Create enum for developer tiers
CREATE TYPE public.developer_tier AS ENUM ('free', 'pro', 'enterprise');

-- Create enum for developer account status
CREATE TYPE public.developer_status AS ENUM ('pending', 'active', 'suspended');

-- Create enum for API key environment
CREATE TYPE public.api_key_environment AS ENUM ('test', 'live');

-- ============================================================
-- DEVELOPER ACCOUNTS TABLE
-- ============================================================
CREATE TABLE public.developer_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    company_website TEXT,
    company_description TEXT,
    tier developer_tier NOT NULL DEFAULT 'free',
    status developer_status NOT NULL DEFAULT 'pending',
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    monthly_cmal_limit INTEGER NOT NULL DEFAULT 1000,
    monthly_voice_limit INTEGER NOT NULL DEFAULT 100,
    monthly_susu_limit INTEGER NOT NULL DEFAULT 50,
    monthly_fraud_limit INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.developer_accounts ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- API KEYS TABLE
-- Keys are hashed with SHA-256, only prefix stored for display
-- ============================================================
CREATE TABLE public.api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id UUID NOT NULL REFERENCES public.developer_accounts(id) ON DELETE CASCADE,
    key_hash TEXT NOT NULL,
    key_prefix TEXT NOT NULL,
    name TEXT NOT NULL DEFAULT 'Default Key',
    environment api_key_environment NOT NULL DEFAULT 'test',
    rate_limit_per_minute INTEGER NOT NULL DEFAULT 60,
    scopes TEXT[] DEFAULT ARRAY['cmal', 'voice', 'susu', 'fraud', 'loyalty'],
    last_used_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(key_hash)
);

-- Enable RLS
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Index for fast key lookup
CREATE INDEX idx_api_keys_key_hash ON public.api_keys(key_hash) WHERE revoked_at IS NULL;
CREATE INDEX idx_api_keys_developer_id ON public.api_keys(developer_id);

-- ============================================================
-- API USAGE LOGS TABLE
-- Partitioned by month for query performance
-- ============================================================
CREATE TABLE public.api_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_key_id UUID NOT NULL REFERENCES public.api_keys(id) ON DELETE CASCADE,
    developer_id UUID NOT NULL REFERENCES public.developer_accounts(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL DEFAULT 'POST',
    request_timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    response_status INTEGER NOT NULL,
    latency_ms INTEGER,
    billed_units INTEGER NOT NULL DEFAULT 1,
    request_metadata JSONB,
    ip_address INET,
    user_agent TEXT
);

-- Enable RLS
ALTER TABLE public.api_usage_logs ENABLE ROW LEVEL SECURITY;

-- Indexes for analytics and billing
CREATE INDEX idx_api_usage_logs_developer_id ON public.api_usage_logs(developer_id, request_timestamp DESC);
CREATE INDEX idx_api_usage_logs_api_key_id ON public.api_usage_logs(api_key_id, request_timestamp DESC);
CREATE INDEX idx_api_usage_logs_endpoint ON public.api_usage_logs(endpoint, request_timestamp DESC);
CREATE INDEX idx_api_usage_logs_timestamp ON public.api_usage_logs(request_timestamp DESC);

-- ============================================================
-- API RATE LIMITS TABLE
-- Sliding window rate limiting state
-- ============================================================
CREATE TABLE public.api_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_key_id UUID NOT NULL REFERENCES public.api_keys(id) ON DELETE CASCADE,
    window_start TIMESTAMPTZ NOT NULL,
    request_count INTEGER NOT NULL DEFAULT 1,
    UNIQUE(api_key_id, window_start)
);

-- Enable RLS
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;

-- Index for fast rate limit lookups
CREATE INDEX idx_api_rate_limits_lookup ON public.api_rate_limits(api_key_id, window_start DESC);

-- ============================================================
-- SECURITY DEFINER FUNCTIONS
-- ============================================================

-- Function to validate API key and return developer info
CREATE OR REPLACE FUNCTION public.validate_api_key(p_key_hash TEXT)
RETURNS TABLE (
    developer_id UUID,
    api_key_id UUID,
    tier developer_tier,
    status developer_status,
    rate_limit_per_minute INTEGER,
    scopes TEXT[],
    monthly_cmal_limit INTEGER,
    monthly_voice_limit INTEGER,
    monthly_susu_limit INTEGER,
    monthly_fraud_limit INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        da.id AS developer_id,
        ak.id AS api_key_id,
        da.tier,
        da.status,
        ak.rate_limit_per_minute,
        ak.scopes,
        da.monthly_cmal_limit,
        da.monthly_voice_limit,
        da.monthly_susu_limit,
        da.monthly_fraud_limit
    FROM public.api_keys ak
    JOIN public.developer_accounts da ON da.id = ak.developer_id
    WHERE ak.key_hash = p_key_hash
      AND ak.revoked_at IS NULL
      AND da.status = 'active';
    
    -- Update last_used_at
    UPDATE public.api_keys
    SET last_used_at = now()
    WHERE key_hash = p_key_hash;
END;
$$;

-- Function to check rate limit (sliding window)
CREATE OR REPLACE FUNCTION public.check_api_rate_limit(
    p_api_key_id UUID,
    p_limit_per_minute INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_window_start TIMESTAMPTZ;
    v_current_count INTEGER;
BEGIN
    -- Round to current minute
    v_window_start := date_trunc('minute', now());
    
    -- Try to increment or insert
    INSERT INTO public.api_rate_limits (api_key_id, window_start, request_count)
    VALUES (p_api_key_id, v_window_start, 1)
    ON CONFLICT (api_key_id, window_start)
    DO UPDATE SET request_count = api_rate_limits.request_count + 1
    RETURNING request_count INTO v_current_count;
    
    -- Check if over limit
    RETURN v_current_count <= p_limit_per_minute;
END;
$$;

-- Function to log API usage
CREATE OR REPLACE FUNCTION public.log_api_usage(
    p_api_key_id UUID,
    p_developer_id UUID,
    p_endpoint TEXT,
    p_method TEXT,
    p_response_status INTEGER,
    p_latency_ms INTEGER,
    p_billed_units INTEGER DEFAULT 1,
    p_request_metadata JSONB DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO public.api_usage_logs (
        api_key_id, developer_id, endpoint, method, 
        response_status, latency_ms, billed_units,
        request_metadata, ip_address, user_agent
    ) VALUES (
        p_api_key_id, p_developer_id, p_endpoint, p_method,
        p_response_status, p_latency_ms, p_billed_units,
        p_request_metadata, p_ip_address, p_user_agent
    )
    RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$;

-- Function to get monthly usage for a developer
CREATE OR REPLACE FUNCTION public.get_developer_monthly_usage(p_developer_id UUID)
RETURNS TABLE (
    endpoint TEXT,
    total_calls BIGINT,
    total_billed_units BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        aul.endpoint,
        COUNT(*)::BIGINT AS total_calls,
        SUM(aul.billed_units)::BIGINT AS total_billed_units
    FROM public.api_usage_logs aul
    WHERE aul.developer_id = p_developer_id
      AND aul.request_timestamp >= date_trunc('month', now())
      AND aul.response_status BETWEEN 200 AND 299
    GROUP BY aul.endpoint;
END;
$$;

-- Function to generate API key (returns the raw key, caller must hash before storing)
CREATE OR REPLACE FUNCTION public.generate_api_key_prefix(p_environment api_key_environment)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN CASE 
        WHEN p_environment = 'live' THEN '1325_live_'
        ELSE '1325_test_'
    END || substr(encode(gen_random_bytes(16), 'hex'), 1, 24);
END;
$$;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Developer accounts: users can only see/manage their own
CREATE POLICY "Users can view their own developer account"
ON public.developer_accounts FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own developer account"
ON public.developer_accounts FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own developer account"
ON public.developer_accounts FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- API keys: developers can only see/manage their own keys
CREATE POLICY "Developers can view their own API keys"
ON public.api_keys FOR SELECT
TO authenticated
USING (
    developer_id IN (
        SELECT id FROM public.developer_accounts WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Developers can create their own API keys"
ON public.api_keys FOR INSERT
TO authenticated
WITH CHECK (
    developer_id IN (
        SELECT id FROM public.developer_accounts WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Developers can update their own API keys"
ON public.api_keys FOR UPDATE
TO authenticated
USING (
    developer_id IN (
        SELECT id FROM public.developer_accounts WHERE user_id = auth.uid()
    )
);

-- Usage logs: developers can only view their own logs
CREATE POLICY "Developers can view their own usage logs"
ON public.api_usage_logs FOR SELECT
TO authenticated
USING (
    developer_id IN (
        SELECT id FROM public.developer_accounts WHERE user_id = auth.uid()
    )
);

-- Rate limits: no direct access, only via security definer functions
CREATE POLICY "No direct access to rate limits"
ON public.api_rate_limits FOR ALL
TO authenticated
USING (false);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-update updated_at on developer_accounts
CREATE TRIGGER update_developer_accounts_updated_at
BEFORE UPDATE ON public.developer_accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Clean up old rate limit windows (older than 1 hour)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM public.api_rate_limits
    WHERE window_start < now() - interval '1 hour';
END;
$$;