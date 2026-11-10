# Order Form — Full Reference

Everything a developer needs to understand the invitation order creation flow without reading the source code.

---

## Files involved

| File | Role |
|------|------|
| `src/pages/ClientDashboard.tsx` | Main container — all form state, submission logic, fieldset JSX for steps 1–3 |
| `src/pages/ClientDashboard.css` | All layout and visual CSS for the form, header, celebration cards, progress bar |
| `src/pages/OrderProgressBar.tsx` | Step indicator component (`STEPS` array, dot/connector render) |
| `src/pages/OrderProgressBar.css` | Progress bar sizing, dot/connector colours, active/completed states |
| `src/pages/OrderPreviewStep.tsx` | Step 5 (Personal touches) — music, event locations, dress code, short note, footer illustration |
| `src/pages/OrderPreviewStep.css` | Styles for OrderPreviewStep |
| `src/invitations/model.ts` | `InvitationData` type, `validateDetails()`, `Celebration` type |

---

## Layout overview

The workspace is a **3-column CSS grid**:
- Column 1 (206 px): sidebar navigation
- Column 2 (1fr): `workspace-main` — the form lives here
- Column 3 (376 px): `client-preview-panel` — the phone preview (always visible beside the form)

Inside `workspace-main` there is a 2-column sub-grid (`minmax(0, 1.2fr) minmax(300px, .9fr)`), but the order form uses `grid-column: 1 / -1` to span the full width of workspace-main.

The phone preview is a **sibling** of workspace-main in the outer grid — it is NOT inside the form.

When `show-client-details` is active (i.e. the user is filling in the form), the main CSS body classes on `<main>` are:

```
.client-workspace
.has-client-preview
.show-client-details
.reviewing-client-order   (when review = true)
.editing-order            (when editingOrderId is set)
.last-form-step           (when on the last fieldset)
```

---

## State variables

All live in `ClientDashboard.tsx`.

| State | Type | Purpose |
|-------|------|---------|
| `formStep` | `number` | Which fieldset is currently active (0 = The couple, 1 = Wedding details, 2 = Celebrations) |
| `formStepCount` | `number` | Total number of `<fieldset>` elements in the form, calculated by DOM query |
| `review` | `boolean` | Whether the Review step is shown (step index 3 in progress bar) |
| `showOrderPreview` | `boolean` | Whether the Personal touches step is shown (step index 4 in progress bar) |
| `editingOrderId` | `number \| null` | Non-null when editing an existing order (all fieldsets shown at once) |
| `copyingOrderId` | `number \| null` | Non-null when copying a previous order |
| `busy` | `boolean` | Disables all inputs/buttons during async operations |
| `error` | `string` | Validation or server error message |
| `draftStatus` | `string` | Status text shown below the form — draft save confirmations |
| `details` | `InvitationData` | All invitation fields (see Data model section) |
| `phoneNumber` | `string` | 10-digit WhatsApp number (stored without +91 prefix) |
| `weddingEventTitle` | `string` | Name of the main wedding celebration (separate from `details.events`) |
| `extraEvents` | `Celebration[]` | Additional celebrations beyond the main wedding (reception, mehendi, etc.) |
| `selected` | `number \| null` | Template ID currently chosen |
| `showDetails` | `boolean` | Whether the form panel is open at all |

---

## Data model — `InvitationData`

Defined in `src/invitations/model.ts`.

```ts
interface InvitationData {
  template: number          // Template ID
  groom: string             // Display name
  bride: string             // Display name
  groomFamily: string       // Family description text
  brideFamily: string       // Family description text
  date: string              // ISO date YYYY-MM-DD (main wedding)
  time: string              // HH:MM (main wedding)
  offset: string            // Timezone offset
  venue: string             // Main wedding venue name
  address: string           // Main wedding address
  map: string               // Google Maps URL for main wedding
  message: string           // Welcome message
  dressCode: string         // Dress code note
  giftNote: string          // Short note to guests
  music: string             // Music track identifier
  musicStart?: number       // Music clip start (seconds)
  musicEnd?: number         // Music clip end (seconds)
  gallery: string           // (legacy) gallery field
  events: Celebration[]     // ALL events including wedding at index 0
  brideFirst?: boolean      // Swap bride/groom display order
  showCoupleIllustrations?: boolean
  layoutVersion?: 1 | 2
  textOverrides?: TextLayout
  companyLogo?: string
  companyName?: string
  companyPhone?: string
  footerIllustration?: string  // Template 6 (Embroidered Garden) only
}
```

