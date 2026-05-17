
-- ============================================================
-- LAUNCH READINESS FIX: Prevent reviewees from rewriting reviews
-- ============================================================

-- ---------- property_reviews ----------
DROP POLICY IF EXISTS "Hosts can respond to reviews" ON public.property_reviews;
DROP POLICY IF EXISTS "Guests can update their own reviews" ON public.property_reviews;

-- Guests (reviewers) may edit their own review content
CREATE POLICY "Guests can update their own reviews"
ON public.property_reviews
FOR UPDATE
USING (guest_id = auth.uid())
WITH CHECK (guest_id = auth.uid());

-- Hosts may update rows for their properties — but a trigger restricts which columns
CREATE POLICY "Hosts can respond to reviews"
ON public.property_reviews
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.vacation_properties vp
    WHERE vp.id = property_reviews.property_id AND vp.host_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.vacation_properties vp
    WHERE vp.id = property_reviews.property_id AND vp.host_id = auth.uid()
  )
);

CREATE OR REPLACE FUNCTION public.enforce_property_review_host_response_only()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_guest boolean := (OLD.guest_id = auth.uid());
  is_host  boolean := EXISTS (
    SELECT 1 FROM public.vacation_properties vp
    WHERE vp.id = OLD.property_id AND vp.host_id = auth.uid()
  );
BEGIN
  -- Guests editing their own review: allowed to change anything except response fields
  IF is_guest THEN
    NEW.host_response    := OLD.host_response;
    NEW.host_response_at := OLD.host_response_at;
    RETURN NEW;
  END IF;

  -- Hosts: ONLY host_response / host_response_at may change
  IF is_host THEN
    IF NEW.property_id     IS DISTINCT FROM OLD.property_id
       OR NEW.booking_id   IS DISTINCT FROM OLD.booking_id
       OR NEW.guest_id     IS DISTINCT FROM OLD.guest_id
       OR NEW.rating       IS DISTINCT FROM OLD.rating
       OR NEW.cleanliness  IS DISTINCT FROM OLD.cleanliness
       OR NEW.accuracy     IS DISTINCT FROM OLD.accuracy
       OR NEW.communication IS DISTINCT FROM OLD.communication
       OR NEW.location     IS DISTINCT FROM OLD.location
       OR NEW.check_in     IS DISTINCT FROM OLD.check_in
       OR NEW.value        IS DISTINCT FROM OLD.value
       OR NEW.review_text  IS DISTINCT FROM OLD.review_text
       OR NEW.is_public    IS DISTINCT FROM OLD.is_public
    THEN
      RAISE EXCEPTION 'Hosts may only update host_response fields on property_reviews';
    END IF;
    RETURN NEW;
  END IF;

  RAISE EXCEPTION 'Not authorized to update this review';
END;
$$;

DROP TRIGGER IF EXISTS trg_property_reviews_host_response_only ON public.property_reviews;
CREATE TRIGGER trg_property_reviews_host_response_only
BEFORE UPDATE ON public.property_reviews
FOR EACH ROW EXECUTE FUNCTION public.enforce_property_review_host_response_only();

-- ---------- stays_reviews ----------
DROP POLICY IF EXISTS "Reviewers and hosts can update reviews" ON public.stays_reviews;

CREATE POLICY "Reviewers can update their own reviews"
ON public.stays_reviews
FOR UPDATE
USING (reviewer_id = auth.uid())
WITH CHECK (reviewer_id = auth.uid());

CREATE POLICY "Reviewees can respond to reviews"
ON public.stays_reviews
FOR UPDATE
USING (reviewee_id = auth.uid())
WITH CHECK (reviewee_id = auth.uid());

CREATE OR REPLACE FUNCTION public.enforce_stays_review_response_only()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_reviewer boolean := (OLD.reviewer_id = auth.uid());
  is_reviewee boolean := (OLD.reviewee_id = auth.uid());
BEGIN
  IF is_reviewer THEN
    NEW.host_response    := OLD.host_response;
    NEW.host_response_at := OLD.host_response_at;
    RETURN NEW;
  END IF;

  IF is_reviewee THEN
    IF NEW.booking_id           IS DISTINCT FROM OLD.booking_id
       OR NEW.property_id       IS DISTINCT FROM OLD.property_id
       OR NEW.reviewer_id       IS DISTINCT FROM OLD.reviewer_id
       OR NEW.reviewer_type     IS DISTINCT FROM OLD.reviewer_type
       OR NEW.reviewee_id       IS DISTINCT FROM OLD.reviewee_id
       OR NEW.overall_rating    IS DISTINCT FROM OLD.overall_rating
       OR NEW.cleanliness_rating IS DISTINCT FROM OLD.cleanliness_rating
       OR NEW.accuracy_rating   IS DISTINCT FROM OLD.accuracy_rating
       OR NEW.communication_rating IS DISTINCT FROM OLD.communication_rating
       OR NEW.location_rating   IS DISTINCT FROM OLD.location_rating
       OR NEW.checkin_rating    IS DISTINCT FROM OLD.checkin_rating
       OR NEW.value_rating      IS DISTINCT FROM OLD.value_rating
       OR NEW.review_text       IS DISTINCT FROM OLD.review_text
       OR NEW.is_public         IS DISTINCT FROM OLD.is_public
       OR NEW.is_flagged        IS DISTINCT FROM OLD.is_flagged
       OR NEW.flag_reason       IS DISTINCT FROM OLD.flag_reason
    THEN
      RAISE EXCEPTION 'Reviewees may only update host_response fields on stays_reviews';
    END IF;
    RETURN NEW;
  END IF;

  RAISE EXCEPTION 'Not authorized to update this review';
END;
$$;

DROP TRIGGER IF EXISTS trg_stays_reviews_response_only ON public.stays_reviews;
CREATE TRIGGER trg_stays_reviews_response_only
BEFORE UPDATE ON public.stays_reviews
FOR EACH ROW EXECUTE FUNCTION public.enforce_stays_review_response_only();
