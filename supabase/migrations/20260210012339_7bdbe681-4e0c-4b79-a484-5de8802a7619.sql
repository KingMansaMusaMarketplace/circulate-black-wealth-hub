
ALTER TABLE vacation_properties
  ADD COLUMN listing_mode text NOT NULL DEFAULT 'nightly'
    CHECK (listing_mode IN ('nightly', 'monthly', 'both')),
  ADD COLUMN base_monthly_rate numeric DEFAULT NULL,
  ADD COLUMN weekly_rate numeric DEFAULT NULL;
