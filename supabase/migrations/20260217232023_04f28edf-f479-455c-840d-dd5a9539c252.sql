
-- Create wishlists table for organizing saved properties
CREATE TABLE public.stays_wishlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'My Favorites',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create wishlist items table
CREATE TABLE public.stays_wishlist_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wishlist_id UUID NOT NULL REFERENCES public.stays_wishlists(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.vacation_properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(wishlist_id, property_id)
);

-- Create indexes for fast lookups
CREATE INDEX idx_wishlist_items_user ON public.stays_wishlist_items(user_id);
CREATE INDEX idx_wishlist_items_property ON public.stays_wishlist_items(property_id);
CREATE INDEX idx_wishlists_user ON public.stays_wishlists(user_id);

-- Enable RLS
ALTER TABLE public.stays_wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stays_wishlist_items ENABLE ROW LEVEL SECURITY;

-- Wishlists policies
CREATE POLICY "Users can view their own wishlists" ON public.stays_wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own wishlists" ON public.stays_wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own wishlists" ON public.stays_wishlists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own wishlists" ON public.stays_wishlists FOR DELETE USING (auth.uid() = user_id);

-- Wishlist items policies
CREATE POLICY "Users can view their own wishlist items" ON public.stays_wishlist_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to their own wishlists" ON public.stays_wishlist_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove from their own wishlists" ON public.stays_wishlist_items FOR DELETE USING (auth.uid() = user_id);
