-- Remove the deprecated pgjwt extension
-- This is safe since the application uses Supabase's built-in auth functions instead
DROP EXTENSION IF EXISTS pgjwt CASCADE;