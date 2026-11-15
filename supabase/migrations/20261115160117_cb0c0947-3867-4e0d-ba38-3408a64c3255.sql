-- Bill look-ups go through the payment server function instead of a browser-callable helper.
DROP FUNCTION IF EXISTS public.get_qr_bill(uuid, text);