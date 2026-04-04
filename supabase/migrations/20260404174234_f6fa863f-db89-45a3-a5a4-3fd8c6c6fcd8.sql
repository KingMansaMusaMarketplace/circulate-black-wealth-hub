
-- Remove legacy duplicate/overlapping policies on ticket_resolution_templates
-- Keep only the properly split policies from the security fix

-- Legacy ALL policy targeting {public} role (dangerous - should be authenticated)
DROP POLICY IF EXISTS "Admins can manage all resolution templates" ON public.ticket_resolution_templates;

-- Legacy ALL policy for business owners (replaced by split SELECT/INSERT/UPDATE/DELETE)
DROP POLICY IF EXISTS "Business owners can manage own templates" ON public.ticket_resolution_templates;

-- Duplicate admin policy
DROP POLICY IF EXISTS "Admins can manage global templates" ON public.ticket_resolution_templates;

-- Duplicate read policy
DROP POLICY IF EXISTS "Business owners can read templates" ON public.ticket_resolution_templates;
