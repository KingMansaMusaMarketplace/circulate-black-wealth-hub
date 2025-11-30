-- Add admin RLS policies for transactions table
CREATE POLICY "Admins can view all transactions"
ON public.transactions
FOR SELECT
TO authenticated
USING (is_admin_secure());

-- Add admin RLS policies for email_notifications table  
CREATE POLICY "Admins can view all email notifications"
ON public.email_notifications
FOR SELECT
TO authenticated
USING (is_admin_secure());

CREATE POLICY "Admins can manage email notifications"
ON public.email_notifications
FOR ALL
TO authenticated
USING (is_admin_secure())
WITH CHECK (is_admin_secure());