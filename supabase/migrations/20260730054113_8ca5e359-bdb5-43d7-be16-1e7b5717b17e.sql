
-- 1) Allow driver owners to submit their own draft application
CREATE OR REPLACE FUNCTION public.lock_noir_drivers_admin_cols()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
DECLARE owner_submit boolean;
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;
  owner_submit := auth.uid() = OLD.user_id
    AND OLD.application_status = 'draft'
    AND NEW.application_status = 'submitted';
  IF NEW.is_approved IS DISTINCT FROM OLD.is_approved
     OR NEW.is_active IS DISTINCT FROM OLD.is_active
     OR NEW.total_earnings IS DISTINCT FROM OLD.total_earnings
     OR NEW.rating_average IS DISTINCT FROM OLD.rating_average
     OR NEW.reviewed_at IS DISTINCT FROM OLD.reviewed_at
     OR NEW.reviewed_by IS DISTINCT FROM OLD.reviewed_by
     OR NEW.total_rides IS DISTINCT FROM OLD.total_rides
     OR (NEW.application_status IS DISTINCT FROM OLD.application_status AND NOT owner_submit) THEN
    RAISE EXCEPTION 'Only administrators may change approval, status, earnings, or rating fields on noir_drivers'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;$function$;

CREATE OR REPLACE FUNCTION public.enforce_noir_drivers_admin_cols()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;
  NEW.is_approved := OLD.is_approved;
  NEW.is_active := OLD.is_active;
  IF NOT (auth.uid() = OLD.user_id AND OLD.application_status = 'draft' AND NEW.application_status = 'submitted') THEN
    NEW.application_status := OLD.application_status;
  END IF;
  NEW.reviewed_at := OLD.reviewed_at;
  NEW.reviewed_by := OLD.reviewed_by;
  NEW.rejection_reason := OLD.rejection_reason;
  NEW.admin_notes := OLD.admin_notes;
  NEW.rating_average := OLD.rating_average;
  NEW.total_rides := OLD.total_rides;
  NEW.total_earnings := OLD.total_earnings;
  RETURN NEW;
END;$function$;

CREATE OR REPLACE FUNCTION public.protect_noir_driver_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
BEGIN
  IF public.is_admin_or_service() THEN RETURN NEW; END IF;
  NEW.is_approved := OLD.is_approved;
  NEW.is_active := OLD.is_active;
  IF NOT (auth.uid() = OLD.user_id AND OLD.application_status = 'draft' AND NEW.application_status = 'submitted') THEN
    NEW.application_status := OLD.application_status;
  END IF;
  NEW.rating_average := OLD.rating_average;
  NEW.total_earnings := OLD.total_earnings;
  RETURN NEW;
END;$function$;

CREATE OR REPLACE FUNCTION public.protect_noir_drivers_privileged_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
BEGIN
  IF public._is_admin_current_user() THEN RETURN NEW; END IF;
  NEW.is_approved := OLD.is_approved;
  NEW.is_active := OLD.is_active;
  IF NOT (auth.uid() = OLD.user_id AND OLD.application_status = 'draft' AND NEW.application_status = 'submitted') THEN
    NEW.application_status := OLD.application_status;
  END IF;
  RETURN NEW;
END;$function$;

-- 2) Server-side grading writes the sales agent test score
CREATE OR REPLACE FUNCTION public._sales_agent_grading_active()
RETURNS boolean LANGUAGE sql STABLE AS $function$
  SELECT coalesce(current_setting('app.sales_agent_grading', true), '') = 'on';
$function$;

REVOKE ALL ON FUNCTION public._sales_agent_grading_active() FROM PUBLIC, anon;

CREATE OR REPLACE FUNCTION public.enforce_sales_agent_apps_admin_cols()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;
  IF NOT public._sales_agent_grading_active() THEN
    NEW.test_score := OLD.test_score;
    NEW.test_passed := OLD.test_passed;
  END IF;
  NEW.application_status := OLD.application_status;
  NEW.reviewed_at := OLD.reviewed_at;
  NEW.reviewed_by := OLD.reviewed_by;
  NEW.notes := OLD.notes;
  RETURN NEW;
END;$function$;

CREATE OR REPLACE FUNCTION public.protect_sales_agent_application_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
DECLARE is_admin boolean := false;
BEGIN
  BEGIN
    SELECT public.has_role(auth.uid(), 'admin'::public.app_role) INTO is_admin;
  EXCEPTION WHEN OTHERS THEN is_admin := false;
  END;
  IF is_admin THEN RETURN NEW; END IF;

  IF NEW.application_status IS DISTINCT FROM OLD.application_status
     OR NEW.reviewed_by IS DISTINCT FROM OLD.reviewed_by
     OR NEW.reviewed_at IS DISTINCT FROM OLD.reviewed_at
     OR NEW.notes IS DISTINCT FROM OLD.notes
     OR ((NEW.test_passed IS DISTINCT FROM OLD.test_passed OR NEW.test_score IS DISTINCT FROM OLD.test_score)
         AND NOT public._sales_agent_grading_active()) THEN
    RAISE EXCEPTION 'Only admins can modify application status, test results, or review fields'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;$function$;

CREATE OR REPLACE FUNCTION public.protect_sales_agent_applications_privileged()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
BEGIN
  IF public._sec_is_admin_or_system() THEN RETURN NEW; END IF;
  IF NEW.application_status IS DISTINCT FROM OLD.application_status
     OR NEW.status IS DISTINCT FROM OLD.status
     OR NEW.reviewed_by IS DISTINCT FROM OLD.reviewed_by
     OR NEW.reviewed_at IS DISTINCT FROM OLD.reviewed_at
     OR NEW.notes IS DISTINCT FROM OLD.notes
     OR ((NEW.test_passed IS DISTINCT FROM OLD.test_passed OR NEW.test_score IS DISTINCT FROM OLD.test_score)
         AND NOT public._sales_agent_grading_active()) THEN
    RAISE EXCEPTION 'Only administrators can modify application review fields';
  END IF;
  RETURN NEW;
END;$function$;

CREATE OR REPLACE FUNCTION public.validate_test_answers(answer_data jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
DECLARE
  total_questions integer := 0;
  correct_answers integer := 0;
  question_record record;
  user_answer text;
  score integer;
  passing_score integer := 70;
  result jsonb;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required to validate test answers';
  END IF;

  FOR question_record IN
    SELECT id, correct_answer FROM public.sales_agent_tests WHERE is_active = true
  LOOP
    total_questions := total_questions + 1;
    user_answer := answer_data ->> question_record.id::text;
    IF user_answer = question_record.correct_answer THEN
      correct_answers := correct_answers + 1;
    END IF;
  END LOOP;

  IF total_questions > 0 THEN
    score := (correct_answers * 100) / total_questions;
  ELSE
    score := 0;
  END IF;

  result := jsonb_build_object(
    'total_questions', total_questions,
    'correct_answers', correct_answers,
    'score', score,
    'passed', score >= passing_score,
    'passing_score', passing_score
  );

  INSERT INTO public.sales_agent_test_attempts (user_id, answers, score, passed, completed_date)
  VALUES (auth.uid(), answer_data, score, score >= passing_score, now());

  -- Record the graded result on the applicant's own application
  PERFORM set_config('app.sales_agent_grading', 'on', true);
  UPDATE public.sales_agent_applications
     SET test_score = score,
         test_passed = (score >= passing_score)
   WHERE user_id = auth.uid();
  PERFORM set_config('app.sales_agent_grading', 'off', true);

  RETURN result;
END;$function$;
