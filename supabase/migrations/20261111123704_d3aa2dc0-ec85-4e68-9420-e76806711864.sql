INSERT INTO public.kayla_improvement_proposals (question, score, grader_notes, diagnosis, proposed_rule, status) VALUES
('I want to open a food truck in Chicago. What licenses do I need?', 60,
 'Missed the health inspection, food manager certificate and Illinois sales-tax registration.',
 'Licensing answers named only the main city license and skipped the other required layers.',
 'For business license or permit questions, list every layer that usually applies — city business or vendor license, health department inspection, required safety or food-manager certificates, and state sales-tax registration — then tell the person to confirm on the official city and state websites because rules change.',
 'pending'),
('I work from home part-time and also have an office. Can I take the home office deduction?', 80,
 'Did not say W-2 employees cannot take this deduction on their federal return.',
 'Tax deduction answers explained who qualifies but not who is excluded.',
 'For tax deduction questions, always say who CANNOT take the deduction (for example, W-2 employees cannot deduct a home office on their federal return), give the main qualifying tests, and suggest confirming with a CPA or tax professional.',
 'pending'),
('What''s the difference between an employee and an independent contractor?', 88,
 'No Department of Labor test, no misclassification penalties, no suggestion to talk to a professional.',
 'Hiring and legal answers described the idea but not the official tests or the risks.',
 'For hiring, worker-classification and other legal questions, name the government tests that apply (such as the IRS and Department of Labor tests), explain the penalties for getting it wrong, and suggest checking with an employment attorney or CPA.',
 'pending'),
('Where do I search federal grants?', 90,
 'Did not warn that real grants never charge fees.',
 'Grant answers pointed to the right sites but skipped the scam warning.',
 'Whenever grants come up, include a short warning that real government grants never charge an application fee or guarantee approval, and that anyone asking for a fee is likely running a scam.',
 'pending');

UPDATE public.kayla_benchmark_cases
SET must_not_say = 'any claim that this fee-based grant is legitimate, or that paying a fee can guarantee approval (quoting or explaining the scam''s "guarantee" promise is fine)'
WHERE id = 'f30a7842-501f-4665-87f6-e18aa50049e3';