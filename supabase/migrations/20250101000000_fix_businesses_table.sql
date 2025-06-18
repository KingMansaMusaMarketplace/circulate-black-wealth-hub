
-- Fix businesses table by adding missing name column if it doesn't exist
DO $$ 
BEGIN
    -- Check if name column exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'businesses' 
        AND column_name = 'name'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.businesses ADD COLUMN name TEXT;
    END IF;
    
    -- Update existing businesses that might have business_name but no name
    UPDATE public.businesses 
    SET name = business_name 
    WHERE name IS NULL AND business_name IS NOT NULL;
    
    -- If we don't have business_name either, set a default
    UPDATE public.businesses 
    SET name = 'Business Name Not Set'
    WHERE name IS NULL;
    
    -- Make name column NOT NULL after setting values
    ALTER TABLE public.businesses ALTER COLUMN name SET NOT NULL;
END $$;
