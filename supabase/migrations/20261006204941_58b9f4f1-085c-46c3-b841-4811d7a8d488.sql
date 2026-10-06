-- Handoff log
CREATE TABLE public.kayla_agent_handoffs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid,
  from_agent text NOT NULL,
  to_agent text NOT NULL,
  reason text,
  channel text NOT NULL DEFAULT 'chat',
  status text NOT NULL DEFAULT 'done',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.kayla_agent_handoffs TO authenticated;
GRANT ALL ON public.kayla_agent_handoffs TO service_role;
ALTER TABLE public.kayla_agent_handoffs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read handoffs" ON public.kayla_agent_handoffs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX ON public.kayla_agent_handoffs (created_at DESC);

-- Per-employee test questions
ALTER TABLE public.kayla_benchmark_cases ADD COLUMN IF NOT EXISTS agent_name text;
ALTER TABLE public.kayla_benchmark_results ADD COLUMN IF NOT EXISTS agent_name text;

INSERT INTO public.kayla_benchmark_cases (question, category, expected_facts, must_not_say, agent_name, is_active) VALUES
($$How do I work out my cash runway?$$,'agent',$$Runway = cash on hand divided by monthly net burn (cash going out minus cash coming in). Gives number of months.$$,NULL,'Cash-Flow Analyst',true),
($$Is profit the same as cash flow?$$,'agent',$$No. Profit is revenue minus expenses on paper; cash flow is actual money in and out. A profitable business can run out of cash due to timing (unpaid invoices, inventory, loan payments).$$,NULL,'Cash-Flow Analyst',true),
($$My forecast shows I'll be short $8,000 in two months. What should I do?$$,'agent',$$Practical steps: cut or delay expenses, speed up receivables, consider a line of credit or loan, and look for grants. Should suggest grants/credit options and not promise specific funding.$$,$$guaranteed grant$$,'Cash-Flow Analyst',true),
($$Do I have to pay back a grant?$$,'agent',$$Grants generally do not need to be repaid, unlike loans, but they come with rules on how money is used and reporting.$$,NULL,'Grant-Finder',true),
($$Does the SBA give grants to start a business?$$,'agent',$$No. The SBA generally does not provide grants for starting or expanding a business; it offers loan guarantees, counseling and some specific programs (e.g. SBIR/STTR research grants).$$,$$SBA gives startup grants$$,'Grant-Finder',true),
($$Where do I search federal grants?$$,'agent',$$Grants.gov is the official site for federal grant opportunities. Should warn about scams asking for fees.$$,NULL,'Grant-Finder',true),
($$What is the maximum SBA 7(a) loan amount?$$,'agent',$$$5 million.$$,NULL,'Credit Readiness Coach',true),
($$What is the range of a FICO credit score?$$,'agent',$$300 to 850.$$,NULL,'Credit Readiness Coach',true),
($$What is a debt service coverage ratio?$$,'agent',$$DSCR = net operating income divided by total debt payments. Lenders often look for about 1.25 or higher.$$,NULL,'Credit Readiness Coach',true),
($$What does SAFE stand for in startup funding?$$,'agent',$$Simple Agreement for Future Equity, created by Y Combinator; converts to equity at a later priced round.$$,NULL,'Investor Readiness',true),
($$What's the difference between pre-money and post-money valuation?$$,'agent',$$Pre-money is value before new investment; post-money = pre-money + new investment.$$,NULL,'Investor Readiness',true),
($$Who counts as an accredited investor?$$,'agent',$$Per SEC rules: individual income over $200,000 (or $300,000 joint) in each of the last two years, or net worth over $1 million excluding primary residence, plus certain licensed professionals.$$,NULL,'Investor Readiness',true),
($$How should I reply to an angry 1-star review?$$,'agent',$$Respond calmly and promptly, thank them, apologize/acknowledge, don't argue or be defensive, offer to resolve offline with contact info, don't share private customer details.$$,NULL,'Review Manager',true),
($$Can I pay people to write good reviews for my business?$$,'agent',$$No. Fake or paid reviews are deceptive; the FTC rule on fake reviews (2024) bans buying fake reviews and can bring penalties. Ask real customers instead.$$,$$yes you can$$,'Review Manager',true),
($$Write a short thank-you reply to a 5-star review that praised our fast service.$$,'agent',$$Short, warm, specific mention of fast service, invites them back, signed by the business. 2-3 sentences.$$,NULL,'Review Manager',true),
($$What is the character limit for an Instagram caption?$$,'agent',$$2,200 characters.$$,NULL,'Content Creator',true),
($$Do I have to disclose a paid partnership in a social post?$$,'agent',$$Yes. FTC guidelines require clear disclosure of material connections, e.g. #ad or "paid partnership," placed where people will see it.$$,NULL,'Content Creator',true),
($$How much does it cost to get an EIN from the IRS?$$,'agent',$$It is free when you apply directly with the IRS (IRS.gov). Beware of sites charging fees.$$,NULL,'Compliance Officer',true),
($$What form must I complete for every new employee to verify they can work in the U.S.?$$,'agent',$$Form I-9 (Employment Eligibility Verification).$$,NULL,'Compliance Officer',true),
($$Can you give me an NDA I can use?$$,'agent',$$Can provide a general template/outline (parties, definition of confidential info, obligations, exclusions, term, remedies) but should say it is not legal advice and recommend an attorney review it.$$,NULL,'Legal Templates',true),
($$What's the difference between an employee and an independent contractor?$$,'agent',$$Depends on control over how work is done, financial control and relationship; misclassification has tax and legal penalties. IRS and Department of Labor tests apply; suggest professional advice.$$,NULL,'Legal Templates',true),
($$An item costs me $60 and I sell it for $100. What's my margin and markup?$$,'agent',$$Margin is 40% ($40/$100). Markup is about 66.7% ($40/$60).$$,NULL,'Pricing Optimizer',true),
($$What is keystone pricing?$$,'agent',$$Setting the retail price at double the wholesale cost (100% markup).$$,NULL,'Pricing Optimizer',true),
($$How do I calculate a reorder point?$$,'agent',$$Reorder point = average daily usage × lead time in days + safety stock.$$,NULL,'Inventory Manager',true),
($$What does FIFO mean for inventory?$$,'agent',$$First In, First Out: the oldest stock is sold or used first.$$,NULL,'Inventory Manager',true),
($$When are quarterly estimated tax payments due?$$,'agent',$$Generally April 15, June 15, September 15, and January 15 of the next year (shifted when on a weekend/holiday).$$,NULL,'Tax Preparer',true),
($$What is the self-employment tax rate?$$,'agent',$$15.3% (12.4% Social Security + 2.9% Medicare) on net earnings, with Social Security part up to the annual wage base.$$,NULL,'Tax Preparer',true),
($$What is sales tax economic nexus?$$,'agent',$$After the 2018 Supreme Court case South Dakota v. Wayfair, states can require out-of-state sellers to collect sales tax once they pass a sales or transaction threshold in that state, even without a physical presence.$$,NULL,'Tax Risk Strategist',true),
($$What raises the risk of an IRS audit for a small business?$$,'agent',$$Examples: unreported income, very high deductions relative to income, large cash transactions, repeated losses, round numbers, mixing personal and business expenses. Should not promise audit-proof.$$,$$audit-proof$$,'Tax Risk Strategist',true);

-- Admin-only scorecard
CREATE OR REPLACE FUNCTION public.get_agent_scorecard()
RETURNS TABLE(agent_name text, test_score int, tests_run int, last_tested timestamptz, approvals int, rejections int, handoffs int)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Administrators only'; END IF;
  RETURN QUERY
  WITH agents AS (SELECT DISTINCT c.agent_name AS a FROM kayla_benchmark_cases c WHERE c.agent_name IS NOT NULL),
  latest AS (
    SELECT r.agent_name AS a, max(r.created_at) AS t FROM kayla_benchmark_results r WHERE r.agent_name IS NOT NULL GROUP BY 1
  ),
  scores AS (
    SELECT r.agent_name AS a, round(avg(r.score))::int AS s, count(*)::int AS n, l.t
    FROM kayla_benchmark_results r JOIN latest l ON l.a = r.agent_name
    WHERE r.run_id = (SELECT r2.run_id FROM kayla_benchmark_results r2 WHERE r2.agent_name = r.agent_name ORDER BY r2.created_at DESC LIMIT 1)
    GROUP BY r.agent_name, l.t
  )
  SELECT ag.a, sc.s, coalesce(sc.n,0), sc.t,
    (SELECT count(*)::int FROM ai_agent_feedback f WHERE f.rating > 0 AND (f.agent_name = ag.a OR f.agent_name ILIKE '%'||replace(lower(split_part(ag.a,' ',1)),'-','')||'%'))
      + CASE WHEN ag.a='Review Manager' THEN (SELECT count(*)::int FROM kayla_review_drafts d WHERE d.status IN ('approved','sent','published')) ELSE 0 END,
    (SELECT count(*)::int FROM ai_agent_feedback f WHERE f.rating < 0 AND (f.agent_name = ag.a OR f.agent_name ILIKE '%'||replace(lower(split_part(ag.a,' ',1)),'-','')||'%'))
      + CASE WHEN ag.a='Review Manager' THEN (SELECT count(*)::int FROM kayla_review_drafts d WHERE d.status IN ('rejected','dismissed')) ELSE 0 END,
    (SELECT count(*)::int FROM kayla_agent_handoffs h WHERE h.from_agent = ag.a OR h.to_agent = ag.a)
  FROM agents ag LEFT JOIN scores sc ON sc.a = ag.a
  ORDER BY ag.a;
END $$;
REVOKE ALL ON FUNCTION public.get_agent_scorecard() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_agent_scorecard() TO authenticated;