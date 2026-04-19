DO $$
DECLARE
  s RECORD;
BEGIN
  FOR s IN SELECT * FROM public.corporate_subscriptions LOOP
    IF EXISTS (SELECT 1 FROM public.sponsor_deliverables WHERE sponsor_id = s.id) THEN
      CONTINUE;
    END IF;

    IF s.tier = 'founding' OR s.is_founding_sponsor = true THEN
      INSERT INTO public.sponsor_deliverables (sponsor_id, tier, category, title, sort_order, is_recurring, recurrence_interval) VALUES
        (s.id, 'founding', 'logo', 'Add logo to platform footer', 10, false, null),
        (s.id, 'founding', 'email', 'Send quarterly impact summary email', 20, true, 'quarterly'),
        (s.id, 'founding', 'social', 'Quarterly social media mention', 30, true, 'quarterly'),
        (s.id, 'founding', 'document', 'Issue Founding Sponsor certificate', 40, false, null),
        (s.id, 'founding', 'newsletter', 'Include in newsletter', 50, true, 'monthly'),
        (s.id, 'founding', 'pricing', 'Lock rate for 12 months', 60, false, null);
    END IF;

    IF s.tier = 'bronze' THEN
      INSERT INTO public.sponsor_deliverables (sponsor_id, tier, category, title, sort_order, is_recurring, recurrence_interval) VALUES
        (s.id, 'bronze', 'logo', 'Add logo to website footer', 10, false, null),
        (s.id, 'bronze', 'email', 'Send monthly impact reports', 20, true, 'monthly'),
        (s.id, 'bronze', 'analytics', 'Provision analytics dashboard access', 30, false, null),
        (s.id, 'bronze', 'document', 'Issue certificate of sponsorship', 40, false, null),
        (s.id, 'bronze', 'document', 'Send tax deduction documentation', 50, false, null);
    END IF;

    IF s.tier = 'silver' THEN
      INSERT INTO public.sponsor_deliverables (sponsor_id, tier, category, title, sort_order, is_recurring, recurrence_interval) VALUES
        (s.id, 'silver', 'logo', 'Add logo to website footer', 10, false, null),
        (s.id, 'silver', 'email', 'Send monthly impact reports', 20, true, 'monthly'),
        (s.id, 'silver', 'analytics', 'Provision analytics dashboard access', 30, false, null),
        (s.id, 'silver', 'document', 'Issue certificate of sponsorship', 40, false, null),
        (s.id, 'silver', 'document', 'Send tax deduction documentation', 50, false, null),
        (s.id, 'silver', 'logo', 'Add logo to business directory & sidebar', 60, false, null),
        (s.id, 'silver', 'social', 'Social media recognition (2x/month)', 70, true, 'biweekly'),
        (s.id, 'silver', 'email', 'Send quarterly impact reports', 80, true, 'quarterly'),
        (s.id, 'silver', 'support', 'Enable priority email support', 90, false, null),
        (s.id, 'silver', 'content', 'Publish sponsor spotlight blog post', 100, false, null);
    END IF;

    IF s.tier = 'gold' THEN
      INSERT INTO public.sponsor_deliverables (sponsor_id, tier, category, title, sort_order, is_recurring, recurrence_interval) VALUES
        (s.id, 'gold', 'logo', 'Add logo to website footer', 10, false, null),
        (s.id, 'gold', 'email', 'Send monthly impact reports', 20, true, 'monthly'),
        (s.id, 'gold', 'analytics', 'Provision analytics dashboard access', 30, false, null),
        (s.id, 'gold', 'document', 'Issue certificate of sponsorship', 40, false, null),
        (s.id, 'gold', 'document', 'Send tax deduction documentation', 50, false, null),
        (s.id, 'gold', 'logo', 'Add logo to business directory & sidebar', 60, false, null),
        (s.id, 'gold', 'email', 'Send quarterly impact reports', 80, true, 'quarterly'),
        (s.id, 'gold', 'support', 'Enable priority email support', 90, false, null),
        (s.id, 'gold', 'content', 'Publish sponsor spotlight blog post', 100, false, null),
        (s.id, 'gold', 'placement', 'Add rotating homepage banner', 110, false, null),
        (s.id, 'gold', 'placement', 'Set featured directory placement', 120, false, null),
        (s.id, 'gold', 'social', 'Weekly social media recognition', 130, true, 'weekly'),
        (s.id, 'gold', 'content', 'Produce custom impact case study', 140, false, null),
        (s.id, 'gold', 'content', 'Create co-branded marketing materials', 150, false, null),
        (s.id, 'gold', 'event', 'Send invitations to exclusive events', 160, true, 'quarterly'),
        (s.id, 'gold', 'support', 'Assign dedicated account manager', 170, false, null);
    END IF;

    IF s.tier = 'platinum' THEN
      INSERT INTO public.sponsor_deliverables (sponsor_id, tier, category, title, sort_order, is_recurring, recurrence_interval) VALUES
        (s.id, 'platinum', 'logo', 'Add logo to website footer', 10, false, null),
        (s.id, 'platinum', 'email', 'Send monthly impact reports', 20, true, 'monthly'),
        (s.id, 'platinum', 'analytics', 'Provision analytics dashboard access', 30, false, null),
        (s.id, 'platinum', 'document', 'Issue certificate of sponsorship', 40, false, null),
        (s.id, 'platinum', 'document', 'Send tax deduction documentation', 50, false, null),
        (s.id, 'platinum', 'logo', 'Add logo to business directory & sidebar', 60, false, null),
        (s.id, 'platinum', 'email', 'Send quarterly impact reports', 80, true, 'quarterly'),
        (s.id, 'platinum', 'support', 'Enable priority email support', 90, false, null),
        (s.id, 'platinum', 'content', 'Publish sponsor spotlight blog post', 100, false, null),
        (s.id, 'platinum', 'placement', 'Set featured directory placement', 120, false, null),
        (s.id, 'platinum', 'content', 'Produce custom impact case study', 140, false, null),
        (s.id, 'platinum', 'content', 'Create co-branded marketing materials', 150, false, null),
        (s.id, 'platinum', 'event', 'Send invitations to exclusive events', 160, true, 'quarterly'),
        (s.id, 'platinum', 'support', 'Assign dedicated account manager', 170, false, null),
        (s.id, 'platinum', 'placement', 'Set top banner placement', 200, false, null),
        (s.id, 'platinum', 'placement', 'Add to all platform logo placements', 210, false, null),
        (s.id, 'platinum', 'social', 'Daily social media recognition', 220, true, 'daily'),
        (s.id, 'platinum', 'content', 'Build custom landing page', 230, false, null),
        (s.id, 'platinum', 'content', 'Coordinate press release & PR support', 240, false, null),
        (s.id, 'platinum', 'event', 'Schedule executive networking opportunities', 250, true, 'quarterly'),
        (s.id, 'platinum', 'event', 'Hold quarterly strategy session', 260, true, 'quarterly'),
        (s.id, 'platinum', 'event', 'Send VIP event invitations', 270, true, 'quarterly');
    END IF;
  END LOOP;
END $$;