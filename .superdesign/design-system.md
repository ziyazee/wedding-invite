# Shaadi Invites — Dashboard Design System

## Brand Identity
- **Product**: Shaadi Invites — premium wedding invitation SaaS platform
- **Audience**: Wedding planners, event companies, and couples in India
- **Personality**: Refined, trustworthy, celebratory but not flashy

## Color Palette

### Primary
- Sage (primary brand): `#354C43`
- Sage hover: `#293D35`
- Sage light: `#4D6B5E`

### Neutrals
- Ink (primary text): `#252B29`
- Secondary text: `#5C6660`
- Muted text: `#737A74`
- Border: `#E7E3DA`
- Selected/hover bg: `#F0F3EE`
- Page background (ivory): `#F8F6F1`
- Surface (cards): `#FFFFFF`

### Accent
- Champagne: `#D5BD91`
- Champagne light: `#F5EFE3`

### Semantic
- Success: `#365F46` / bg `#EAF1E9`
- Danger: `#88483F` / bg `#F6ECE8`
- Warning: `#B8860B` / bg `#FDF6E3`

### Special badges
- Discount: `#FFDA63` background, dark text
- Premium: `#64349A` background, white text

## Typography

### Font Stack
- **UI**: `Inter, -apple-system, sans-serif`
- **Display**: `Georgia, serif` (used sparingly for overview headings)

### Type Scale
- xs: 11px
- sm: 13px
- base: 14px
- lg: 16px
- xl: 18px
- 2xl: 22px
- 3xl: 28px
- 4xl: 36px

### Weights
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

## Spacing (4px base)
- 1: 4px
- 2: 8px
- 3: 12px
- 4: 16px
- 5: 20px
- 6: 24px
- 8: 32px
- 10: 40px
- 12: 48px

## Border Radius
- sm: 4px
- default: 6px
- md: 8px
- lg: 10px
- xl: 12px
- full: 999px (pills/badges)

## Shadows
- xs: `0 1px 2px rgba(0,0,0,0.04)`
- sm: `0 1px 3px rgba(0,0,0,0.06)`
- md: `0 4px 12px rgba(0,0,0,0.06)`
- lg: `0 8px 24px rgba(0,0,0,0.08)` (modals)

## Component Patterns

### Buttons
- Primary: sage bg, white text, 6px radius, 40px height
- Secondary: white bg, sage text, border, 6px radius
- Danger: light red bg, red text, border

### Inputs
- Height: 40px (desktop), 44px (mobile for iOS zoom prevention)
- Border: 1px solid border color
- Radius: 6px
- Focus: sage border + 2px sage ring at 10% opacity

### Cards
- White background, 1px border, 6-10px radius
- xs shadow on rest, sm on hover
- No decorative gradients

### Tables
- Sticky header with ivory background
- 48px row height
- 1px border between rows
- Status pills: full radius, semantic colors

### Status Pills
- New/Created: champagne bg, gold text
- In Progress: sage-light bg, sage text
- Published/Ready: success bg, success text
- Rejected: danger bg, danger text

## Layout

### Dashboard Grid
- Sidebar: 206px fixed width
- Topbar: 56px height
- Main content: fluid
- Preview panel (templates tab): 376px

### Responsive Breakpoints
- Mobile: ≤760px (sidebar becomes horizontal tabs)
- Tablet: 761px–1024px
- Desktop: ≥1025px
- Wide: ≥1250px

## Design Direction for Redesign
- Inspired by Linear, Stripe, Vercel quality
- Clean, professional, excellent visual hierarchy
- No AI-aesthetic defaults (no purple gradients, no oversized cards, no stock layouts)
- Content-first: artwork and data are the heroes
- Subtle transitions (120-150ms)
- Consistent spacing using the 4px scale
- Inter for everything except occasional Georgia display headings
