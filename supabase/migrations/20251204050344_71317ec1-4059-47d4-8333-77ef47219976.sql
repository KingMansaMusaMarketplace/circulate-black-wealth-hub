-- Remove admin role from other user, keeping only contact@mansamusamarketplace.com as admin
DELETE FROM user_roles 
WHERE role = 'admin' 
AND user_id != 'bd72a75e-1310-4f40-9c74-380443b09d9b';