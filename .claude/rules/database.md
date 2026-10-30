---
description: Rules for database schema and Supabase integration
globs: supabase/**/*.sql, src/lib/supabase.ts, server/**/*.ts
---

# Database Rules

- All database operations go through the Supabase client in `src/lib/supabase.ts`.
- Guard all Supabase calls with `isSupabaseConfigured` check — the app must work without Supabase locally.
- RLS is enabled on all tables. New tables MUST have RLS policies.
- The `validate_order_payload` trigger validates order form_data on insert/update. Changes to the InvitationData shape may require a trigger update.
- `get_published_invitation` is a security definer function accessible to anon. Do not add auth checks inside it.
- Migrations are sequential — check `project-context/DEPLOYMENT.md` for dependencies.
- Many migrations are prepared but NOT applied. Do not assume database features work without verification.
- Never expose environment variable values. Use names only in documentation.