### `Celebration` type

```ts
interface Celebration {
  id?: string      // Persisted ID for text override targeting
  title: string
  date: string     // YYYY-MM-DD
  time: string     // HH:MM or ''
  venue: string
  address: string
  map: string      // Google Maps URL
}
```

### How events are composed before submission

`details.events` is NOT used directly while filling the form. Events are assembled at submission time in `submitOrder`:

```
events = [
  { title: weddingEventTitle, date, time, venue, address, map, ...copyingDetails? },
  ...extraEvents
]
```

So the main wedding is always `events[0]`.

---

## Progress bar steps

Defined in `OrderProgressBar.tsx`:

```ts
const STEPS = ['The couple', 'Wedding details', 'Celebrations', 'Review', 'Personal touches']
//              index 0          index 1           index 2       index 3      index 4
```

### How `current` prop maps to app state

```ts
current = review ? 3 : showOrderPreview ? 4 : formStep
```

### `onNavigate` callback (step clicks in progress bar)

```ts
onNavigate={step => {
  if (step === 3) { setShowOrderPreview(false); setReview(true) }
  else if (step === 4) { setReview(false); setShowOrderPreview(true) }
  else { setReview(false); setShowOrderPreview(false); setFormStep(step) }
}}
```

---

## Form steps — fields

### Step 1 — "01 · The couple" (`formStep === 0`)

| Label | Field | Type | Required |
|-------|-------|------|----------|
| Groom's name | `details.groom` | text | Yes |
| Bride's name | `details.bride` | text | Yes |
| Groom's family | `details.groomFamily` | text | No |
| Bride's family | `details.brideFamily` | text | No |
| Welcome message | `details.message` | textarea (3 rows, max 2000) | No |

Also rendered in the **form heading** (not a fieldset input):
- Couple order toggle (Bride First / Groom First) — controls `details.brideFirst`
- WhatsApp number input — `phoneNumber` state (10 digits, disabled when editing)

### Step 2 — "02 · Wedding details" (`formStep === 1`)

| Label | Field | Type | Required |
|-------|-------|------|----------|
| Wedding celebration name | `weddingEventTitle` | text | Yes |
| Wedding date | `details.date` | date | Yes |
| Ceremony time | `details.time` | time | No |
| Venue | `details.venue` | text | Yes |
| Address | `details.address` | text | Yes |
| Google Maps location | `details.map` | Search Google Maps or paste a Google Maps link | No |

### Step 3 — "03 · Celebrations" (`formStep === 2`)

Each item in `extraEvents` renders a celebration card with these fields:

| Label | Field | Required |
|-------|-------|----------|
| Event name | `item.title` | Yes |
| Date | `item.date` | Yes |
| Time | `item.time` | No |
| Venue | `item.venue` | Yes |
| Address | `item.address` | Yes |
| Google Maps location | `item.map` | Search Google Maps or paste a Google Maps link | No |

- Max 9 extra celebrations.
- "+ Add another celebration" button appends a new item with the wedding date pre-filled.
- Each card has a Remove button.
- Each card is themed with a colour from `CEL_PALETTE` (7-colour array, assigned by `index % 7`).
- CSS custom properties on the card element: `--cel-bg`, `--cel-border`, `--cel-icon`.
- Card details sit on the left, with Date and Time on one row; the event's Google Maps picker sits in the right column.

### Step 4 — "Review" (`review === true`)

No new fields. Shows all previously entered fieldsets simultaneously (`editingOrderId` behaviour: show all at once). User can confirm details before proceeding.

