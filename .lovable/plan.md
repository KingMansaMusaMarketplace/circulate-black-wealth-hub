

## Problem

The database contains two category variants: **`Restaurant`** (7 businesses) and **`Restaurants`** (2 businesses, plural). These show as separate filter tabs in the directory.

## Fix

1. **Database migration**: Update the 2 businesses with category `Restaurants` to use `Restaurant` (singular), standardizing on the singular form consistent with other categories like `Barbershop`, `Hair Salon`, etc.

2. **Sample data cleanup**: Update `src/data/businesses/restaurants.ts` to use `Restaurant` instead of `Restaurants` for the `category` field on the two sample records.

This is a one-migration + one-file fix that eliminates the duplicate tab.

