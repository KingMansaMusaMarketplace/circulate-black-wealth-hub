## The problem

Your admin sidebar has two user lists, and they show different things:

- **Users & Access → User Management** (the one you're probably looking at) shows each person's **account type** (customer / business / sales agent) but does **not** show their **permission role** (admin, moderator, etc.).
- **Users & Access → Admin Roles** shows who is an admin, but it's a separate screen.

So if you're looking at the main user list, there's no way to tell "is this person also an admin?" without hopping to a different page.

Plain-English distinction:
- **Account type** = what kind of user they signed up as (customer, business owner, sales agent).
- **Role** = what powers they have inside the platform (admin, moderator, regular user). Roles live in a separate, locked-down table for security — that's why they're not auto-shown.

Right now your database has **1 admin** and **43 regular customers**, so the role info exists — it's just not surfaced on the main screen.

## The fix

Add a new **"Role"** column to the User Management table, right next to the existing "Type" column.

- For admins/moderators: show a colored badge (gold for admin, blue for moderator).
- For everyone else: show a subtle gray "—" (no special role).
- Add a filter dropdown so you can quickly show "Admins only" or "Moderators only".
- Keep the existing Account Type column unchanged.

## Where this happens

One file changes: `src/components/admin/UserManagement.tsx`. It will pull the list of roles from the `user_roles` table once when the page loads, then merge that data into each row.

## What you'll see after

A new column in the User Management table:

```text
Name          Email                Type        Role        Status     Joined
─────────────────────────────────────────────────────────────────────────────
Lisa Cooper   lcooper8@yahoo.com   customer    —           active     Apr 14
You           contact@mansa…       business    ADMIN       active     ...
```

## Out of scope

- I won't touch the existing **Admin Roles** management screen — that stays as the place to grant/revoke admin powers.
- I won't change how account types work.
- No database changes needed.