Progress bar shows index 3 as active.

### Step 5 — "Personal touches" (`showOrderPreview === true`)

Rendered by `OrderPreviewStep.tsx`.

| Section | Fields |
|---------|--------|
| Music | `details.music`, `details.musicStart`, `details.musicEnd` — via `MusicPicker` + `MusicPlaybackControls`; stores can add private tags and open **Upload music** to enter a song name and choose an MP3 up to 20 MB under the active tag |
| Personal touches | `details.dressCode` (text), `details.giftNote` (textarea, 2 rows, max 600) |
| Footer illustration | Template 6 only — `details.footerIllustration` — predefined options + custom upload |

Progress bar shows index 4 as active.

---

## Navigation flow

```
formStep 0 → formStep 1 → formStep 2
                                    ↓
                              review = true  (step 3)
                                    ↓
                         showOrderPreview = true  (step 4)
                                    ↓
                              submitOrder()
```

### `advanceFormStep()`

Called by the "Continue →" button when `!review && !showOrderPreview`.

1. Queries `:scope > fieldset` inside `.order-form` → validates the current fieldset's `:invalid` inputs.
2. If an invalid field is found: sets `error`, calls `reportValidity()` and `focus()`, returns early.
3. If `formStep < sections.length - 1`: increments `formStep`.
4. If at the last fieldset (step 2, Celebrations): sets `review = true`.

### Portal Back / Continue buttons

Injected via `createPortal` into `workflowHost` ref. These appear when:
- `tab === 'Templates' && showDetails && !editingOrderId && workflowHost && !showOrderPreview`

```
Back:     review ? setReview(false) : setFormStep(max(0, step - 1))
Continue: review ? [setReview(false); setShowOrderPreview(true)] : advanceFormStep()
```

### OrderPreviewStep buttons

```
← Back:    onNavigateStep(3)   → goes to Review
Place order →: type="submit"   → triggers submitOrder()
```

### Submit row inside the form (shown when `editingOrderId` is set)

- When `formStep === 2 && !review`: "Continue →" (type=button) → `setReview(true)`.
- Otherwise: "Continue →" (type=submit) → calls `submitOrder()`.

---

## `submitOrder()` — submission logic

Triggered by `onSubmit` on the `<form>` element.

```
if (!supabase || !user || !company || !selected) return
setBusy(true)

phone = '+91' + phoneNumber

formData = validateDetails({
  ...details,
  musicStart: details.musicStart ?? 0,
  template: selected,
  events: [{ title: weddingEventTitle, ...weddingFields }, ...extraEvents],
  companyLogo, companyName, companyPhone   // injected from company row
})

if (editingOrderId):
  → supabase.rpc('update_company_order' or 'update_test_order')
  → resets all state, switches to Orders tab

else (new order):
  → supabase.from('orders').insert(...)
  → supabase.rpc('reserve_company_order_path', { candidate_paths: newInvitationPathCandidates(...) })
  → supabase.rpc('configure_order_invitations', { named plans and event indexes })
  → sets viewOrder (triggers order confirmation dialog)
  → resets all state, switches to Orders tab
```

The couple-level schema foundation is in `202611100001_couple_invitation_foundation.sql`. Existing `orders` rows remain the parent/source anchor; migration 100001 copies them into `couple_orders` plus one `invitations` row without changing existing links, and maps RSVP rows through `invitation_id`. Migration `202611100002_couple_rsvp_management_board.sql` makes each management link show RSVP responses across the couple’s invitations, labeled by invitation. Migration `202611100003_multi_invitation_plans.sql` supports named invitation children with event subsets, batch publishing, public child-link lookup, and per-invitation RSVP writes. All three migrations have been applied. The create form defaults a plan named Wedding with the wedding event selected; users can add plans, name each one, and choose event combinations. The Orders tab groups by couple, expands to invitation rows, and shows each link and RSVP count.

---

## Form heading

Rendered above the `OrderProgressBar` inside the form. Contains:

