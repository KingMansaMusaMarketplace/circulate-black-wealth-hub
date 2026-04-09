
-- Step 1: Delete duplicate businesses, keeping the "best" one per business_name
-- Best = is_verified DESC, review_count DESC, created_at ASC (earliest)
WITH ranked AS (
  SELECT id,
    ROW_NUMBER() OVER (
      PARTITION BY business_name 
      ORDER BY is_verified DESC, review_count DESC NULLS LAST, created_at ASC
    ) AS rn
  FROM businesses
),
duplicates AS (
  SELECT id FROM ranked WHERE rn > 1
)
DELETE FROM businesses WHERE id IN (SELECT id FROM duplicates);
