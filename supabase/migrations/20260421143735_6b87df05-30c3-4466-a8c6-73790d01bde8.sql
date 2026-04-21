-- Hilton Acupuncture - add Mount Pleasant SC location address per hiltonacupuncture.com
UPDATE public.businesses
SET address = '1300 Hospital Drive, Suite 220',
    zip_code = '29464',
    updated_at = now()
WHERE id = '1a2204e8-af28-493e-be29-0686c7a7a48d';

-- Lisa's Holistic Rehab - fix geo-coordinates to Halifax, Nova Scotia (was incorrectly in Lynchburg, VA)
UPDATE public.businesses
SET latitude = 44.6803,
    longitude = -63.6432,
    updated_at = now()
WHERE id = '67eb9e0c-36a9-4fef-857c-3d9a43595c1f';