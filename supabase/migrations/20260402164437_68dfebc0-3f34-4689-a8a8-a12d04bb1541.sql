
-- Fix 1: Recreate noir_drivers_public with security_invoker=on and remove sensitive fields (license_plate, user_id)
DROP VIEW IF EXISTS noir_drivers_public;

CREATE VIEW noir_drivers_public
WITH (security_invoker = on) AS
SELECT
    id,
    full_name,
    vehicle_make,
    vehicle_model,
    vehicle_year,
    vehicle_color,
    current_lat,
    current_lng,
    current_heading,
    rating_average,
    total_rides,
    profile_photo_url,
    is_online,
    is_approved,
    is_active,
    created_at,
    updated_at
FROM noir_drivers
WHERE is_online = true AND is_approved = true;

-- Fix 2: Recreate referral_stats_leaderboard with security_invoker=on and remove user_id
DROP VIEW IF EXISTS referral_stats_leaderboard;

CREATE VIEW referral_stats_leaderboard
WITH (security_invoker = on) AS
SELECT
    total_referrals,
    current_tier,
    rank
FROM referral_stats;
