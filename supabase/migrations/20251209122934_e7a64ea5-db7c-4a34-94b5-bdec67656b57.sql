-- Fix infinite recursion in RLS policies for savings_circles and shopping_lists
-- Create SECURITY DEFINER helper functions to check membership without triggering RLS

-- Helper function: Check if user is a member of a savings circle
CREATE OR REPLACE FUNCTION public.is_savings_circle_member(p_circle_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM savings_circle_members 
    WHERE circle_id = p_circle_id AND user_id = p_user_id
  );
$$;

-- Helper function: Check if user is the creator of a savings circle
CREATE OR REPLACE FUNCTION public.is_savings_circle_creator(p_circle_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM savings_circles 
    WHERE id = p_circle_id AND creator_id = p_user_id
  );
$$;

-- Helper function: Check if user is a member of a shopping list
CREATE OR REPLACE FUNCTION public.is_shopping_list_member(p_list_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM shopping_list_members 
    WHERE list_id = p_list_id AND user_id = p_user_id
  );
$$;

-- Helper function: Check if user is the creator of a shopping list
CREATE OR REPLACE FUNCTION public.is_shopping_list_creator(p_list_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM shared_shopping_lists 
    WHERE id = p_list_id AND creator_id = p_user_id
  );
$$;

-- Drop and recreate savings_circles SELECT policy
DROP POLICY IF EXISTS "Everyone can view open circles" ON savings_circles;
CREATE POLICY "Everyone can view open circles" ON savings_circles
FOR SELECT USING (
  status = 'open' 
  OR creator_id = auth.uid() 
  OR public.is_savings_circle_member(id, auth.uid())
);

-- Drop and recreate savings_circle_members SELECT policy
DROP POLICY IF EXISTS "Members can view their circles" ON savings_circle_members;
CREATE POLICY "Members can view their circles" ON savings_circle_members
FOR SELECT USING (
  auth.uid() = user_id 
  OR public.is_savings_circle_creator(circle_id, auth.uid())
);

-- Drop and recreate shared_shopping_lists SELECT policy
DROP POLICY IF EXISTS "Users can view lists they're members of or public lists" ON shared_shopping_lists;
CREATE POLICY "Users can view lists they're members of or public lists" ON shared_shopping_lists
FOR SELECT USING (
  is_public = true 
  OR creator_id = auth.uid() 
  OR public.is_shopping_list_member(id, auth.uid())
);

-- Drop and recreate shopping_list_members SELECT policy
DROP POLICY IF EXISTS "List members can view other members" ON shopping_list_members;
CREATE POLICY "List members can view other members" ON shopping_list_members
FOR SELECT USING (
  public.is_shopping_list_creator(list_id, auth.uid())
  OR public.is_shopping_list_member(list_id, auth.uid())
);

-- Drop and recreate shopping_list_members INSERT policy
DROP POLICY IF EXISTS "List owners can add members" ON shopping_list_members;
CREATE POLICY "List owners can add members" ON shopping_list_members
FOR INSERT WITH CHECK (
  public.is_shopping_list_creator(list_id, auth.uid())
);

-- Drop and recreate shopping_list_members UPDATE policy
DROP POLICY IF EXISTS "List owners can update member roles" ON shopping_list_members;
CREATE POLICY "List owners can update member roles" ON shopping_list_members
FOR UPDATE USING (
  public.is_shopping_list_creator(list_id, auth.uid())
);

-- Drop and recreate shopping_list_members DELETE policy
DROP POLICY IF EXISTS "List owners and members can remove themselves" ON shopping_list_members;
CREATE POLICY "List owners and members can remove themselves" ON shopping_list_members
FOR DELETE USING (
  auth.uid() = user_id 
  OR public.is_shopping_list_creator(list_id, auth.uid())
);