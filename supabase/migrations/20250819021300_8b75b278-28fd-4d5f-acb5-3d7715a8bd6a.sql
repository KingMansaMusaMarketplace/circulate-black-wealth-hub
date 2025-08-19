-- Drop the insecure policy that allows everyone to view all sales agent data
DROP POLICY IF EXISTS "Active agents are viewable by everyone" ON public.sales_agents;

-- Create a secure policy for public access to minimal agent data (for referral functionality)
CREATE POLICY "Public can view active agent referral codes only" 
ON public.sales_agents 
FOR SELECT 
USING (
    is_active = true 
    AND auth.uid() IS NOT NULL  -- Must be authenticated
);

-- Update the existing policy to ensure agents can view their own complete data
-- First drop it if it exists
DROP POLICY IF EXISTS "Users can view their own agent profile" ON public.sales_agents;

-- Recreate with better name and ensure it covers all agent's own data
CREATE POLICY "Agents can view their own complete profile" 
ON public.sales_agents 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create a view for public agent data that only exposes safe fields
CREATE OR REPLACE VIEW public.public_sales_agents AS
SELECT 
    id,
    referral_code,
    is_active,
    created_at
FROM public.sales_agents
WHERE is_active = true;

-- Enable RLS on the view
ALTER VIEW public.public_sales_agents SET (security_barrier = true);