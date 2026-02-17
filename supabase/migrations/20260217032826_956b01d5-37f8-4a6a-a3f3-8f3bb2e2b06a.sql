
-- Standardize duplicate banking categories
UPDATE businesses SET category = 'Banking & Financial Services' WHERE category IN ('Bank', 'Banking', 'Banking and Financial Services', 'Commercial Bank');

-- Standardize consulting
UPDATE businesses SET category = 'Consulting Services' WHERE category = 'Consulting';

-- Standardize education
UPDATE businesses SET category = 'Education & Training' WHERE category IN ('Education', 'Educational Institution', 'Educational Services');

-- Fix trailing space in Entertainment
UPDATE businesses SET category = 'Entertainment & Arts' WHERE TRIM(category) = 'Entertainment';

-- Standardize marketing
UPDATE businesses SET category = 'Marketing Agency' WHERE category = 'Marketing and Creative Agency';
