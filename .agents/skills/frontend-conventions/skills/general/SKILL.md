---
name: general
description: >
  JS/TS coding conventions: naming, functions, control flow, async,
  TypeScript, testing, and design principles. Use when writing or reviewing
  any JavaScript or TypeScript code.
user-invocable: false
model: claude-haiku-4-5
---

# General JS/TS Coding Conventions

> Applicable to any JavaScript or TypeScript project. Project-specific rules
> always override these. If you encounter a conflict with existing code patterns
> in this project, flag it rather than silently enforcing these defaults.

## Variables & Constants

- Prefer `const` over `let`; avoid `var`
- Name a value when its meaning isn't clear from context. The goal is
  readability, not mechanical extraction of every literal
  - ✅ `const maxRetries = 3` : the number alone carries no meaning
  - ✅ `const tooltipOffsetPx = 8` : unit and purpose are clear
  - ✅ `{ opacity: 0.8, radiusScale: 10 }` in a DeckGL layer config :
    the property key already provides the context; extracting adds noise
- Suffix constants with their unit: `timeoutMs`, `distancePx`, `retryCount`
- Avoid abbreviations unless standard (`id`, `url`, `i`, `err` are fine)

## Functions

- One function, one responsibility
- Prefer small, pure, testable functions
- Avoid boolean parameters that switch behavior; split into two functions
- No side effects at module level
- Limit parameters to two or fewer where possible; if a function needs three
  or more, use a destructured options object instead of positional arguments:
  ```ts
  // ✅
  function createUser({ name, email, role }: CreateUserOptions) { ... }

  // ❌ hard to read at the call site, easy to swap arguments by mistake
  function createUser(name: string, email: string, role: string) { ... }
  ```
- Keep caller and callee close in the file; place the callee just below the
  caller so the code reads top-to-bottom

## Naming

- A well-named function or variable should not need a comment
- Use descriptive names that reveal intent: `getUserById`, not `getUser` or `fetch`
- Prefix event handlers with `handle`: `handleSubmit`, `handleChange`
- Prefix booleans with `is`, `has`, `can`, `should`: `isLoading`, `hasError`
- Name booleans positively; avoid double negatives:
  - ✅ `isVisible`, `isEnabled`
  - ❌ `isNotHidden`, `isNotDisabled`
- Encapsulate complex conditions in a named variable or function:
  ```ts
  // ✅
  const isEligibleForAccess = user.isActive && user.hasSubscription && !user.isBanned;
  if (isEligibleForAccess) { ... }

  // ❌ the condition has to be read and decoded every time it appears
  if (user.isActive && user.hasSubscription && !user.isBanned) { ... }
  ```

## Immutability

- Use immutable array methods: `map`, `filter`, `reduce`, `flatMap`
- Never mutate function arguments

## Control Flow

- Use early returns to avoid nesting: check preconditions and return/throw at the
  top of a function before the main logic
- Never nest `if` blocks more than 2 levels deep; refactor into early returns,
  extracted functions, or guard clauses instead
- Avoid `else` after a `return`; it adds nesting with no benefit
- Prefer a flat sequence of statements over a nested tree of conditions

See [examples.md](examples.md) for a control-flow before/after comparison.

## Async

- Prefer `async/await` over `.then()` chains; it reads like synchronous code
  and error handling with `try/catch` is more explicit than `.catch()`
- Never use callbacks for async logic; use Promises or `async/await`
- Always handle rejected promises; an unhandled rejection is a silent failure

## Modules

- Prefer named exports over default exports; they make refactoring and search easier
- Keep `dependencies` and `devDependencies` honest; anything only needed at
  build or test time belongs in `devDependencies`

## Comments

- Comments explain *why*, not *what*; well-named code explains itself
- Only comment things that have business logic complexity or non-obvious decisions
- Never leave commented-out code in the codebase; git history preserves it
- No journal comments (`// 2024-01-01: changed this because...`); use git log
- Never disable a linter, TypeScript, or formatter rule without a comment
  explaining why it is necessary; a suppression without a reason is the most
  misleading kind of comment — it silences a tool with no justification:
  ```ts
  // ✅
  // eslint-disable-next-line no-param-reassign -- mutation required by draft-based reducer
  draft.count += 1;

  // ❌
  // eslint-disable-next-line no-param-reassign
  draft.count += 1;
  ```

