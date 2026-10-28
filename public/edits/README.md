# Template Text Edits

This folder contains JSON files that define **default text layout overrides** for each invitation template. When a customer selects a template to create an order, these defaults are automatically applied — font sizes, positions, colors, etc.

## How it works

1. Open `/edits` in the browser (you must be logged in as a client)
2. Select a template from the sidebar
3. Use the text editor to drag, resize, reposition, or restyle any text element
4. Click **Save defaults** — the local editing server updates this folder's matching JSON file (for example, `4.json`)
5. Deploy the updated files — customers then see the defaults when they pick that template

The direct save endpoint is available when running the Vite development server. A deployed static Vercel site cannot write back into the source repository; use the local `/edits` page to update these files before deploying.

## JSON file naming

Each file is named `{template_id}.json`. Here are the template IDs:

| ID | Template Name         | File             |
|----|----------------------|------------------|
| 1  | Royal Grace          | `1.json`         |
| 2  | Majestic             | `2.json`         |
| 3  | A Timeless Union     | `3.json`         |
| 4  | Mandap at Dusk       | `4.json`         |
| 5  | Secret Garden        | `5.json`         |
| 6  | Embroidered Garden   | `6.json`         |
| 7  | Bloom                | `7.json`         |
| 8  | The Artful Love Story| `8.json`         |
| 9  | Maroon Letter        | `9.json`         |
| 10 | Emerald Parchment    | `10.json`        |
| 11 | Royal Jodhpur        | `11.json`        |

## JSON structure

```json
{
  "version": 1,
  "elements": {
    "element-name": {
      "fontSize": 24,
      "fontFamily": "Cormorant Garamond",
      "color": "#3a2a1a",
      "x": 120,
      "y": 450
    }
  }
}
```

Each key in `elements` is a text element ID from the template. Only changed properties need to be present — unchanged properties keep the template's built-in values.

## Merge behavior

Saves are **cumulative** — they merge with what's already in the file:

- **Save 1**: Change `title` font size → file has `{ title: { fontSize: 28 } }`
- **Save 2**: Change `venue` color → file has `{ title: { fontSize: 28 }, venue: { color: "#fff" } }`
- **Save 3**: Change `title` position → file has `{ title: { fontSize: 28, x: 100 }, venue: { color: "#fff" } }`

Previous edits are always preserved. Only the elements you touch get updated.

## Applying changes with Claude Code

To apply a text edit for a template, tell Claude:

> "Apply the edits from `{template_id}.json` for {Template Name}"

For example:
- "Apply the edits from `4.json` for Mandap at Dusk"
- "Apply the edits from `1.json` for Royal Grace"

Or to edit a JSON file directly:
- "In `public/edits/4.json`, change the title fontSize to 32"
- "In `public/edits/7.json`, set the venue color to #d4a574"

## Removing a text override

To undo an override for a specific element, delete its key from the JSON file. For example, removing `"title"` from the `elements` object means the title reverts to the template's built-in layout.

To remove all overrides for a template, delete its JSON file from this folder.
