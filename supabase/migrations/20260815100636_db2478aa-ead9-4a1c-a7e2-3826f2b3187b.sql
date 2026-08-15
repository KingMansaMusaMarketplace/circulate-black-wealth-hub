WITH found(name_pat, ph) AS (VALUES
 ('%Black Entrepreneurs NYC%','(888) 727-4692'),
 ('%Brooklyn / Black Entrepreneurs%','(888) 727-4692'),
 ('Cocoapreneur','(412) 533-2318'),
 ('Columbus Black','(706) 507-3466'),
 ('Mercatus%','(503) 823-3200'),
 ('Support Black Owned%','(786) 254-6744'),
 ('The Pop-Up Makeke%','(202) 463-8722'),
 ('WV Black Chamber of Commerce','(202) 463-8722'),
 ('Atlanta Black Owned%','(470) 238-8087'),
 ('Inglewood Chamber%','(310) 677-1121'),
 ('Dayton African American Chamber','(937) 222-8406'),
 ('NWI Black Chamber of Commerce','(219) 980-8422'),
 ('Black Business Alliance Peoria','(309) 966-3989'),
 ('Charlotte Metrolina Black Chamber','(704) 212-2032'),
 ('DC Black Chamber of Commerce','(202) 709-6582'),
 ('First Coast Black Chamber','(904) 371-1979'),
 ('Greater Augusta Black Chamber','(706) 310-8425'),
 ('Greater Southwest Louisiana Black Chamber','(337) 382-3664'),
 ('Idaho Black Community Alliance','(208) 918-2518'),
 ('Mobile Area Black Chamber','(251) 591-0306'),
 ('Progressive Independence (OKC)','(405) 595-4874'),
 ('Shreveport Black Chamber','(318) 220-9098'),
 ('Upstate NY Black Chamber','(518) 801-8881'),
 ('Vermont Professionals of Color','(802) 391-9988'),
 ('Miami-Dade Chamber of Commerce','(305) 751-8648')
)
UPDATE public.outreach_targets t
SET phone = f.ph, updated_at = now()
FROM found f
WHERE (t.phone IS NULL OR t.phone = '')
  AND t.directory_name ILIKE f.name_pat;