## Error Handling

- Handle errors explicitly; no empty `catch` blocks
- Distinguish between expected errors (user input) and unexpected errors (bugs)
- Never ignore a rejected promise; always handle or propagate it

## Testing

- Pure functions are the easiest things to test; write them so they can be
  tested with input/output assertions and no setup
- Test behaviour, not implementation; a test that breaks when you rename a
  variable is not testing anything useful
- Test at the boundary of a unit: what goes in, what comes out, what side
  effects are observable. Don't reach into internals
- Avoid mocking what you own; if a function is hard to test without mocking
  its dependencies, apply dependency inversion instead (see Design Principles)
- Mock external boundaries only: HTTP clients, databases, the file system,
  third-party SDKs. These are the edges of your system, not your logic
- One assertion per test where practical; a failing test should point to
  exactly one thing that is wrong
- Test names should describe behaviour, not implementation:
  - ✅ `returns null when order is missing`
  - ❌ `processOrder null branch`
- Cover at least three paths for every unit:
  - **Happy path:** the expected input produces the expected output
  - **Failure path:** the expected error is thrown or returned when something
    goes wrong; assert on the specific error, not just that something failed
  - **Edge cases:** empty input, nulls, zero, boundary values, maximum values;
    the "Zero, One, Many" heuristic is useful for anything that handles
    collections: test with zero items, one item, and multiple items

## Dead Code

- Remove dead code; it creates noise and misleads future readers
- If code is unreachable, unused, or commented out, delete it; git history
  preserves everything that was there before

## Design Principles

### Avoid premature abstraction (DRY with restraint)
- Duplication is cheaper than the wrong abstraction
- Duplicate once; extract on the third occurrence (the rule of three)
- Before extracting a shared function or module, make sure the things being
  unified are the same concept, not just coincidentally similar code

### Dependency inversion
- Functions and modules should not import concrete services or API calls directly
- Receive dependencies as parameters or via configuration; this makes units
  testable without module mocking
  ```ts
  // ✅
  function fetchUser(id: string, client: HttpClient): Promise<User> { ... }

  // ❌ couples the function to a concrete implementation
  function fetchUser(id: string): Promise<User> {
    return httpClient.get(`/users/${id}`); // imported from '../client'
  }
  ```

### Interface segregation
- Don't pass large objects to functions that only need a few fields
- Accept exactly what is needed; it documents dependencies and keeps
  functions focused
  ```ts
  // ✅
  function formatName({ firstName, lastName }: { firstName: string; lastName: string })

  // ❌ function silently depends on the shape of the whole User object
  function formatName(user: User)
  ```

### Composition over inheritance
- Build behaviour by combining small focused functions and modules,
  not by extending base classes
- Prefer pure functions that can be composed over stateful class hierarchies

### Don't reach through objects (Law of Demeter)
- A function should only use data passed directly to it, not navigate
  through nested object chains (`order.customer.address.city`)
- If you find yourself reaching two levels deep, reshape the data closer
  to the source or pass the needed fields more specifically

## TypeScript

- Always use strict mode (`"strict": true` in `tsconfig.json`)
- Never use `any`; use `unknown` for truly unknown input, then narrow with
  type guards; use precise types everywhere else
- Avoid type assertions (`as`): they silence the compiler instead of fixing
  the type model; if you need one, add a comment explaining why
- Prefer `type` over `interface` for most definitions; use `interface` only
  when intentional declaration merging or OOP-style extension is needed
- Use discriminated unions to model state instead of boolean flag combinations;
  see [examples.md](examples.md) for a comparison
- Use `satisfies` to validate a value against a type without widening it
- Avoid enums; prefer `as const` objects or union types. Enums have
  surprising runtime behaviour and complicate tree-shaking
- Don't use `!` (non-null assertion) without a comment; treat it like `as`
- Prefer `@ts-expect-error` over `@ts-ignore`; `@ts-expect-error` causes a
  compile error if the suppressed issue no longer exists, so it self-removes
  when the underlying problem is fixed — `@ts-ignore` silently persists forever
