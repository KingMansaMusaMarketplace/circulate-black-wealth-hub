
-- City First Bank (2 records) - use hero with smiling woman in shop
UPDATE public.businesses 
SET banner_url = 'https://www.cityfirstbank.com/wp-content/uploads/2025/08/CFB-Web-Hero-05-1536x307.jpg',
    updated_at = now()
WHERE id IN ('ae543527-1380-437a-ac84-7c17e8b15713', '94cb662d-ff2f-4893-9e34-047b2aa3ecb8');

-- HOPE Credit Union - use hero image from website
UPDATE public.businesses 
SET banner_url = 'https://www.hopecu.org/wp-content/uploads/2024/04/hope-hero-cropped.png',
    updated_at = now()
WHERE id = 'aa742480-db73-4ad1-879c-9b091f623917';
