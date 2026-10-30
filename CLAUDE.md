# Shaadi Invites — Claude Code Instructions

## Before starting any task

1. Read this file first.
2. Check `AGENTS.md` for workflow rules (no shell commands, no builds, no commits unless requested).
3. Consult `project-context/CONTEXT_RETRIEVAL.md` to identify which docs to read for this task type.
4. Read `PROJECT_CONTEXT.md` for current design decisions and template-specific rules.

## Project knowledge base

Architecture documentation lives in `project-context/`:

| Document | When to read |
|----------|-------------|
| `PROJECT_OVERVIEW.md` | Product understanding, user roles, tech stack |
| `ARCHITECTURE.md` | System architecture, rendering flow, auth |
| `FILE_SYSTEM.md` | Locating files by purpose |
| `COMPONENT_MAP.md` | Component hierarchy, parent-child relationships |
| `DATA_FLOW.md` | Business flows, sequence diagrams |
| `DATABASE_SCHEMA.md` | Tables, columns, RLS, RPCs |
| `ROUTING.md` | All routes, guards, subdomain handling |
| `DESIGN_SYSTEM.md` | Colors, typography, spacing, animation |
| `TEMPLATE_ARCHITECTURE.md` | Template types, registration, text overrides, migration |
| `PERFORMANCE_GUIDELINES.md` | Code splitting, caching, known bottlenecks |
| `DEPLOYMENT.md` | Vercel, Supabase, DNS, environment variables |
| `KNOWN_ISSUES.md` | Technical debt, legacy code, risky areas |
| `DEPENDENCY_MAP.md` | File import relationships, high-impact files |
| `CONTEXT_RETRIEVAL.md` | Which docs to read for which task type |

**Do not read all docs for every task.** Use the retrieval guide.

## Task complexity

### SIMPLE (text, styling, minor fix)
Read `FILE_SYSTEM.md` → locate file → read source → patch. Do not explore architecture docs.

### MEDIUM (component change, API integration, business logic)
Read relevant architecture doc + source files + immediate dependencies. Check `DEPENDENCY_MAP.md` if the file is flagged as high-impact.

### COMPLEX (architecture, template system, auth, schema)
Read multiple architecture docs + `DEPENDENCY_MAP.md` + affected sources. Plan before implementing.

## Critical rules

- **Do not modify** `src/invitations/model.ts`, `src/App.tsx`, `src/lib/supabase.ts`, or `middleware.ts` without understanding downstream impact. Check `DEPENDENCY_MAP.md`.
- **Preserve text IDs** (`t{id}.{section}.{field}`) when modifying templates — existing saved orders depend on them.
- **Preserve existing routes** — published invitation URLs must not break.
- **Preserve template assets** — do not delete or rename files in `public/templates/` without explicit request.
- **Landing CSS** has successive responsive overrides. Check the final applicable rules before changing a value.
- **ClientDashboard.tsx** is very large. Read only the relevant section, not the entire file.
- **Deprecated templates** keep their routes and assets. Do not offer them for new orders.
- **Many migrations are unapplied.** Check `DEPLOYMENT.md` for status before assuming database features work.

## Search strategy

- Use `FILE_SYSTEM.md` to locate files before searching the codebase.
- Use targeted grep for specific symbols or imports.
- Do not recursively read the entire `src/` directory.
- Do not inspect `node_modules`, `dist`, `build`, or large asset files.
- For template assets, check `public/templates/{template-name}/`.

## What to update when

- **Changed a design rule or template decision →** Update `PROJECT_CONTEXT.md`
- **Changed architecture or component relationships →** Update relevant `project-context/` doc
- **Added/removed a route →** Update `project-context/ROUTING.md`
- **Changed database schema →** Update `project-context/DATABASE_SCHEMA.md`
- **Changed template registration →** Update `project-context/TEMPLATE_ARCHITECTURE.md`
