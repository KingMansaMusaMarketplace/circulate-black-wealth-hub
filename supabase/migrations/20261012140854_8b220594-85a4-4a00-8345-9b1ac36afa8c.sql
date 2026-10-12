CREATE OR REPLACE FUNCTION public.set_qr_code_scan_ip()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE h json; ip text;
BEGIN
  BEGIN h := current_setting('request.headers', true)::json; EXCEPTION WHEN others THEN h := NULL; END;
  ip := trim(split_part(coalesce(h->>'x-forwarded-for', h->>'cf-connecting-ip', ''), ',', 1));
  IF ip <> '' THEN
    BEGIN NEW.ip_address := ip::inet; EXCEPTION WHEN others THEN NEW.ip_address := NULL; END;
  ELSE
    NEW.ip_address := NULL;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_set_qr_code_scan_ip ON public.qr_code_scans;
CREATE TRIGGER trg_set_qr_code_scan_ip BEFORE INSERT ON public.qr_code_scans
FOR EACH ROW EXECUTE FUNCTION public.set_qr_code_scan_ip();