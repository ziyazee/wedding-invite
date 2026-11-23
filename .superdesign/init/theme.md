# Theme & Design Tokens

## Framework
- React + Vite (no Next.js/Nuxt)
- CSS approach: vanilla CSS files (`.css`), no Tailwind utility classes used despite `@import "tailwindcss"` in index.css
- No CSS-in-JS, no CSS Modules

## Compact Token Summary

### Colors — Dashboard Palette
| Token | Value | Usage |
|---|---|---|
| `--client-background` | `#F8F6F1` | Page background (ivory) |
| `--client-paper` | `#FFFFFF` | Card/surface background |
| `--client-green` | `#354C43` | Primary action, active states (sage) |
| `--client-green-hover` | `#293D35` | Primary hover |
| `--client-accent` | `#D5BD91` | Champagne accent, decorative |
| `--client-ink` | `#252B29` | Primary text |
| `--client-muted` | `#737A74` | Secondary text |
| `--client-line` | `#E7E3DA` | Borders, dividers |
| `--client-selected` | `#F0F3EE` | Hover/selected row bg |
| `--client-success` | `#365F46` | Success text |
| `--client-success-bg` | `#EAF1E9` | Success background |
| `--client-danger` | `#88483F` | Danger text |
| `--client-danger-bg` | `#F6ECE8` | Danger background |
| `--client-shadow` | `0 2px 8px #252b2908` | Default card shadow |

### Colors — Legacy Workspace (Workspaces.css)
| Token | Value |
|---|---|
| `--ink` | `#26372e` |
| `--muted` | `#74796f` |
| `--gold` | `#a68a50` |
| `--line` | `#e5dfd1` |
| `--paper` | `#fbfaf6` |

### Badge Colors (fixed, not tokenized)
- Discount: `#FFDA63` bg, dark text
- Premium: `#64349A` bg, `#9D79CF` border, white text

### Status Colors
| Status | Background | Text |
|---|---|---|
| created/new | `#F5F0E6` | `#8B7340` |
| in_progress | `#EDF2EE` | `#4A6B52` |
| ready/published | `--client-success-bg` | `--client-success` |
| rejected | `--client-danger-bg` | `--client-danger` |

### Typography
- **Primary UI font**: `Inter, Arial, sans-serif`
- **Display/heading font**: `Georgia, serif` (used in overview headings, some settings)
- **Playfair Display**: used only in metric card values in some legacy code
- No type scale — font sizes are ad-hoc: 8px–46px

### Spacing
- No formal spacing scale. Ad-hoc values throughout.
- Common padding: 8px, 10px, 12px, 14px, 16px, 18px, 20px, 24px

### Border Radius
- No radius scale. Values range from 0 to 48px.
- Common: 6px–8px (buttons/inputs), 10px–12px (cards), 999px (pills)

### Shadows
- `0 1px 2px rgba(0,0,0,0.04)` — minimal
- `0 1px 4px #0000000a` — cards
- `0 2px 8px #252b2908` — `--client-shadow`
- `0 4px 16px #0000000f` — hover
- `0 16px 48px ...` — modals

### Breakpoints
| Width | Target |
|---|---|
| 430px | Small phones |
| 560px | Phones |
| 720px | Celebration cards |
| 760px | Sidebar collapses to horizontal tabs |
| 980px | Overview columns stack |
| 1024px | 3-col → flex column |
| 1200px | Settings grid 3→2 col |
| 1250px | Template preview narrows |

---

## Raw Source: index.css

```css
@import "tailwindcss";

body {
  margin: 0;
  min-height: 100svh;
}
```

## Raw Source: Dashboard Token Block (ClientDashboard.css ~line 1122)

```css
:where(.client-workspace, .ai-extract-dialog, .client-workflow-controls) {
  --client-background: #F8F6F1;
  --client-paper: #FFFFFF;
  --client-green: #354C43;
  --client-green-hover: #293D35;
  --client-accent: #D5BD91;
  --client-ink: #252B29;
  --client-muted: #737A74;
  --client-line: #E7E3DA;
  --client-selected: #F0F3EE;
  --client-success: #365F46;
  --client-success-bg: #EAF1E9;
  --client-danger: #88483F;
  --client-danger-bg: #F6ECE8;
  --client-shadow: 0 2px 8px #252b2908;
  --ink: var(--client-ink);
  --muted: var(--client-muted);
  --gold: var(--client-green);
  --line: var(--client-line);
  --paper: var(--client-background);
}
```

## Raw Source: Workspaces.css Token Block

```css
.workspace {
  --ink: #26372e;
  --muted: #74796f;
  --gold: #a68a50;
  --line: #e5dfd1;
  --paper: #fbfaf6;
  min-height: 100svh;
  display: grid;
  grid-template-columns: 248px minmax(0, 1fr);
  background: var(--paper);
  color: var(--ink);
  font-family: Inter, Arial, sans-serif;
}
```
