
-- Clean up dependent public tables for both users
DELETE FROM public.security_audit_log WHERE user_id IN ('faf036ab-41be-4ad3-9b13-24daaa06d4b6', '4dfb78a7-92ec-4102-9e13-dadbbb1a920b');
DELETE FROM public.activity_log WHERE user_id IN ('faf036ab-41be-4ad3-9b13-24daaa06d4b6', '4dfb78a7-92ec-4102-9e13-dadbbb1a920b');

-- Delete businesses
DELETE FROM public.businesses WHERE owner_id IN ('faf036ab-41be-4ad3-9b13-24daaa06d4b6', '4dfb78a7-92ec-4102-9e13-dadbbb1a920b');

-- Delete profiles
DELETE FROM public.profiles WHERE id IN ('faf036ab-41be-4ad3-9b13-24daaa06d4b6', '4dfb78a7-92ec-4102-9e13-dadbbb1a920b');

-- Delete from auth
DELETE FROM auth.users WHERE id IN ('faf036ab-41be-4ad3-9b13-24daaa06d4b6', '4dfb78a7-92ec-4102-9e13-dadbbb1a920b');
