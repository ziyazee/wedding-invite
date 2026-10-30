# Template Architecture

## Template Categories

### 1. Native React Templates (Target Architecture)

Templates that use shared components from `src/invitations/components/`:

| ID | Template | Entry | Status |
|----|----------|-------|--------|
| 1 | Royal Grace | `src/pages/MohadRahma.tsx` | Migrated, verification pending |
| 2 | Majestic | `src/pages/majestic/Majestic.tsx` | Migrated, verification pending |
| 5 | Secret Garden | `src/pages/secret-garden/SecretGarden.tsx` | Migrated |

**Component contract:**
```tsx
<InvitationLayoutProvider layout={details.textOverrides}>
  <InvitationSection data-invite-section="section-name">
    <EditableText as="h2" textId="t{id}.section.field" label="Field · section">
      {text}
    </EditableText>
    <InvitationMedia src="..." priority />
  </InvitationSection>
</InvitationLayoutProvider>
```

### 2. AnimatedInvitation Templates (DOM Personalization)

Templates loaded as HTML and personalized via JavaScript DOM manipulation:

| ID | Template | HTML Source |
|----|----------|------------|
| 6 | Embroidered Garden | `public/templates/embroidered-garden/index.html` |
| 7 | Bloom | `public/templates/bloom/index.html` |

**Flow:** Fetch HTML → DOMParser → Replace names/dates → Inject into iframe → `TextLayoutLayer` for editing

### 3. OrderFrameInvitation Templates (Iframe Adapters)

Same-origin iframe with order personalization via `orderFrameAdapter.ts`:

| ID | Template | HTML Source |
|----|----------|------------|
| 9 | Maroon Letter | `public/templates/maroon-letter/index.html` |
| 10 | Emerald Parchment | `public/templates/emerald-parchment/index.html` |
| 11 | Royal Jodhpur | `public/templates/shaadipath-t02/index.html` |
| 12 | Destination Wedding | `public/templates/destination-wedding/index.html` |
| 13 | Raabta | `public/templates/raabta/index.html` |
| 14 | Qubool | `public/templates/qubool/index.html` |

### 4. Standalone Page Components

| ID | Template | Component |
|----|----------|-----------|
| 3 | A Timeless Union | `src/pages/ATimelessUnion.tsx` → `a-timeless-union/` |
| 4 | Mandap at Dusk | `src/pages/MandapAtDusk.tsx` |
| 8 | The Artful Love Story | `src/pages/ArtfulLoveStory.tsx` |

## Template Registration

### Code Registration (`model.ts`)
The `designs[]` array in `src/invitations/model.ts` defines all 14 templates with ID, name, description, route, image, and color.

### Database Registration (`invitation_templates`)
Supabase table stores template catalog with `id`, `template_code`, `name`, `category`, `thumbnail_url`, `preview_url`, `is_active`.

### Renderer Registration (`InvitationRenderer.tsx`)
The `templateComponent` map and `renderTemplate()` function route template IDs to their component implementations.

## Template Data Flow

```
Order form_data (InvitationData)
  → InvitationRenderer
    → Template Component
      ├── Native: props.details → React components
      ├── AnimatedInvitation: DOM text replacement + personalize functions
      └── OrderFrameInvitation: orderFrameAdapter → iframe postMessage
```

## Text Override System

### ID Convention
```
t{template_id}.{section}.{field}
t{template_id}.event-{event_id}.{field}
```

Examples: `t1.opening.groom`, `t2.welcome.bride`, `t1.event-wedding.title`

### Storage
```json
{
  "version": 1,
  "elements": {
    "t1.opening.groom": { "fontSize": 60, "x": 0.02, "y": -0.03 }
  }
}
```

Stored in `orders.form_data.textOverrides`. Values: fontSize (8–160 CSS px), x/y (-1 to 1, section fraction offsets).

### Editing Pathway
- **Native templates**: `EditableText` component reads CSS variables from `InvitationLayoutProvider`
- **Iframe templates**: `TextLayoutLayer` + `legacyTextAdapters.ts` map DOM elements to semantic IDs

## Template Asset Structure

Each template has assets under `public/templates/{name}/`:
```
public/templates/
├── royal-grace/           # Template 1 assets
├── majestic/assets/       # Template 2 assets
├── a-timeless-union/      # Template 3 assets
├── mandap-at-dusk/        # Template 4 assets
├── secret-garden/assets/  # Template 5 assets
├── embroidered-garden/    # Template 6 (HTML + assets)
│   └── index.html         # AnimatedInvitation source
├── bloom/                 # Template 7 (HTML + assets)
│   └── index.html         # AnimatedInvitation source
├── the-artful-love-story/ # Template 8 assets
├── maroon-letter/         # Template 9 (HTML + assets)
├── emerald-parchment/     # Template 10 (HTML + assets)
├── shaadipath-t02/        # Template 11 (HTML + assets)
├── destination-wedding/   # Template 12 (HTML + assets)
├── raabta/                # Template 13 (HTML + assets)
├── qubool/                # Template 14 (HTML + assets)
└── deprecated/            # Legacy template assets
```

## How to Add a New Template

1. **Choose implementation type**: Native React (preferred) or iframe adapter
2. **Create assets**: Place in `public/templates/{template-name}/`
3. **Register in model**: Add entry to `designs[]` in `src/invitations/model.ts`
4. **Create component**: Implement page component in `src/pages/`
5. **Register route**: Add lazy import and `<Route>` in `src/App.tsx`
6. **Register renderer**: Add to `templateComponent` map or `renderTemplate()` in `InvitationRenderer.tsx`
7. **Add sample data**: Add example in `src/invitations/templateData.ts`
8. **Database migration**: Insert row in `invitation_templates`
9. **Text adapters**: If iframe-based, add mappings in `legacyTextAdapters.ts`
10. **Apply design rules**: Implement Names Fit, Card Content Fit, etc. as needed

## Migration Strategy (iframe → Native React)

Status: Royal Grace and Majestic migrated; 9 templates remain.

Migration checklist per template:
- Create `src/pages/{name}/` directory
- Use `InvitationLayoutProvider`, `InvitationSection`, `EditableText`, `InvitationMedia`
- Preserve existing text IDs (`t{id}.*`)
- Preserve existing event IDs
- Keep backward compatibility with version-1 textOverrides
- Scoped CSS (no global style leaks)
- Own font loading (bypass SiteFonts)
- Native `InvitationRsvp` component
- Visual parity verification before deploying
