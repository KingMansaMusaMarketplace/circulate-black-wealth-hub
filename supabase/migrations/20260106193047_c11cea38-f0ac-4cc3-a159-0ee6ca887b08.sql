-- COMPREHENSIVE FIX: Remove overly permissive policies
-- Service role bypasses RLS, so these "System" policies are unnecessary

-- 1. auth_attempt_log
DROP POLICY IF EXISTS "System can insert auth attempt logs" ON public.auth_attempt_log;

-- 2. coalition_transactions
DROP POLICY IF EXISTS "System can insert coalition transactions" ON public.coalition_transactions;

-- 3. email_events
DROP POLICY IF EXISTS "Service role can insert email events" ON public.email_events;

-- 4. notification_batch_queue
DROP POLICY IF EXISTS "System can insert to batch queue" ON public.notification_batch_queue;
DROP POLICY IF EXISTS "System can update batch queue" ON public.notification_batch_queue;

-- 5. notification_batches
DROP POLICY IF EXISTS "System can insert batches" ON public.notification_batches;

-- 6. notifications
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;

-- 7. qr_code_scans - Remove all overly permissive policies
DROP POLICY IF EXISTS "Anyone can track QR code scans" ON public.qr_code_scans;
DROP POLICY IF EXISTS "Anonymous users can track QR code scans" ON public.qr_code_scans;
DROP POLICY IF EXISTS "Authenticated users can track QR code scans" ON public.qr_code_scans;
DROP POLICY IF EXISTS "System can update QR code scan conversions" ON public.qr_code_scans;
DROP POLICY IF EXISTS "Users can update their own QR code scans" ON public.qr_code_scans;
DROP POLICY IF EXISTS "Admins can update any QR code scans" ON public.qr_code_scans;

-- Create proper policy for qr_code_scans - validate referral_code exists in sales_agents
CREATE POLICY "Insert QR scans for valid referral codes"
ON public.qr_code_scans FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.sales_agents sa 
    WHERE sa.referral_code = qr_code_scans.referral_code
  )
);

-- Allow updates only for authenticated users who are the converted user
CREATE POLICY "Users can update own conversions"
ON public.qr_code_scans FOR UPDATE
TO authenticated
USING (auth.uid() = converted_user_id)
WITH CHECK (auth.uid() = converted_user_id);

-- Admins can update any scans
CREATE POLICY "Admins can update QR scans"
ON public.qr_code_scans FOR UPDATE
TO authenticated
USING (public.is_admin_secure());

-- 8. rate_limit_log
DROP POLICY IF EXISTS "System can insert rate limit logs" ON public.rate_limit_log;

-- 9. referral_clicks
DROP POLICY IF EXISTS "System can insert referral clicks" ON public.referral_clicks;

-- 10. review_requests
DROP POLICY IF EXISTS "System can insert review requests" ON public.review_requests;
DROP POLICY IF EXISTS "System can update review requests" ON public.review_requests;

-- 11. review_sentiment_analysis
DROP POLICY IF EXISTS "System can insert sentiment analysis" ON public.review_sentiment_analysis;