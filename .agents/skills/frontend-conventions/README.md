# Frontend Clean Code Skills

Coding conventions packaged as [Claude Code skills](https://code.claude.com/docs/en/plugins)
for React and Node.js projects in TypeScript. Add them to any project and Claude
will follow your conventions automatically, without re-explaining them every session.

These reflect my personal opinions on what makes frontend code readable,
maintainable, and bug-resistant. Grounded in SOLID, clean code principles,
DRY with restraint, and hard-won experience across many projects and teams.

## Installation

Clone into `~/.claude/skills/` as `frontend-conventions`:

```
git clone https://github.com/JoostKiens/frontend-convention-skills ~/.claude/skills/frontend-conventions
```

To update:

```
git -C ~/.claude/skills/frontend-conventions pull
```

## Usage

Add a directive to your project's `CLAUDE.md`. Skills load on demand; token
cost is only paid when a skill is actually invoked.

### Recommended: load all skills automatically

Claude invokes the most specific skill for whatever code it is writing or reviewing:

```
Before writing or reviewing any JavaScript or TypeScript code, invoke the `frontend-conventions` skill.
```

### Use a specific skill

If you only need a subset of the conventions, reference a sub-skill directly.
`frontend-conventions:react` and `frontend-conventions:react-architecture` each
pull in their dependencies automatically, so you only need the most specific one.

**React app with architecture conventions** (folder structure, component layers,
and module boundaries in scope):

```
Before writing or reviewing code, invoke the `frontend-conventions:react-architecture` skill.
```

**React app without architecture concerns** (components and hooks only, folder
structure out of scope):

```
Before writing or reviewing code, invoke the `frontend-conventions:react` skill.
```

**Node.js package:**

```
Before writing or reviewing code, invoke the `frontend-conventions:node` skill.
```

**Any JS/TS project without React or Node:**

```
Before writing or reviewing code, invoke the `frontend-conventions:general` skill.
```

**Accessibility:**

```
Before writing or reviewing any HTML or JSX, invoke the `frontend-conventions:accessibility` skill.
```

**Full-stack app** (e.g. Next.js with API routes or server actions):

```
Before writing or reviewing frontend code, invoke the `frontend-conventions:react-architecture` skill.
Before writing or reviewing backend code, invoke the `frontend-conventions:node` skill.
```

**pnpm monorepo** (separate frontend and backend packages):

Add a `CLAUDE.md` to each package pointing to the relevant skill above. For
shared code at the root level, add a root `CLAUDE.md`:

```
Before writing or reviewing code, invoke the `frontend-conventions:general` skill.
```

## Linting and formatting

These skills cover what linting and formatting can't: architecture decisions,
naming quality, abstraction level, and design principles. For rules that can
be automated, a linter and formatter are more reliable than a convention skill.

When a skill is invoked, it instructs Claude to read your ESLint and Prettier
configs before writing or reviewing code, and to defer to those rules where
they overlap with convention skill guidance.

## Skills

| Skill                                                                      | Use in                                      |
| -------------------------------------------------------------------------- | ------------------------------------------- |
| [`frontend-conventions:general`](./skills/general/SKILL.md)                       | Any JS/TS project                           |
| [`frontend-conventions:node`](./skills/node/SKILL.md)                             | Node.js services, APIs, CLI tools, packages |
| [`frontend-conventions:react`](./skills/react/SKILL.md)                           | React applications                          |
| [`frontend-conventions:react-architecture`](./skills/react-architecture/SKILL.md) | React apps where architecture is in scope   |
| [`frontend-conventions:accessibility`](./skills/accessibility/SKILL.md)           | Any project that renders HTML               |

## These are defaults, not dogma

Every skill defers to project-specific conventions. When working in an existing
codebase or with a team that has its own patterns, Claude flags conflicts rather
than silently enforcing these defaults. The goal is consistency within a project,
not uniformity across all projects.

If a rule doesn't fit your context, remove it. If something important is missing,
add it. Fork this repo and make it yours.

## Philosophy

Every rule has a reason. Where the right call depends on context, that context
is described: not just what to do, but when and why. A few decisions that
illustrate the approach:

**DRY with restraint:** blanket DRY produces premature abstractions that are
harder to change than the duplication they replaced. The rule of three is a
better guide: duplicate once, extract on the third occurrence.

**Component layout contract:** a component shouldn't know where it lives.
Margins, explicit widths, and absolute positioning on outer elements couple a
component to its context and make it harder to reuse. Layout is the parent's
responsibility.

**Foundation and domain layers:** separating components by domain knowledge
rather than reusability makes the boundary meaningful. A foundation component
can be extracted to any project; a domain component cannot. The one-way
dependency rule (foundation never imports domain) keeps that boundary intact.

## Related

[web-quality-skills](https://github.com/addyosmani/web-quality-skills) by Addy Osmani
covers Lighthouse audits, Core Web Vitals, SEO, and full WCAG auditing. A good
complement for projects where performance and accessibility review are in scope.

[ponytail](https://ponytail.dev) pushes agents to write the least code that works:
stdlib over custom, native over dependencies, one line over fifty. Pairs well with
these conventions as a check on over-engineering.

## Contributing

If you spot a rule that's wrong, incomplete, or missing important context,
open an issue.