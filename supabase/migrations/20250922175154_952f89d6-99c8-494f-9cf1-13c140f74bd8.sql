-- First, drop the existing overly permissive RLS policy
DROP POLICY IF EXISTS "Tests are viewable by authenticated users only" ON public.sales_agent_tests;

-- Drop any existing policy with the new name to avoid conflicts
DROP POLICY IF EXISTS "Only admins can view test questions with answers" ON public.sales_agent_tests;

-- Create a secure policy that only allows admins to see the full table with answers
CREATE POLICY "Admin access to test questions with answers" 
ON public.sales_agent_tests 
FOR SELECT 
USING (public.is_admin());

-- Create a security definer function that returns questions without correct answers for test-takers
CREATE OR REPLACE FUNCTION public.get_test_questions_for_user()
RETURNS TABLE(
  id uuid,
  question text,
  option_a text,
  option_b text,
  option_c text,
  option_d text,
  created_at timestamp with time zone
) 
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  -- Return only active questions without the correct_answer field
  SELECT 
    t.id,
    t.question,
    t.option_a,
    t.option_b,
    t.option_c,
    t.option_d,
    t.created_at
  FROM public.sales_agent_tests t
  WHERE t.is_active = true
  ORDER BY RANDOM(); -- Randomize question order to prevent predictable patterns
$$;

-- Create a function for admins to validate test answers
CREATE OR REPLACE FUNCTION public.validate_test_answers(
  answer_data jsonb
) 
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_questions integer := 0;
  correct_answers integer := 0;
  question_record record;
  user_answer text;
  score integer;
  passing_score integer := 70; -- 70% passing score
  result jsonb;
BEGIN
  -- Ensure only authenticated users can take tests
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required to validate test answers';
  END IF;
  
  -- Loop through each question and check answers
  FOR question_record IN 
    SELECT id, correct_answer 
    FROM public.sales_agent_tests 
    WHERE is_active = true
  LOOP
    total_questions := total_questions + 1;
    
    -- Get the user's answer for this question
    user_answer := answer_data ->> question_record.id::text;
    
    -- Check if the answer is correct
    IF user_answer = question_record.correct_answer THEN
      correct_answers := correct_answers + 1;
    END IF;
  END LOOP;
  
  -- Calculate score percentage
  IF total_questions > 0 THEN
    score := (correct_answers * 100) / total_questions;
  ELSE
    score := 0;
  END IF;
  
  -- Build result object
  result := jsonb_build_object(
    'total_questions', total_questions,
    'correct_answers', correct_answers,
    'score', score,
    'passed', score >= passing_score,
    'passing_score', passing_score
  );
  
  -- Log the test attempt
  INSERT INTO public.sales_agent_test_attempts (
    user_id,
    answers,
    score,
    passed,
    completed_date
  ) VALUES (
    auth.uid(),
    answer_data,
    score,
    score >= passing_score,
    now()
  );
  
  RETURN result;
END;
$$;

-- Grant execute permissions on the new functions
GRANT EXECUTE ON FUNCTION public.get_test_questions_for_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.validate_test_answers(jsonb) TO authenticated;