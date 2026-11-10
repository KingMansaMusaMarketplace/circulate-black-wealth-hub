UPDATE public.hc_vendor_baas SET
  status = 'requested',
  requested_on = '2026-11-10',
  vendor_contact = 'privacy@heygen.com; HeyGen Enterprise team (assigned by HeyGen Support, do not open new tickets)',
  plan_and_cost = 'Enterprise only. Enterprise API from $25,000/yr (50,000 API credits); Enterprise Web from $30,000/yr; typically 1-year contract',
  notes = 'Nov 10 2026: HeyGen Support replied that HIPAA coverage is available only on Enterprise after a signed BAA, and routed us to the Enterprise team to confirm v3 Text-to-Speech and subprocessor (ElevenLabs) coverage, data retention / zero-data-retention, SOC 2 Type II access and a call. HeyGen asked us not to open more tickets. Next: wait for the Enterprise rep; ask for the standard BAA for attorney review, written ElevenLabs coverage and a startup/pilot discount. Do not sign or pay before attorney review. Real-patient read-backs use the device voice until this is cleared.',
  updated_at = now()
WHERE vendor_name = 'HeyGen';