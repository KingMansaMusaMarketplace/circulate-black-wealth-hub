-- Reload PostgREST schema cache to recognize the host_id column
NOTIFY pgrst, 'reload schema';