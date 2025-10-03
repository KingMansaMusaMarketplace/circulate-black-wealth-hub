-- Fix security definer view warning
-- Replace the view without SECURITY DEFINER
DROP VIEW IF EXISTS business_locations_view;

CREATE VIEW business_locations_view AS
SELECT 
  b.id,
  b.business_name,
  b.location_name,
  b.location_type,
  b.parent_business_id,
  p.business_name as parent_business_name,
  b.owner_id,
  b.location_manager_id,
  b.city,
  b.state,
  b.is_verified,
  b.created_at
FROM businesses b
LEFT JOIN businesses p ON b.parent_business_id = p.id;