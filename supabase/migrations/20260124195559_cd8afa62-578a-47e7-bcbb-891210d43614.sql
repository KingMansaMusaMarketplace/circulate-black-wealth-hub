-- =============================================
-- FIX: QR Scan race condition prevention (Claim 17)
-- Use a different approach that doesn't require immutable function
-- =============================================

-- Create a composite unique constraint on the existing columns
-- This prevents same customer from scanning same QR code on same scan_date
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_qr_scans_unique_daily'
  ) THEN
    CREATE UNIQUE INDEX idx_qr_scans_unique_daily 
    ON public.qr_scans (qr_code_id, customer_id, scan_date);
    
    COMMENT ON INDEX idx_qr_scans_unique_daily IS 
      'PATENT PROTECTED: Atomic Check-in System race condition prevention (Claim 17)';
  END IF;
END $$;