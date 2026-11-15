CREATE OR REPLACE FUNCTION public.hc_pilot_video_signals_validate()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE ref bigint;
BEGIN
  IF NEW.sender_side NOT IN ('clinic','patient') THEN RAISE EXCEPTION 'Unknown video side'; END IF;
  IF NEW.kind NOT IN ('hello','offer','answer','bye') THEN RAISE EXCEPTION 'Unknown video message'; END IF;
  IF NEW.kind = 'offer' AND NEW.sender_side <> 'clinic' THEN RAISE EXCEPTION 'Only the clinic starts the connection'; END IF;
  IF NEW.kind = 'answer' AND NEW.sender_side <> 'patient' THEN RAISE EXCEPTION 'Only the patient answers the connection'; END IF;
  IF NEW.kind IN ('hello','bye') THEN NEW.payload := NULL;
  ELSE
    IF NEW.payload IS NULL OR jsonb_typeof(NEW.payload) <> 'object' OR jsonb_typeof(NEW.payload -> 'sdp') <> 'string'
       OR (NEW.payload ->> 'type') NOT IN ('offer','answer') OR (NEW.payload ->> 'type') <> NEW.kind THEN
      RAISE EXCEPTION 'Video connection details are not valid';
    END IF;
    IF octet_length(NEW.payload::text) > 24000 THEN RAISE EXCEPTION 'Video connection details are too large'; END IF;
    IF NEW.kind = 'answer' THEN
      IF jsonb_typeof(NEW.payload -> 'ref') <> 'number' THEN RAISE EXCEPTION 'An answer must point to the offer it replies to'; END IF;
      ref := (NEW.payload ->> 'ref')::bigint;
      IF NOT EXISTS (SELECT 1 FROM public.hc_pilot_video_signals s WHERE s.id = ref AND s.room_id = NEW.room_id AND s.kind = 'offer') THEN
        RAISE EXCEPTION 'An answer must point to an offer in the same room';
      END IF;
      NEW.payload := jsonb_build_object('type', 'answer', 'sdp', NEW.payload ->> 'sdp', 'ref', ref);
    ELSE
      NEW.payload := jsonb_build_object('type', 'offer', 'sdp', NEW.payload ->> 'sdp');
    END IF;
  END IF;
  IF (SELECT count(*) FROM public.hc_pilot_video_signals WHERE room_id = NEW.room_id) >= 400 THEN
    RAISE EXCEPTION 'This video room has reached its limit. End it and start a new video visit.';
  END IF;
  NEW.created_at := now();
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.hc_pilot_video_signals_validate() FROM PUBLIC, anon, authenticated;