---
name: frontend-conventions
description: >
  Frontend coding conventions for JS/TS projects. Invokes the relevant
  convention skill before writing or reviewing code.
---

# Frontend Conventions

Before **writing or reviewing code** in a JS/TS project, invoke the most
specific skill that applies using the Skill tool. The names below are exact
— do not list files or read the skills directory to discover them. Each skill
instructs you to load the base conventions it builds on, so invoke only the
most specific one that applies.

| When you are about to… | Invoke |
| --- | --- |
| Write or review any JS/TS code | `frontend-conventions:general` |
| Write or review React components or hooks | `frontend-conventions:react` |
| Discuss or change folder structure, component layers, or module boundaries | `frontend-conventions:react-architecture` |
| Write or review Node.js services, APIs, CLI tools, or packages | `frontend-conventions:node` |
| Write or review HTML or JSX that renders to the DOM | `frontend-conventions:accessibility` |

`frontend-conventions:react` builds on `frontend-conventions:general`, and
`frontend-conventions:react-architecture` builds on both — when you invoke them,
they will instruct you to load those dependencies first. For a full-stack app,
invoke `frontend-conventions:react-architecture` for frontend code and
`frontend-conventions:node` for backend code.

Do not invoke for answering questions, explaining concepts, or planning —
only when code is about to be written or reviewed.

## Tooling

Before writing or reviewing code, read the following config files if they
exist in the project:
- `eslint.config.*` or `.eslintrc.*`
- `prettier.config.*` or `.prettierrc.*`

Where a linting or formatting rule covers the same ground as a convention
skill, the config file takes precedence.

Project-specific conventions in CLAUDE.md always take precedence. If a
loaded skill conflicts with project conventions, flag the conflict rather
than silently picking one.
