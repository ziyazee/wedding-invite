# Project Overview

## What is Shaadi Invites?

Shaadi Invites is a B2B2C digital wedding invitation platform. Companies (wedding planners, card shops) sign up as clients, create personalised digital wedding invitations for their customers, and deliver them via custom subdomains on `shaadiinvites.in`.

**Domain:** `shaadiinvites.in` (production), `www.shaadiinvites.in` (landing page)

## User Roles

| Role | Access | Route |
|------|--------|-------|
| **Guest** | Views published invitations, submits RSVP | `*.shaadiinvites.in`, `/{order}/{slug}` |
| **Client (Company)** | Creates orders, manages templates, publishes invitations | `/client/dashboard` |
| **Admin** | Reviews/publishes all orders, manages companies | `/admin/dashboard` |

## Product Functionality

1. **Landing page** — Template showcase with live phone preview, template browsing/filtering
2. **Client dashboard** — Order creation workflow, template catalog, pricing, live preview, PDF import, WhatsApp sending
3. **Admin dashboard** — Cross-company order management, status workflow (Created → In Progress → Published/Rejected)
4. **Order management** — Private link for detail editing and RSVP reading after publication
5. **Public invitations** — Animated, personalized wedding invitations on custom subdomains
6. **Store landing** — Per-company branded template catalog on their subdomain
7. **RSVP** — Guest response collection tied to published orders
8. **OG image generation** — Dynamic social sharing cards per invitation

## Active Template Collection (8 designs for new orders)

| ID | Name | Type |
|----|------|------|
| 1 | Royal Grace | Native React |
| 2 | Majestic | Native React |
| 3 | A Timeless Union | Native React |
| 4 | Mandap at Dusk | Standalone page |
| 5 | Secret Garden | Native React |
| 6 | Embroidered Garden | AnimatedInvitation (iframe HTML) |
| 7 | Bloom | AnimatedInvitation (iframe HTML) |
| 8 | The Artful Love Story | Standalone page (iframe) |

Additional templates 9–14 exist for testing/iframe adapters. Legacy templates (101–117) are deprecated but routes/assets remain.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript 6, Tailwind CSS 4, Vite 8 |
| Backend | Supabase (Auth, Database, Edge Functions, RLS) |
| Local dev API | Vite plugin middleware (`server/invitations.ts`) |
| Hosting | Vercel (SPA + Edge Middleware + Edge Functions) |
| OG Images | `@vercel/og` edge function (`api/og.tsx`) |
| DNS | `*.shaadiinvites.in` wildcard subdomains |
| WhatsApp | Meta Graph API via Supabase Edge Function |
| PDF Import | Supabase Edge Functions (`extract-pdf`, `openai-extract`) |
| Drag & Drop | `@dnd-kit` (section ordering in builder) |
| Linting | `oxlint` |

## External Integrations

- **Supabase** — Auth (email/password), PostgreSQL, RLS, Edge Functions, Realtime subscriptions
- **Vercel** — Hosting, edge middleware, OG image generation, immutable asset caching
- **Meta WhatsApp Business API** — Template-based invitation delivery
- **Google Maps** — Venue links in invitations
- **Google Fonts** — Typography for site pages and legacy templates
