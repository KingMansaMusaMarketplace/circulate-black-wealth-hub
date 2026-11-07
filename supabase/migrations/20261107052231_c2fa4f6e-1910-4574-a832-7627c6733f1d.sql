UPDATE public.hc_vendor_baas SET
  vendor_contact = 'baa@openai.com (Case Number 19361902)',
  plan_and_cost = 'No extra cost and no minimum spend for the API BAA; normal API usage charges apply',
  notes = 'Nov 7 2026: OpenAI replied (Case 19361902) with an intake questionnaire. Steps: send company and use-case details, OpenAI reviews internally (a few business days), then shares the outcome. The API organization must be set to Modified Retention ("Eyes Off") before any patient data. Realtime voice and transcription eligibility must be checked against OpenAI''s HIPAA-eligible products list. Next: return the questionnaire. No agreement received yet; attorney must review before signing.',
  updated_at = now()
WHERE id = '6e4e96ad-dc17-4f93-922a-3d931618e899';