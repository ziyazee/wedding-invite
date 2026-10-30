# Component Map

## Application Shell

```
App.tsx
├── InvitationViewport (desktop portrait frame wrapper)
├── SubdomainResolver (subdomain → store or invitation)
│   ├── StoreLanding (company catalog)
│   └── GeneratedInvitation (published invitation)
├── Landing (template showcase)
├── Login (authentication)
├── ClientDashboard (client workspace)
│   ├── DashboardAccess (auth guard, role=CLIENT)
│   ├── OrderTextEditor [lazy] (text selection/editing)
│   ├── InvitationReview (order review step)
│   ├── MusicPicker (song selection)
│   └── PhonePreviewResize (preview resize handle)
├── AdminDashboard (admin workspace)
│   └── DashboardAccess (auth guard, role=ADMIN)
├── OrderManagement (private management link)
├── ClientLivePreview (live preview for dashboard/management)
├── GeneratedInvitation (public invitation page)
│   └── InvitationRenderer (template routing)
└── [Template routes] (20+ lazy-loaded pages)
```

## Invitation Rendering

```
InvitationRenderer
├── InvitationContext.Provider (passes InvitationData)
├── renderTemplate()
│   ├── Majestic (template=2, native)
│   │   └── InvitationLayoutProvider > InvitationSection > EditableText
│   ├── SecretGarden (template=5, native)
│   │   ├── PearlClock (countdown)
│   │   └── InvitationLayoutProvider > InvitationSection > EditableText
│   ├── MohadRahma (template=1, standalone)
│   ├── OrderFrameInvitation (templates 9-14)
│   │   └── TextLayoutLayer (legacy text adapters)
│   ├── AnimatedInvitation (templates 6-7)
│   │   └── TextLayoutLayer (text overlays)
│   ├── PageComponent (templates 3,4,8)
│   │   └── TextLayoutLayer + SiteFonts
│   └── DeprecatedComponent (templates 101-117)
│       └── TextLayoutLayer + SiteFonts
└── DesignedByFooter
```

## Shared Native Template Components (`src/invitations/components/`)

| Component | Source | Responsibility |
|-----------|--------|---------------|
| `InvitationLayoutProvider` | `EditableText.tsx` | Validates versioned text overrides, provides layout context |
| `InvitationSection` | `InvitationSection.tsx` | Section wrapper with ResizeObserver for child positioning |
| `EditableText` | `EditableText.tsx` | Renders text tag with CSS variable overrides for size/position/font/color |
| `InvitationMedia` | image/video props | Priority hints, lazy loading, metadata preload for video |
| `InvitationRsvp` | envelope artwork, rsvp target | RSVP envelope form with animation |
| `DesignedByFooter` | — | Branding footer |

## Template-Specific Components

### A Timeless Union (`src/pages/a-timeless-union/`)

| Component | Purpose |
|-----------|---------|
| `Design14Scenes.tsx` | Scene markup (opening, welcome, celebrations, closing) |
| `ReferenceScenes.tsx` | Original Arjun & Bhavana scenes (standalone route) |
| `TimelessRules.tsx` / `.css` | Personalized order rule application |
| `CelebrationsEmbed.tsx` | Embeddable celebrations carousel (used by Design 13) |
| `useDesign14Motion.ts` | Parallax and scroll animation hooks |
| `useDesign14TextMotion.ts` | Text reveal animations |
| `useDesign14Carousel.ts` | Celebration carousel logic |

### Majestic (`src/pages/majestic/`)

| Component | Purpose |
|-----------|---------|
| `Majestic.tsx` | Full native React implementation |
| `Majestic.css` | Scoped styles, local fonts, artwork |
| `useMajesticFit.ts` | Names fitting (8-char threshold, 1%/char reduction) |
| `defaultLayout.ts` | Default text layout positions |

### Secret Garden (`src/pages/secret-garden/`)

| Component | Purpose |
|-----------|---------|
| `SecretGarden.tsx` | Full native React implementation |
| `SecretGarden.css` | Scoped styles |
| `PearlClock.tsx` | Analog clock countdown with pearl border |
| `useSecretGardenFit.ts` | Names fitting |

## Legacy Components (`src/components/`)

These are from the original create flow and are **not used by the current dashboard**.

| Directory | Components | Status |
|-----------|-----------|--------|
| `ui/` | Button, Card, Input, Textarea, LoadingSpinner, StepIndicator | Legacy |
| `steps/` | BuilderStep, DetailsForm, EventTypeStep, TemplatePicker | Legacy |
| `builder/` | SortableSection, SortableSectionList | Legacy |
| `templates/` | ClassicElegant, FloralGarden, ModernMinimal, TemplateRenderer | Legacy |
| `templates/sacred-garden/` | SacredGarden, CountdownTimer, RsvpForm, etc. | Legacy |

## Feature-Specific Components

| Component | Used By | Purpose |
|-----------|---------|---------|
| `MusicPicker` | ClientDashboard, OrderManagement | Song selection with preview |
| `InvitationReview` | ClientDashboard | Order detail review before submission |
| `CopyLinkButton` | ClientDashboard | Clipboard copy utility |
| `PhonePreviewResize` | ClientDashboard | Preview resize drag handle |
| `OrderTextEditor` | ClientDashboard [lazy] | Text selection/editing in phone preview |
| `HeartDateReveal` | Mandap at Dusk | Scratch-to-reveal date animation |
