# Data Flow

## Authentication Flow

```mermaid
sequenceDiagram
    User->>Login: email + password
    Login->>Supabase Auth: signInWithPassword
    Supabase Auth-->>Login: user + session
    alt Admin role
        Login->>AdminDashboard: navigate
    else Client email matches company
        Login->>Supabase: companies.select where email
        Supabase-->>Login: company record
        Login->>ClientDashboard: navigate
    else No company match
        Login->>Login: sign out + error
    end
```

## Order Creation Flow

```mermaid
sequenceDiagram
    participant C as Client Dashboard
    participant S as Supabase
    participant LS as localStorage

    C->>LS: Load saved draft (user-specific key)
    C->>S: loadTemplateCatalog()
    S-->>C: invitation_templates[]
    C->>S: companies.select (company info)
    C->>S: company_template_settings (pricing)
    
    Note over C: Step 1: Choose template
    C->>C: Select template, live preview via /client/live-preview
    
    Note over C: Step 2: Enter details
    C->>C: Groom, bride, events, venue...
    C->>LS: Autosave draft on every change
    
    Note over C: Step 3: Review
    C->>C: InvitationReview shows summary
    
    Note over C: Step 4: Submit
    C->>S: orders.insert({company_id, form_data, ...})
    S->>S: validate_order_payload trigger
    S->>S: Assign subdomain slug (slugVariants)
    S-->>C: order with published_path
    C->>LS: Clear draft
```

## Order Publishing Flow

```mermaid
sequenceDiagram
    participant AD as Admin Dashboard
    participant S as Supabase
    
    AD->>S: orders.select (realtime subscription)
    S-->>AD: order list + realtime updates
    
    Note over AD: Admin reviews order
    AD->>S: orders.update(status='READY', published_path, published_url, published_at)
    S->>S: RLS: current_user_is_admin()
    S-->>AD: updated order

    Note over AD: Client can also publish
    Note over S: client_order_publishing RPC
```

## Public Invitation Access

```mermaid
sequenceDiagram
    participant G as Guest Browser
    participant V as Vercel Edge
    participant A as React App
    participant S as Supabase

    G->>V: https://mohadrahma.shaadiinvites.in
    
    alt Social Crawler (WhatsApp, Facebook, etc.)
        V->>S: get_published_invitation('mohadrahma')
        S-->>V: {groom, bride, date}
        V-->>G: HTML with OG meta tags
    else Regular Browser
        V-->>G: index.html (SPA)
        G->>A: Boot React
        A->>A: getInviteSlug() → 'mohadrahma'
        A->>S: resolve_subdomain('mohadrahma')
        S-->>A: {type: 'invitation'}
        A->>S: get_published_invitation('mohadrahma')
        S-->>A: {slug, details, createdAt}
        A->>A: InvitationRenderer(details)
    end
```

## RSVP Submission Flow

```mermaid
sequenceDiagram
    participant G as Guest
    participant R as InvitationRsvp
    participant S as Supabase

    G->>R: Fill RSVP form
    R->>R: Generate/retrieve submission token (localStorage)
    R->>S: submit_order_rsvp RPC
    Note over S: Validates order is published<br>Token enables update-on-resubmit
    S-->>R: {saved: true}
    R->>R: Store token in localStorage
```

## Order Management Flow

```mermaid
sequenceDiagram
    participant H as Link Holder
    participant OM as OrderManagement
    participant S as Supabase

    H->>OM: /{orderId}-{16-char-code}
    OM->>S: get_order_management_data RPC
    S-->>OM: {orderId, status, details, responses[]}
    
    Note over OM: Edit details
    OM->>S: update_order_details RPC
    S-->>OM: updated
    
    Note over OM: View RSVPs
    OM->>OM: Display response list
```

## Text Editing Flow (Dashboard)

```mermaid
sequenceDiagram
    participant E as OrderTextEditor
    participant P as Phone Preview (iframe)
    participant D as Draft/Order

    E->>P: Select text in preview
    P-->>E: data-invite-text element selected
    E->>E: Show size handle, position controls
    
    Note over E: User drags/resizes
    E->>D: Update textOverrides in draft
    D->>P: Re-render with new overrides
    
    Note over E: Center snap at 8px
    E->>E: Show center guide
    
    Note over E: Undo/Redo
    E->>D: Restore previous state
```

## WhatsApp Sending Flow

```mermaid
sequenceDiagram
    participant CD as Client Dashboard
    participant S as Supabase Edge Function
    participant M as Meta Graph API

    CD->>S: send-whatsapp({orderId, phone})
    S->>M: POST /v21.0/{phone_id}/messages
    Note over M: Template: order_confirmation_v1<br>Body: couple names, URLs
    M-->>S: {message_id}
    S-->>CD: success
```

## Store Landing Flow

```mermaid
sequenceDiagram
    participant V as Visitor
    participant SR as SubdomainResolver
    participant S as Supabase
    participant SL as StoreLanding

    V->>SR: company-slug.shaadiinvites.in
    SR->>S: resolve_subdomain('company-slug')
    S-->>SR: {type: 'store'}
    SR->>SL: slug='company-slug'
    SL->>S: get_store_data RPC
    S-->>SL: {company, templates[]}
    SL->>SL: Render branded catalog
```

## Data Storage Summary

| Data | Storage | Mechanism |
|------|---------|-----------|
| Auth session | Supabase Auth | JWT tokens |
| Companies | `companies` table | RLS per company |
| Orders | `orders` table | RLS per company + admin |
| Order details | `orders.form_data` (JSONB) | Validated by trigger |
| Text overrides | `orders.form_data.textOverrides` | Version 1 schema |
| Template catalog | `invitation_templates` table | RLS read access |
| Template pricing | `company_template_settings` table | Per company |
| RSVP responses | `order_rsvps` table | Submission token |
| Draft state | `localStorage` | User-specific key |
| Published invitations | `get_published_invitation` RPC | Security definer |
| Music selection | `orders.form_data.music` | String path/URL |
| Subdomain slugs | `orders` + subdomain reservation | Unique constraint |
| Local dev invitations | `.invitation-data/invitations.json` | File-based |
