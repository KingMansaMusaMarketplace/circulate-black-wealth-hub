-- Remove from publication temporarily
ALTER PUBLICATION supabase_realtime DROP TABLE public.businesses;

-- Now update
UPDATE public.businesses 
SET 
  logo_url = 'https://www.miguelwilson.com/wp-content/uploads/2018/06/MW-logo-header.png',
  banner_url = 'https://i0.wp.com/www.miguelwilson.com/wp-content/uploads/2025/08/polo25-all.jpg?resize=600&ssl=1'
WHERE id = 'b09811d2-336f-4a99-a73f-4d2d4e2cd4f1';

-- Re-add with column filter (excluding phone=10, email=11, referral_code_used=30, referred_at=31, referral_commission_paid=32, is_founding_sponsor=33, founding_sponsor_since=34, total_revenue_tracked=42, transaction_count=43)
ALTER PUBLICATION supabase_realtime ADD TABLE public.businesses (
  id, owner_id, business_name, description, category, address, city, state, zip_code,
  website, logo_url, banner_url, is_verified, qr_code_id, qr_code_url, average_rating,
  review_count, created_at, updated_at, name, parent_business_id, location_type,
  location_name, location_manager_id, listing_status, onboarding_completed_at,
  is_founding_member, founding_order, founding_joined_at, latitude, longitude
);