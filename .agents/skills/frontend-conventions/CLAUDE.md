# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

A Claude Code plugin that packages frontend coding conventions as on-demand skills.
There is no application code, build step, test suite, or linter — every file is
Markdown (`SKILL.md`) plus two manifests. "Editing this codebase" means editing
convention prose and keeping the manifest and cross-references in sync.

## Architecture

The plugin is a tree of skills with an explicit dependency chain. Understanding
the chain is essential before editing any single skill, because conventions are
deliberately *not* repeated — each skill assumes its dependencies are loaded.

- **Root dispatcher** (`SKILL.md`, `name: frontend-conventions`) — the only
  `user-invocable` skill. It routes to the most specific sub-skill via a
  "When you are about to… / Invoke" table. It does not contain conventions itself.
- **`skills/general`** — base JS/TS conventions. Foundation of the chain; depends
  on nothing.
- **`skills/react`** — instructs the reader to load `general` first, then adds
  React rules.
- **`skills/react-architecture`** — instructs the reader to load `general` and
  `react` first, then adds folder-structure / layering rules.
- **`skills/node`** — instructs the reader to load `general` first, then adds
  Node/pnpm rules. Parallel to the React branch, not below it.
- **`skills/accessibility`** — framework-agnostic, loaded alongside whichever
  framework skill applies.

Dependencies are expressed two ways and **both must agree**:
1. A blockquote at the top of each sub-skill telling the reader which skills to
   invoke first (this is how loading actually happens at runtime — there is no
   automatic resolution).
2. The routing table in the root `SKILL.md`.

## Conventions for editing skills

- Sub-skills are `user-invocable: false`; only the root is invocable. Preserve
  this when adding a skill.
- Skills are referenced by exact `name:` from frontmatter (e.g.
  `frontend-conventions:react`), never by file path or directory listing. When
  renaming, update: the dependency blockquotes, the root routing table, the
  `README.md` table, and `.claude-plugin/plugin.json`.
- Don't duplicate a rule that a dependency already covers — add it to the lowest
  skill in the chain where it belongs.
- Every rule should state the *why*, and prefer ✅/❌ paired examples, matching
  the existing style.
- `general` and the others repeatedly state that project-specific `CLAUDE.md`
  rules override these defaults, and that conflicts should be flagged rather than
  silently resolved. Keep that framing in new content.

## When adding a new skill

1. Create `skills/<name>/SKILL.md` with frontmatter (`name`, `description`,
   `user-invocable: false`) and a dependency blockquote if it builds on others.
2. Add the path to the `skills` array in `.claude-plugin/plugin.json`.
3. Add a routing row to the root `SKILL.md` table.
4. Add a row to the `README.md` Skills table.
5. Bump `version` in `.claude-plugin/plugin.json`.

## Distribution

Installed by users either as a plugin (`.claude-plugin/plugin.json`) or by
cloning into `~/.claude/skills/frontend-conventions`. The directory name
`frontend-conventions` is the namespace prefix users invoke skills under, so it
matters for the clone-based install path documented in the README.
## Model routing

All sub-skills run on `claude-haiku-4-5` via frontmatter `model:`. The root
dispatcher (`SKILL.md`) has no model override — adding one there would propagate
the override through the entire turn before sub-skills get a chance to set their
own, but more importantly it would be redundant.

**Why haiku for all skills including `react-architecture`:** The `model:` field
applies for the rest of the current turn. When any sub-skill in the dependency
chain sets `model: claude-haiku-4-5`, that override stays active for all
subsequent Skill tool calls in the same turn — including `react-architecture`.
Making `react-architecture` explicit avoids a misleading asymmetry.

**Why no `effort:` override:** `effort` applies to the entire turn, including
the code Claude writes after loading a skill. Setting `effort: low` would reduce
reasoning quality for code review and generation, not just skill loading. The
session effort level is left untouched.

**Model ID is hardcoded in 6 skill files.** There is no plugin-level default
mechanism. When upgrading to a newer haiku model, update the `model:` field in
every SKILL.md: root (none), general, react, react-architecture, node,
accessibility.
