
-- Host Circles: Susu-style networking groups for hosts
CREATE TABLE public.host_circles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  region TEXT, -- geographic area (e.g., "Atlanta Metro", "DMV Area")
  circle_type TEXT NOT NULL DEFAULT 'general' CHECK (circle_type IN ('general', 'cleaning', 'maintenance', 'marketing', 'investment')),
  max_members INTEGER NOT NULL DEFAULT 12,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Circle members
CREATE TABLE public.host_circle_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  circle_id UUID NOT NULL REFERENCES public.host_circles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(circle_id, user_id)
);

-- Shared resources within circles
CREATE TABLE public.host_circle_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  circle_id UUID NOT NULL REFERENCES public.host_circles(id) ON DELETE CASCADE,
  shared_by UUID NOT NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('cleaning_team', 'handyman', 'photographer', 'tip', 'deal', 'co_marketing')),
  title TEXT NOT NULL,
  description TEXT,
  contact_info TEXT,
  rating NUMERIC DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.host_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.host_circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.host_circle_resources ENABLE ROW LEVEL SECURITY;

-- Helper function to check circle membership
CREATE OR REPLACE FUNCTION public.is_circle_member(_user_id UUID, _circle_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.host_circle_members
    WHERE user_id = _user_id AND circle_id = _circle_id
  );
$$;

-- Circles: anyone authenticated can view active circles
CREATE POLICY "Anyone can view active circles"
  ON public.host_circles FOR SELECT
  USING (is_active = true);

-- Circles: creator can update
CREATE POLICY "Creator can update own circles"
  ON public.host_circles FOR UPDATE
  USING (auth.uid() = created_by);

-- Circles: authenticated users can create
CREATE POLICY "Authenticated users can create circles"
  ON public.host_circles FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Members: members can view their circle's members
CREATE POLICY "Circle members can view members"
  ON public.host_circle_members FOR SELECT
  USING (public.is_circle_member(auth.uid(), circle_id));

-- Members: authenticated users can join circles
CREATE POLICY "Users can join circles"
  ON public.host_circle_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Members: users can leave circles
CREATE POLICY "Users can leave circles"
  ON public.host_circle_members FOR DELETE
  USING (auth.uid() = user_id);

-- Resources: circle members can view resources
CREATE POLICY "Circle members can view resources"
  ON public.host_circle_resources FOR SELECT
  USING (public.is_circle_member(auth.uid(), circle_id));

-- Resources: circle members can share resources
CREATE POLICY "Circle members can share resources"
  ON public.host_circle_resources FOR INSERT
  WITH CHECK (public.is_circle_member(auth.uid(), circle_id) AND auth.uid() = shared_by);

-- Resources: resource owner can update
CREATE POLICY "Resource owner can update"
  ON public.host_circle_resources FOR UPDATE
  USING (auth.uid() = shared_by);

-- Indexes
CREATE INDEX idx_host_circle_members_user ON public.host_circle_members(user_id);
CREATE INDEX idx_host_circle_members_circle ON public.host_circle_members(circle_id);
CREATE INDEX idx_host_circle_resources_circle ON public.host_circle_resources(circle_id);
