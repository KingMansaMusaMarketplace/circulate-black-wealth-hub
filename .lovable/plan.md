

# Fix: lodash/get ESM Import Error

## Problem
The app is crashing with: `The requested module '/node_modules/lodash/get.js' does not provide an export named 'default'`

This happens because **recharts** is listed in `optimizeDeps.exclude` in `vite.config.ts`, which prevents Vite from pre-bundling it. Without pre-bundling, Vite tries to load lodash's CommonJS modules as ESM, which fails.

## Solution
Two changes in `vite.config.ts`:

1. **Remove `recharts` from `optimizeDeps.exclude`** (line ~103) -- this was preventing Vite from converting lodash's CommonJS exports to ESM-compatible ones
2. **Add `recharts` and `lodash` to `optimizeDeps.include`** -- this ensures Vite properly pre-bundles them together, resolving the CJS/ESM compatibility issue

## Technical Details

**File: `vite.config.ts`**

- In the `optimizeDeps.include` array, add `'recharts'` and `'lodash'`
- In the `optimizeDeps.exclude` array, remove `'recharts'`

This is a one-file fix that will resolve the crash on the admin dashboard and any other page that loads recharts.
