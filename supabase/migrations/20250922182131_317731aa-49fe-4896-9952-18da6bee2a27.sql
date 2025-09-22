-- Fix critical security issue: Secure sales agent test questions
-- Remove public access and restrict to admins only

-- Enable RLS on sales_agent_tests table
ALTER TABLE public.sales_agent_tests ENABLE ROW LEVEL SECURITY;

-- Drop the existing admin-only policy and recreate it properly
DROP POLICY IF EXISTS "Admin access to test questions with answers" ON public.sales_agent_tests;

-- Create comprehensive RLS policies for sales_agent_tests
-- Only admins can view test questions with answers
CREATE POLICY "Admins can view test questions with answers" 
ON public.sales_agent_tests 
FOR SELECT 
USING (public.is_admin());

-- Only admins can manage test questions
CREATE POLICY "Admins can manage test questions" 
ON public.sales_agent_tests 
FOR ALL 
USING (public.is_admin()) 
WITH CHECK (public.is_admin());

-- Update the public function to properly hide answers from non-admins
CREATE OR REPLACE FUNCTION public.get_test_questions_for_user()
RETURNS TABLE(
  id uuid, 
  question text, 
  option_a text, 
  option_b text, 
  option_c text, 
  option_d text, 
  created_at timestamp with time zone
) 
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  -- Return only active questions WITHOUT the correct_answer field
  -- This function bypasses RLS to allow authenticated users to take tests
  -- but ensures answers are never exposed
  SELECT 
    t.id,
    t.question,
    t.option_a,
    t.option_b,
    t.option_c,
    t.option_d,
    t.created_at
  FROM public.sales_agent_tests t
  WHERE t.is_active = true
  ORDER BY RANDOM(); -- Randomize question order
$function$;