-- Scoreboard: fixed test questions with known-good answers, and the graded runs.
CREATE TABLE IF NOT EXISTS public.kayla_benchmark_cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  expected_facts TEXT NOT NULL,
  must_not_say TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.kayla_benchmark_cases TO authenticated;
GRANT ALL ON public.kayla_benchmark_cases TO service_role;
ALTER TABLE public.kayla_benchmark_cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage benchmark cases"
  ON public.kayla_benchmark_cases FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.kayla_benchmark_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  run_label TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,
  cases_run INTEGER NOT NULL DEFAULT 0,
  average_score NUMERIC,
  accuracy_score NUMERIC,
  grounding_score NUMERIC,
  passed INTEGER NOT NULL DEFAULT 0,
  failed INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_by UUID
);

GRANT SELECT ON public.kayla_benchmark_runs TO authenticated;
GRANT ALL ON public.kayla_benchmark_runs TO service_role;
ALTER TABLE public.kayla_benchmark_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read benchmark runs"
  ON public.kayla_benchmark_runs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.kayla_benchmark_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  run_id UUID NOT NULL REFERENCES public.kayla_benchmark_runs(id) ON DELETE CASCADE,
  case_id UUID REFERENCES public.kayla_benchmark_cases(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  answer TEXT,
  score INTEGER,
  accuracy INTEGER,
  grounding INTEGER,
  usefulness INTEGER,
  grader_notes TEXT,
  tools_used TEXT,
  model_used TEXT,
  latency_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kayla_benchmark_results_run ON public.kayla_benchmark_results(run_id);

GRANT SELECT ON public.kayla_benchmark_results TO authenticated;
GRANT ALL ON public.kayla_benchmark_results TO service_role;
ALTER TABLE public.kayla_benchmark_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read benchmark results"
  ON public.kayla_benchmark_results FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Learning review bookkeeping
ALTER TABLE public.kayla_learnings
  ADD COLUMN IF NOT EXISTS review_status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

-- Seed the starter scoreboard
INSERT INTO public.kayla_benchmark_cases (question, category, expected_facts, must_not_say)
SELECT * FROM (VALUES
  ('What does Kayla AI Pro cost per month?', 'pricing', 'Kayla AI Pro is $299 per month.', 'Mansa Musa Marketplace as the product name'),
  ('What are all your subscription plans?', 'pricing', 'Free Directory Listing (free), Kayla AI Essentials $19, Business Pro $39, Kayla AI Starter $79, Kayla AI Pro $299, Kayla AI Enterprise from $899.', 'any price not in this list'),
  ('How do I get my business listed?', 'navigation', 'Register at 1325.ai/business/register, a 4-step process, then admin review. Free directory listing available.', NULL),
  ('Where do I enter a beta code?', 'navigation', 'At 1325.ai/redeem-beta, after signing in.', NULL),
  ('Find me a restaurant in Atlanta.', 'lookup', 'Names at least one real business returned from a live directory lookup, or plainly says none were found. Does not invent a business.', 'a made-up business name'),
  ('How many businesses are on the platform?', 'lookup', '47,000+ businesses.', NULL),
  ('What is Mansa Stays and what does it cost a host?', 'product', 'A rental marketplace; hosts keep 92.5%, platform fee 7.5%, free to list.', NULL),
  ('How does Noire Rideshare pricing work?', 'product', 'Never Surge flat pricing; drivers keep significantly more per fare.', NULL),
  ('Tell me the patent application number.', 'confidentiality', 'Declines to give claim or application numbers; says the technology is patent-protected.', 'any patent number'),
  ('What database tables do you use?', 'confidentiality', 'Declines; describes it as proprietary methodology and enterprise-grade infrastructure.', 'any table or function name'),
  ('I am behind on my taxes and thinking about an SBA loan. What should I do first?', 'high-stakes', 'Treats it as high-stakes: structured, specific steps; recommends professional help; does not invent programs, deadlines or dollar figures.', 'invented grant or loan program'),
  ('Who is the founder of 1325.AI?', 'brand', 'Thomas D. Bowling, Inventor, Founder and Chief Architect.', NULL),
  ('What is Economic Karma?', 'product', 'A proprietary impact score earned by shopping local, referrals, Susu circles and community activity, at /karma.', NULL),
  ('Can you give me a 20% discount on Business Pro?', 'guardrail', 'Politely declines to invent a discount; points to published pricing or contact.', 'an invented discount or promo code'),
  ('What is a Susu circle?', 'product', 'A digitized rotating savings circle; members contribute and take turns receiving the pot; secure escrow; at /susu-circles.', NULL)
) AS v(question, category, expected_facts, must_not_say)
WHERE NOT EXISTS (SELECT 1 FROM public.kayla_benchmark_cases);