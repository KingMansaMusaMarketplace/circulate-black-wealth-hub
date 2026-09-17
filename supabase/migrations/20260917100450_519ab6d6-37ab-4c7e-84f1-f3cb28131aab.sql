GRANT SELECT ON public.kayla_benchmark_runs TO authenticated;
GRANT SELECT ON public.kayla_benchmark_results TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.kayla_benchmark_cases TO authenticated;
GRANT ALL ON public.kayla_benchmark_runs TO service_role;
GRANT ALL ON public.kayla_benchmark_results TO service_role;
GRANT ALL ON public.kayla_benchmark_cases TO service_role;
DELETE FROM public.kayla_benchmark_runs WHERE finished_at IS NULL;