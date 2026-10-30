---
description: Rules for invitation template development and migration
globs: src/invitations/**/*.ts, src/invitations/**/*.tsx, src/invitations/**/*.css, src/pages/majestic/**/*.*, src/pages/secret-garden/**/*.*, src/pages/a-timeless-union/**/*.*
---

# Template Rules

- Three template types exist: Native React, AnimatedInvitation (DOM personalization), OrderFrameInvitation (iframe adapter). See `project-context/TEMPLATE_ARCHITECTURE.md`.
- Native templates use shared components: `InvitationLayoutProvider`, `InvitationSection`, `EditableText`, `InvitationMedia` from `src/invitations/components/`.
- Preserve text IDs (`t{templateId}.{section}.{field}`) — existing saved orders depend on them.
- Event IDs use persisted celebration IDs or original-index fallbacks. Do not generate IDs from dates/position/DOM indexes.
- Text overrides are in `orders.form_data.textOverrides` (version 1). fontSize: 8–160 CSS px, x/y: -1 to 1 section fractions.
- Template CSS must be scoped (no global leaks). Use namespaced prefixes.
- `InvitationRenderer.tsx` is the template router. Changes affect ALL published invitations.
- Design rules (Names Fit, Card Content Fit, etc.) are documented in `PROJECT_CONTEXT.md`. Apply them when requested by name.
- Deprecated templates keep their routes and assets. Do not remove them unless explicitly requested.
- The `designs[]` array in `model.ts`, the `invitation_templates` table, and `InvitationRenderer` must stay in sync.
