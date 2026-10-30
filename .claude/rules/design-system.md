---
description: Design system and styling rules
globs: src/pages/**/*.css, src/invitations/**/*.css, src/index.css
---

# Design System Rules

- Dashboard theme: sage `#354C43`, ivory `#F8F6F1`, white surfaces, champagne `#D5BD91`.
- Badge exceptions: discount = yellow `#FFDA63` dark text; premium = purple `#64349A` white text.
- Shared text reveal animation: fade in while rising from below, no character/line stagger.
- Each template has its own palette and fonts. Do not cross-contaminate template styles.
- Text fitting: Names Fit, Card Content Fit, Safe Text Area rules documented in `PROJECT_CONTEXT.md`.
- Name limits: 40 characters for templates 2, 3, 5, 6, 7. Event limits: 40/60/100 for title/venue/address.
- `InvitationViewport` wraps public invitations in a portrait frame on desktop (≥768px).
- Phone preview dimensions: 402 × 874. Preserve this aspect ratio.
