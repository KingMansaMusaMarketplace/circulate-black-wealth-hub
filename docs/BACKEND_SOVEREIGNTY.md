# Backend Sovereignty — 1325.AI Platform

## Plain-English summary

The **1325.AI** application has two main parts:

1. **Frontend:** The public website and dashboard that users see. Built in the Lovable editor with React and Tailwind CSS.
2. **Backend:** All user data, business records, transactions, authentication, storage, and business logic live in a separate **Supabase** project that 1325.AI owns and controls.

**Lovable does not host your users, your data, or your transactions.** Lovable only hosts the frontend code and the visual editor used to build it.

## Where the backend lives

- **Supabase project:** `agoclnqfyinwjxdmjnns`
- **Supabase region:** Managed by Supabase (not Lovable)
- **Database:** PostgreSQL under the `public` schema, owned by the Supabase project
- **Authentication:** Supabase Auth (email, magic links, social providers, JWTs)
- **Storage:** Supabase Storage for images, documents, and other files
- **Edge functions:** Supabase Edge Functions (Deno) for server-side logic, payments, AI integrations, and webhooks
- **Secrets:** Stripe keys, AI-provider keys, service-role keys, and other credentials are stored in Supabase secrets / Lovable Cloud secrets, not in the frontend code

## What Lovable can see

Lovable can see:
- Frontend source code (`src/`, `public/`, `index.html`, etc.)
- Build configuration (`vite.config.ts`, `package.json`, etc.)
- Documents and files stored inside the project (`docs/`, generated PDFs, etc.)
- Prompts and edits made in the Lovable editor

Lovable cannot see:
- Live user data in the Supabase database
- Live production traffic or transactions
- Supabase service-role credentials
- Stripe account data or payouts
- The contents of Supabase storage buckets

## What the IP risk is

The IP risk you are managing is on the **Lovable side** of the wall: the source code, patent documents, and business logic that pass through the Lovable editor. On the **Business plan or higher**, Lovable excludes workspace data from AI model training by default. This is the primary control you want.

## How the app keeps data safe

- **Row Level Security (RLS):** Every production table has RLS policies that restrict what each user can read or write.
- **Security definer functions:** Admin-only functions are protected by role checks and role-specific grants.
- **Service role key:** The service role key is only used inside Supabase Edge Functions and is never shipped to the browser.
- **No raw SQL from the frontend:** The frontend uses Supabase client SDK calls, not direct database access.

## Why this matters for investors and partners

When someone asks, "Where is my data stored?" the answer is: **Supabase, in a project owned by 1325.AI**. Lovable is the website builder, not the data host. This is a deliberate architecture choice that keeps customer and business data out of the app-building platform.

## If you leave Lovable

Because the backend is in Supabase, you can migrate the frontend to another host (e.g., Vercel, Netlify, or a private repo) without moving user data. The database, auth, storage, and edge functions would stay with Supabase until you decide to migrate them separately.

## Last reviewed

- **Document created:** August 2026
- **Supabase project:** `agoclnqfyinwjxdmjnns`
- **Frontend host:** Lovable (currently public; to be set to private after Business upgrade)
