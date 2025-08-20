-- Check what the business_directory view contains and secure it
-- First, let's see the view definition
SELECT pg_get_viewdef('business_directory', true);