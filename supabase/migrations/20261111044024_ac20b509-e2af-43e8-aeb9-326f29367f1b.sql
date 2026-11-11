UPDATE public.hc_compliance_milestones SET
  status = 'researching',
  next_step = 'Request a partner demo, sample contract and standard BAA from DoseSpot (dosespot.com, Full Integration plan). In parallel, open Photon Health''s free sandbox as a backup. Send both contracts to the attorney before signing.',
  estimated_cost = 'Partner route: DoseSpot pricing is sales-quoted per prescriber; resellers charge about $40/prescriber/month. Direct Surescripts build: often 12-18 months and $500,000+.',
  notes = 'Nov 11 2026 research: Do not certify with Surescripts directly. Use a Surescripts-certified e-prescribing partner that also supplies the licensed drug database and allergy/interaction checks. Shortlist: (1) DoseSpot - recommended; used by EHRs such as Healthie, Surescripts network, EPCS certified, JumpStart embedded screen or Full Integration API; pricing not public. (2) Photon Health - backup; public pricing ($300/month Launch plan with API, 350 orders, $1 per extra order), free sandbox, SOC 2 Type II; confirm pharmacy network reach and controlled-drug support. (3) DAW ScriptSure - about $45/prescriber/month standalone, vendor API plan custom; setup fees reported $5,000-$40,000. (4) DrFirst - enterprise partner, heavier contract. (5) Weno Exchange - cheapest but uses its own network instead of Surescripts, so not every pharmacy is reachable. Marking this row passed does NOT turn on e-prescribing.',
  updated_at = now()
WHERE item_key = 'surescripts';

UPDATE public.hc_compliance_milestones SET
  status = 'researching',
  next_step = 'Choose a partner whose controlled-drug prescribing is already DEA-audited (DoseSpot and ScriptSure advertise EPCS certified), so 1325 Clinical does not need its own DEA audit. Each doctor still completes identity proofing and two-step sign-in.',
  estimated_cost = 'Usually an add-on; one reseller charges about $20/prescriber/month extra for controlled drugs.',
  notes = 'Nov 11 2026: Partner route avoids a separate DEA EPCS audit for 1325 Clinical. Confirm in the partner contract. Marking this row passed does NOT turn on controlled-drug prescribing.',
  updated_at = now()
WHERE item_key = 'epcs';

INSERT INTO public.hc_vendor_baas (vendor_name, service_used_for, baa_category, status, vendor_contact, plan_and_cost, notes, sort_order) VALUES
  ('DoseSpot', 'E-prescribing to pharmacies (Surescripts network, controlled drugs, drug database) - recommended partner', 'requires_baa', 'not_requested',
   'dosespot.com - partner / sales contact form',
   'Sales-quoted per prescriber (JumpStart embedded screen or Full Integration API); resellers charge about $40/prescriber/month plus about $20 for controlled drugs',
   'Nov 11 2026: Recommended e-prescribing partner. Ask for a demo, sample partner contract, standard BAA, pricing and timeline. Attorney review before signing. Not connected yet; pilot prescriptions stay practice-only.', 120),
  ('Photon Health', 'E-prescribing to pharmacies - backup option', 'requires_baa', 'not_requested',
   'hello@photon.health',
   'Launch $300/month (350 orders, API access), $1 per extra order; free sandbox',
   'Nov 11 2026: Backup e-prescribing option. Confirm pharmacy network reach, controlled-drug support and BAA before choosing. Not connected yet.', 130)
ON CONFLICT (vendor_name) DO NOTHING;