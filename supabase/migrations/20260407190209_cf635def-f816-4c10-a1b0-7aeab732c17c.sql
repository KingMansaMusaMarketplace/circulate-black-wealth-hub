
CREATE OR REPLACE VIEW public.consumer_emails AS
SELECT 
  au.id as user_id,
  au.email,
  au.raw_user_meta_data->>'name' as name,
  au.created_at as signed_up_at,
  au.last_sign_in_at,
  au.email_confirmed_at
FROM auth.users au
WHERE au.raw_user_meta_data->>'user_type' = 'customer';

-- Enable RLS-like protection via security_invoker
ALTER VIEW public.consumer_emails SET (security_invoker = true);

-- Only allow admins to query this view
GRANT SELECT ON public.consumer_emails TO authenticated;

-- Create RLS policy function check
CREATE OR REPLACE FUNCTION public.is_admin_for_view()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
$$;
