
-- Fix The Howard Group missing logo - use banner as fallback
UPDATE businesses 
SET logo_url = banner_url 
WHERE id = 'a338867f-a495-4bcb-88af-8233ab992cd8' AND (logo_url IS NULL OR logo_url = '');
