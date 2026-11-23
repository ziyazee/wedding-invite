---
name: accessibility
description: >
  Web accessibility conventions: semantic HTML, ARIA, focus management,
  labels, and images. Use when writing HTML or JSX that renders to the DOM.
user-invocable: false
model: claude-haiku-4-5
---

# Accessibility Conventions

> Framework-agnostic. Load alongside the relevant framework skill in any
> project that renders HTML.
> Project-specific rules always override these defaults.

## Semantic HTML

- Prefer semantic HTML elements (`<button>`, `<nav>`, `<main>`, `<article>`,
  `<section>`, `<header>`, `<footer>`) over `<div>` and `<span>` when the
  element has semantic meaning or is interactive
- A `<div>` with an `onClick` is missing keyboard support, role, and focus
  behaviour that a `<button>` provides for free; never use a non-interactive
  element as a click target without adding the full ARIA and keyboard contract

## Labels

- Interactive elements without visible text (icon-only buttons, icon-only
  links) must have an accessible label; choose the right mechanism for the
  context (`aria-label`, visually hidden text, or `<title>` inside an SVG)

## Focus

- Never remove focus outlines without providing a custom replacement; setting
  `outline: none` on `:focus` without an alternative leaves keyboard users
  with no visual indication of where they are on the page
- Only use `tabindex="0"` or `tabindex="-1"`; positive values (`tabindex="2"`)
  override the natural DOM tab order and are almost always wrong:
  - `tabindex="0"` — adds the element to the natural tab order
  - `tabindex="-1"` — removes from tab order but allows programmatic focus
    (useful for managing focus in dialogs)

## Dialogs and Dynamic Content

- When a modal or dialog opens, move focus into it; when it closes, return
  focus to the element that triggered it; failing to do this leaves keyboard
  users stranded outside the dialog or lost after dismissal
- Use `aria-live` regions for status messages and notifications that appear
  without a page load; without them, screen readers will not announce the
  update

## Images

- Meaningful images must have descriptive `alt` text that conveys their
  purpose, not their appearance (`alt="Confirm order"`, not `alt="green check mark"`)
- Decorative images must have `alt=""` so screen readers skip them; omitting
  `alt` entirely causes screen readers to fall back to the file name

## ARIA

- Prefer correct semantic HTML over ARIA attributes; `role="button"` on a
  `<div>` is a workaround for using the wrong element — use `<button>` instead
- ARIA should enhance semantics where HTML has no equivalent, not substitute
  for elements that already carry the right role, state, and keyboard behaviour
