-- Update user_type constraint to include 'admin'
ALTER TABLE public.profiles DROP CONSTRAINT profiles_user_type_check;

ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_type_check 
CHECK (user_type IN ('customer', 'business', 'admin'));

-- Make contact@mansamusamarketplace.com an admin
UPDATE public.profiles 
SET user_type = 'admin' 
WHERE id = 'bd72a75e-1310-4f40-9c74-380443b09d9b';