1. **Kicker** — `NEW INVITATION ORDER` / `EDIT ORDER #n` / `COPY OF ORDER #n`
2. **h2** — template name (e.g. "Embroidered Garden")
3. **Couple order toggle** — buttons to swap bride/groom display order
4. **WhatsApp input** — `+91` prefix + 10-digit field

CSS: `.form-heading` with `padding: 0 0 14px; margin-bottom: 0; border-bottom: 1px solid var(--client-line)`.

---

## Draft persistence

Every state change that affects the form is saved to `localStorage` under `draftKey` (derived from the company slug):

```js
localStorage.setItem(draftKey, JSON.stringify({
  tab, details, phoneNumber, weddingEventTitle, extraEvents,
  selected, previewId, showDetails, formStep, review,
  showOrderPreview, editingOrderId, copyingOrderId
}))
```

On load, the draft is restored from localStorage if present. This lets users close/refresh without losing progress.

---

## PDF / image upload (AI extraction)

The "Upload your invitation" card in the workspace-top header (only shown in `show-client-details && !editingOrderId`) allows uploading a PDF, JPG, PNG or WebP.

Flow:
1. `handlePdfUpload(file)` is called.
2. File is converted to base64.
3. `callExtract()` sends to Supabase Edge Function `openai-extract` with a large extraction prompt.
4. The extracted JSON is mapped onto form fields: names, dates, venues, family text, events, welcome message, dress code.
5. If any field was extracted successfully, `pdfPrefilled = true` is set and `review = true` is set — the user lands directly on the Review step.

---

## Editing vs new vs copying

| Mode | `editingOrderId` | `copyingOrderId` | Behaviour |
|------|-----------------|-----------------|-----------|
| New | `null` | `null` | Normal flow, formStep starts at 0 |
| Edit | `number` | `null` | All fieldsets shown simultaneously, WhatsApp disabled, submits via `update_company_order` |
| Copy | `null` | `number` | Pre-fills from copied order, `review = true` immediately (user lands on Review to adjust) |

---

## Celebration card CSS theming

The `CEL_PALETTE` array has 7 entries:

```ts
const CEL_PALETTE = [
  { headerBg, border, icon },  // Sage green
  { headerBg, border, icon },  // Dusty rose
  { headerBg, border, icon },  // Warm amber
  { headerBg, border, icon },  // Slate blue
  { headerBg, border, icon },  // Terracotta
  { headerBg, border, icon },  // Muted lavender
  { headerBg, border, icon },  // Teal
]
```

Each celebration editor sets inline CSS custom properties on its root element:
```jsx
style={{ '--cel-bg': cp.headerBg, '--cel-border': cp.border, '--cel-icon': cp.icon }}
```

The header background uses `var(--cel-border)` directly (the saturated border colour) so it reads clearly. The icon circle uses a mixed `color-mix(in srgb, var(--cel-bg) 60%, white)` tint.

---

## Form grid CSS

The form itself is `display: grid; grid-template-columns: minmax(0,1fr) 112px` in `show-client-details`. All children except `.client-workflow-controls` and `.primary-action` use `grid-column: 1 / -1`.

Inside each fieldset, `.form-grid` is `display: grid; grid-template-columns: repeat(2, minmax(0, 1fr))`.

Wedding details and celebration cards use two side-by-side sections: form fields on the left and the Google Maps picker on the right. Within each event's left section, the event name, venue, and address span the column; Date and Time share a row. On narrow screens, the map picker moves below the fields.

The form has `gap: 0 !important` to suppress Chrome DevTools purple grid visualisation.

---

## Workspace-top header (show-client-details)

Two-column flex row (`justify-content: space-between; align-items: flex-start`):

**Left column** (flex-column):
- `← Back to templates` button (first, `margin-bottom: 12px`)
- Kicker: `PERSONALISE YOUR INVITATION`
- h1: `Create your invitation` / `Edit your invitation` / `Preview order`

**Right column:**
- Upload card (`client-upload-pdf-ai`) — illustration + "Upload your invitation" label + green "Upload design" button
