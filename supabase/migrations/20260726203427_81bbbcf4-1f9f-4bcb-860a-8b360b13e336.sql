INSERT INTO public.feature_flags (flag_key, flag_name, description, is_enabled, rollout_percentage, target_user_types)
VALUES 
  ('pre_launch_hide_risky_modules', 'Pre-launch: Hide Risky Modules', 'Master flag to hide Susu, Noir Rideshare, Mansa Stays, Sales Agent, and advanced Kayla tools from public navigation and direct routes until post-launch.', true, 100, '{}'),
  ('hide_susu_karma_wallet', 'Hide Susu / Karma / Wallet', 'Hides community banking, savings circles, and impact wallet features from public navigation.', true, 100, '{}'),
  ('hide_noir_rideshare', 'Hide Noir Rideshare', 'Hides driver application, ride booking, and hotel partner pages from public navigation.', true, 100, '{}'),
  ('hide_mansa_stays', 'Hide Mansa Stays', 'Hides vacation rentals, lease listings, and host dashboard links from public navigation.', true, 100, '{}'),
  ('hide_sales_agent_portal', 'Hide Sales Agent Portal', 'Hides sales agent signup, guide, and dashboard from public navigation.', true, 100, '{}'),
  ('hide_enterprise_corporate', 'Hide Enterprise / Corporate', 'Hides corporate sponsorship, enterprise dashboards, and B2B marketplace from public navigation.', true, 100, '{}'),
  ('hide_advanced_kayla', 'Hide Advanced Kayla Tools', 'Hides Kayla tools that depend on edge functions not yet fully deployed.', true, 100, '{}')
ON CONFLICT (flag_key) DO UPDATE SET
  is_enabled = EXCLUDED.is_enabled,
  updated_at = now();