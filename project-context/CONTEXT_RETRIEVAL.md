# Context Retrieval Guide

## Task → Documentation Map

Use this guide to determine which documentation to consult based on the task at hand. Read only what's needed — don't load everything.

---

### Dashboard UI Change
**Read:**
1. `FILE_SYSTEM.md` → locate the file
2. `COMPONENT_MAP.md` → understand component hierarchy
3. `DESIGN_SYSTEM.md` → colors, spacing, typography tokens
4. `src/pages/ClientDashboard.css` → centralized theme tokens

**Inspect source:** `src/pages/ClientDashboard.tsx` (large file — read targeted sections only)

---

### Invitation Rendering Issue
**Read:**
1. `TEMPLATE_ARCHITECTURE.md` → understand template types and rendering flow
2. `ARCHITECTURE.md` → template rendering section
3. `DATA_FLOW.md` → invitation rendering flow

**Inspect source:** `src/invitations/InvitationRenderer.tsx`, then the specific template component

---

### Template Styling Change
**Read:**
1. `TEMPLATE_ARCHITECTURE.md` → template type and asset location
2. `FILE_SYSTEM.md` → locate template files
3. `DESIGN_SYSTEM.md` → animation principles, text fitting rules
4. `PROJECT_CONTEXT.md` → design decisions for that specific template

**Inspect source:** Template's CSS file and component, `public/templates/{name}/`

---

### Database / Supabase Issue
**Read:**
1. `DATABASE_SCHEMA.md` → table structure, RLS, RPCs
2. `DATA_FLOW.md` → which flow uses which table
3. `DEPLOYMENT.md` → migration order and application status

**Inspect source:** Relevant migration file, `src/lib/supabase.ts`

---

### Authentication / Authorization Issue
**Read:**
1. `ARCHITECTURE.md` → auth section
2. `DATABASE_SCHEMA.md` → RLS policies, helper functions
3. `ROUTING.md` → auth guards
4. `DATA_FLOW.md` → authentication flow

**Inspect source:** `src/pages/DashboardAccess.tsx`, `src/pages/Login.tsx`

---

### Routing Change
**Read:**
1. `ROUTING.md` → complete route table
2. `ARCHITECTURE.md` → subdomain resolution

**Inspect source:** `src/App.tsx`, `vercel.json`

---

### New Template Creation
**Read:**
1. `TEMPLATE_ARCHITECTURE.md` → component contract, registration steps, migration strategy
2. `COMPONENT_MAP.md` → shared template components
3. `FILE_SYSTEM.md` → where to place files
4. `DATABASE_SCHEMA.md` → invitation_templates table

**Inspect source:** An existing native template (e.g., `src/pages/majestic/`) as reference

---

### Template Migration (iframe → React)
**Read:**
1. `TEMPLATE_ARCHITECTURE.md` → migration checklist
2. Root `TEMPLATE_ARCHITECTURE.md` → component contract and verification gate
3. `COMPONENT_MAP.md` → shared components
4. `DEPENDENCY_MAP.md` → what depends on the template

**Inspect source:** Template's current implementation, `src/invitations/legacyTextAdapters.ts` for existing text IDs

---

### Text Editing / Override Issue
**Read:**
1. `TEMPLATE_ARCHITECTURE.md` → text override system
2. `DATABASE_SCHEMA.md` → form_data.textOverrides structure
3. `DEPENDENCY_MAP.md` → textLayout imports

**Inspect source:** `src/invitations/textLayout.ts`, `src/invitations/TextLayoutLayer.tsx`, `src/invitations/legacyTextAdapters.ts`

---

### Performance Issue
**Read:**
1. `PERFORMANCE_GUIDELINES.md` → known bottlenecks, optimization patterns
2. `ARCHITECTURE.md` → code splitting boundaries
3. `DEPENDENCY_MAP.md` → critical file impact

---

### Order Workflow Issue
**Read:**
1. `DATA_FLOW.md` → order creation, publishing, management flows
2. `DATABASE_SCHEMA.md` → orders table, status constraints, RPCs

**Inspect source:** `src/pages/ClientDashboard.tsx`, `src/pages/AdminDashboard.tsx`, `src/pages/OrderManagement.tsx`

---

### RSVP Issue
**Read:**
1. `DATA_FLOW.md` → RSVP submission flow
2. `DATABASE_SCHEMA.md` → order_rsvps table

**Inspect source:** `src/invitations/rsvp.ts`, `src/invitations/components/InvitationRsvp.tsx`

---

### Deployment / DNS / Domain Issue
**Read:**
1. `DEPLOYMENT.md` → full deployment setup
2. `ROUTING.md` → subdomain handling

**Inspect source:** `vercel.json`, `middleware.ts`

---

### Bug Fix (Simple)
**Read:**
1. `FILE_SYSTEM.md` → locate the relevant file
2. Only the specific source file

**Do not read:** Architecture docs, dependency maps, or unrelated modules

---

### Design Rule Application
**Read:**
1. `PROJECT_CONTEXT.md` → design rules table and template-specific decisions

**Inspect source:** The specific template's component and fitting hooks (e.g., `useMajesticFit.ts`)

---

## Complexity Classification

### SIMPLE (1–3 files, no architectural impact)
- Text/styling change
- Minor bug fix
- Single component update

**Context needed:** FILE_SYSTEM.md → locate file → read source → edit

### MEDIUM (3–8 files, single feature)
- Component behavior change
- API integration
- Business logic modification
- Form change

**Context needed:** FILE_SYSTEM.md + relevant architecture doc + source files + dependencies

### COMPLEX (8+ files, cross-cutting)
- Architecture change
- Template system modification
- Auth/routing changes
- Database schema changes
- Performance optimization

**Context needed:** Multiple architecture docs + DEPENDENCY_MAP.md + affected source files + verification plan
