-- Add INSERT policy for redeemed_rewards so customers can redeem rewards
CREATE POLICY "Customers can redeem rewards" 
ON public.redeemed_rewards 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = customer_id);

-- Add INSERT and UPDATE policies for loyalty_points so the system can award points
CREATE POLICY "System can insert loyalty points" 
ON public.loyalty_points 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "System can update loyalty points" 
ON public.loyalty_points 
FOR UPDATE 
TO authenticated
USING (auth.uid() = customer_id)
WITH CHECK (auth.uid() = customer_id);

-- Also allow admins to view all loyalty data
CREATE POLICY "Admins can view all loyalty points" 
ON public.loyalty_points 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Admins can view all redeemed rewards" 
ON public.redeemed_rewards 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);