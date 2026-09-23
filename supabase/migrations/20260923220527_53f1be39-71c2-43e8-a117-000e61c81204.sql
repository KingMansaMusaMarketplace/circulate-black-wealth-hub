ALTER TABLE public.business_claim_invites
  ADD COLUMN IF NOT EXISTS resend_id text,
  ADD COLUMN IF NOT EXISTS clicked_at timestamptz,
  ADD COLUMN IF NOT EXISTS bounced_at timestamptz,
  ADD COLUMN IF NOT EXISTS reminder_sent_at timestamptz;
CREATE INDEX IF NOT EXISTS idx_claim_invites_resend_id ON public.business_claim_invites(resend_id);
CREATE INDEX IF NOT EXISTS idx_claim_invites_business ON public.business_claim_invites(business_id);

ALTER TABLE public.holiday_campaign_sends
  ADD COLUMN IF NOT EXISTS opened_at timestamptz,
  ADD COLUMN IF NOT EXISTS clicked_at timestamptz,
  ADD COLUMN IF NOT EXISTS bounced_at timestamptz;
CREATE INDEX IF NOT EXISTS idx_holiday_sends_resend_id ON public.holiday_campaign_sends(resend_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_claim_optouts_email ON public.claim_email_optouts(email);

-- When a business becomes claimed, credit the invite + campaign
CREATE OR REPLACE FUNCTION public.mark_claim_invite_claimed()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.claim_status = 'claimed' AND COALESCE(OLD.claim_status,'') <> 'claimed' THEN
    WITH upd AS (
      UPDATE public.business_claim_invites
         SET claimed_at = now(), status = 'claimed', updated_at = now()
       WHERE business_id = NEW.id AND claimed_at IS NULL AND status IN ('sent','reminded')
      RETURNING campaign_id
    )
    UPDATE public.business_claim_campaigns c
       SET total_claimed = COALESCE(c.total_claimed,0) + 1
     WHERE c.id IN (SELECT DISTINCT campaign_id FROM upd);
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_mark_claim_invite_claimed ON public.businesses;
CREATE TRIGGER trg_mark_claim_invite_claimed
AFTER UPDATE OF claim_status ON public.businesses
FOR EACH ROW EXECUTE FUNCTION public.mark_claim_invite_claimed();

-- Daily: reminders + summary email (14:00 UTC = 9am Chicago)
DO $$ BEGIN PERFORM cron.unschedule('claim-campaign-daily'); EXCEPTION WHEN OTHERS THEN NULL; END $$;
SELECT cron.schedule(
  'claim-campaign-daily',
  '0 14 * * *',
  $$
  SELECT net.http_post(
    url := 'https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/claim-campaign-daily',
    headers := jsonb_build_object('Content-Type','application/json','x-cron-secret', coalesce(current_setting('app.cron_secret', true), '')),
    body := jsonb_build_object('trigger','cron')
  );
  $$
);