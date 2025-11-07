-- Create friendships table for friend connections
CREATE TABLE public.friendships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, friend_id)
);

-- Create social_activity_feed table for tracking friend activities
CREATE TABLE public.social_activity_feed (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('purchase', 'review', 'check_in', 'achievement', 'business_support')),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create shared_shopping_lists table
CREATE TABLE public.shared_shopping_lists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create shopping_list_items table
CREATE TABLE public.shopping_list_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  list_id UUID NOT NULL REFERENCES shared_shopping_lists(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  added_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notes TEXT,
  is_completed BOOLEAN DEFAULT false,
  completed_by UUID REFERENCES auth.users(id),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create shopping_list_members table
CREATE TABLE public.shopping_list_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  list_id UUID NOT NULL REFERENCES shared_shopping_lists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'editor', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(list_id, user_id)
);

-- Enable RLS
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_list_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for friendships
CREATE POLICY "Users can view their own friendships"
ON public.friendships FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can create friend requests"
ON public.friendships FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their received friend requests"
ON public.friendships FOR UPDATE
USING (auth.uid() = friend_id AND status = 'pending');

CREATE POLICY "Users can delete their own friendships"
ON public.friendships FOR DELETE
USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- RLS Policies for social_activity_feed
CREATE POLICY "Users can view public activities from friends"
ON public.social_activity_feed FOR SELECT
USING (
  is_public = true AND (
    user_id = auth.uid() OR
    user_id IN (
      SELECT friend_id FROM friendships 
      WHERE user_id = auth.uid() AND status = 'accepted'
      UNION
      SELECT user_id FROM friendships 
      WHERE friend_id = auth.uid() AND status = 'accepted'
    )
  )
);

CREATE POLICY "Users can create their own activities"
ON public.social_activity_feed FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activities"
ON public.social_activity_feed FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activities"
ON public.social_activity_feed FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for shared_shopping_lists
CREATE POLICY "Users can view lists they're members of or public lists"
ON public.shared_shopping_lists FOR SELECT
USING (
  is_public = true OR
  creator_id = auth.uid() OR
  id IN (SELECT list_id FROM shopping_list_members WHERE user_id = auth.uid())
);

CREATE POLICY "Users can create shopping lists"
ON public.shared_shopping_lists FOR INSERT
WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "List creators can update their lists"
ON public.shared_shopping_lists FOR UPDATE
USING (auth.uid() = creator_id);

CREATE POLICY "List creators can delete their lists"
ON public.shared_shopping_lists FOR DELETE
USING (auth.uid() = creator_id);

-- RLS Policies for shopping_list_items
CREATE POLICY "List members can view items"
ON public.shopping_list_items FOR SELECT
USING (
  list_id IN (
    SELECT id FROM shared_shopping_lists 
    WHERE creator_id = auth.uid() OR is_public = true
  ) OR
  list_id IN (SELECT list_id FROM shopping_list_members WHERE user_id = auth.uid())
);

CREATE POLICY "List members can add items"
ON public.shopping_list_items FOR INSERT
WITH CHECK (
  auth.uid() = added_by AND (
    list_id IN (SELECT id FROM shared_shopping_lists WHERE creator_id = auth.uid()) OR
    list_id IN (SELECT list_id FROM shopping_list_members WHERE user_id = auth.uid())
  )
);

CREATE POLICY "List members can update items"
ON public.shopping_list_items FOR UPDATE
USING (
  list_id IN (SELECT id FROM shared_shopping_lists WHERE creator_id = auth.uid()) OR
  list_id IN (SELECT list_id FROM shopping_list_members WHERE user_id = auth.uid() AND role IN ('owner', 'editor'))
);

CREATE POLICY "Item creators can delete their items"
ON public.shopping_list_items FOR DELETE
USING (auth.uid() = added_by);

-- RLS Policies for shopping_list_members
CREATE POLICY "List members can view other members"
ON public.shopping_list_members FOR SELECT
USING (
  list_id IN (SELECT id FROM shared_shopping_lists WHERE creator_id = auth.uid()) OR
  list_id IN (SELECT list_id FROM shopping_list_members WHERE user_id = auth.uid())
);

CREATE POLICY "List owners can add members"
ON public.shopping_list_members FOR INSERT
WITH CHECK (
  list_id IN (SELECT id FROM shared_shopping_lists WHERE creator_id = auth.uid())
);

CREATE POLICY "List owners can update member roles"
ON public.shopping_list_members FOR UPDATE
USING (
  list_id IN (SELECT id FROM shared_shopping_lists WHERE creator_id = auth.uid())
);

CREATE POLICY "List owners and members can remove themselves"
ON public.shopping_list_members FOR DELETE
USING (
  auth.uid() = user_id OR
  list_id IN (SELECT id FROM shared_shopping_lists WHERE creator_id = auth.uid())
);

-- Create indexes for performance
CREATE INDEX idx_friendships_user_id ON public.friendships(user_id);
CREATE INDEX idx_friendships_friend_id ON public.friendships(friend_id);
CREATE INDEX idx_friendships_status ON public.friendships(status);
CREATE INDEX idx_social_activity_user_id ON public.social_activity_feed(user_id);
CREATE INDEX idx_social_activity_created_at ON public.social_activity_feed(created_at DESC);
CREATE INDEX idx_shopping_list_members_list_id ON public.shopping_list_members(list_id);
CREATE INDEX idx_shopping_list_members_user_id ON public.shopping_list_members(user_id);
CREATE INDEX idx_shopping_list_items_list_id ON public.shopping_list_items(list_id);

-- Create trigger for shopping list updates
CREATE TRIGGER update_shopping_lists_updated_at
BEFORE UPDATE ON public.shared_shopping_lists
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();