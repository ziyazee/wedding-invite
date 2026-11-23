---
name: react
description: >
  React coding conventions: components, hooks, state management, performance,
  data fetching, and styling. Use when writing or reviewing React components
  or hooks.
user-invocable: false
model: claude-haiku-4-5
---

# React Conventions

> **Before applying these conventions, invoke the `frontend-conventions:general`
> skill** to load the base JS/TS conventions these build on.
>
> Project-specific rules always override these defaults.


## File Naming

- Component files: PascalCase matching the component name (`UserCard.tsx`)
- Hook files: camelCase matching the function name (`useUserCard.ts`)
- Everything else: kebab-case (`format-date.ts`, `api-config.ts`, `user-types.ts`)

## Exports

- Prefer named exports for components; they make refactoring and search easier
- Use default exports only where the framework requires it (e.g. Next.js
  `page.tsx`, `layout.tsx`, `route.ts`)

## Components & Hooks

- Prefer function components over class components
- Destructure props at the function signature
- Prefer `useReducer` over multiple related `useState` calls when state
  transitions are conditional on other state values, or when a single event
  must update multiple fields atomically; if you find yourself writing
  `setX(...)` and `setY(...)` in the same handler, that is the signal:
  ```ts
  // ✅ atomic transition, impossible states are unrepresentable
  const [state, dispatch] = useReducer(reducer, { status: 'idle' });

  // ❌ two setState calls that must always fire together
  setIsLoading(true);
  setError(null);
  ```
- Avoid `useEffect` for derived state; compute during render
- Co-locate state with the component that owns it
- Keep components thin; move logic into hooks or utility functions
- Treat props as read-only

## Rapidly Changing Values

Not every value that lives across renders belongs in state. Values that change
faster than the render cycle, or that should never trigger a re-render, should
be stored outside of state.

- Use a `ref` for values that need to persist across renders without causing them:
  scroll position, pointer coordinates, interval IDs, previous values, DOM nodes
- Use a ref or a library-specific observable value (such as a motion value) for
  animation-driven values; putting these in state causes unnecessary re-renders
  and produces janky animation
- A good test: if updating a value should not cause the component to re-render,
  it does not belong in state
  ```ts
  // ✅ animation value stored outside React state
  const offset = useMotionValue(0); // or: const offset = useRef(0)

  // ❌ animated value in state causes a re-render on every frame
  const [offset, setOffset] = useState(0);
  ```
- The same applies to values updated in `requestAnimationFrame` loops,
  pointer/touch event handlers, and scroll listeners; write to a ref and
  read from it in the render path only when a discrete re-render is needed

## Portals

- Use portals for components that need to escape the DOM hierarchy:
  modals, tooltips, popovers, toasts, dropdowns
- Create a dedicated portal per concern (e.g. `ModalPortal`, `TooltipPortal`)
  rather than a single generic one; this prevents z-index and event
  bubbling conflicts between unrelated UI layers

## Error Boundaries

- Wrap large or complex component subtrees in an `ErrorBoundary`
- Place boundaries at meaningful UI seams (a page, a sidebar, a widget)
  so one failure doesn't take down the whole app

## Component Layout Contract

- A component is not responsible for its own placement or external spacing
- Outer elements should never set: `margin`, `position: absolute/fixed`,
  `align-self`, or explicit `width`/`height` that overrides intrinsic sizing
- Block components (cards, panels, sections) should fill available space
  with `width: 100%` or rely on the parent's layout to size them
- Inline/interactive elements (buttons, badges, chips) may own their
  internal `padding`, `border`, and `border-radius`; their intrinsic size
  is part of their design
- Spacing between siblings is always the parent's responsibility
  (use `gap` in a flex/grid container, not `margin` on children)

## Performance

- Do not memoize by default; `useMemo`, `useCallback`, and `React.memo` add
  complexity and should only be used when there is a measured performance
  problem or a stable reference is a documented requirement of a dependency
  (e.g. a value used in a `useEffect` dep array, or a prop passed to a child
  wrapped in `React.memo`)
- Premature memoization obscures the component's data flow and can mask
  the root cause of actual performance issues

## Data Fetching

- Keep data fetching out of presentational components; fetch in a dedicated
  hook or a container component, then pass data as props
- A component that fetches its own data cannot be rendered in isolation without
  a network — it becomes hard to test and hard to reuse
  ```ts
  // ✅ fetching in a hook, rendering in a presentational component
  function UserCardContainer({ id }: { id: string }) {
    const { data, isLoading } = useUser(id);
    if (isLoading) return <Skeleton />;
    return <UserCard name={data.name} avatarUrl={data.avatarUrl} />;
  }

  // ❌ presentational component coupled to the network
  function UserCard({ id }: { id: string }) {
    const { data } = useUser(id);
    return <div>{data.name}</div>;
  }
  ```
- Server components (RSC) are a valid exception: fetching in a server component
  is idiomatic and does not affect client-side testability

## Design Principles (React-specific applications)

### Dependency inversion in components and hooks
- Components and hooks should not import concrete services or API calls directly
- Receive dependencies as props, parameters, or via context; this makes
  units testable without module mocking
  ```ts
  // ✅
  function useUser(fetchUser: (id: string) => Promise<User>) { ... }

  // ❌ couples the hook to a concrete implementation
  function useUser(id: string) {
    return fetchUser(id); // imported from '../api'
  }
  ```

### Interface segregation in props
- Don't pass large objects to components that only need a few fields
- Destructure to exactly what's needed at the call site; it documents
  dependencies and prevents unnecessary re-renders
  ```ts
  // ✅
  function UserCard({ name, avatarUrl }: { name: string; avatarUrl: string })

  // ❌ component silently depends on the shape of the whole User object
  function UserCard({ user }: { user: User })
  ```

### Composition over inheritance
- Build behaviour by combining small focused hooks and components,
  not by extending base classes or wrapping in HOCs
- A hook that calls other hooks is almost always cleaner than a HOC

## Logging

- Avoid `console.log` in code that runs in production; use an error reporting
  integration (e.g. Sentry) for exceptions that need visibility
- `console.log` is fine during development and debugging; remove it before
  merging to a production branch

## Styling

- Never use inline styles for static values; static styles belong in a
  a CSS file, CSS module, or utility class — inline styles bypass caching,
  defeat static analysis, and cannot be overridden with normal CSS specificity
  ```tsx
  // ✅
  <button className={styles.primaryButton}>Submit</button>

  // ❌ static value hardcoded in JSX
  <button style={{ borderRadius: '4px', fontWeight: 600 }}>Submit</button>
  ```
- Inline styles are acceptable for values that are genuinely dynamic at
  runtime (e.g. `style={{ width: `${progress}%` }}`)
- Use design tokens or CSS custom properties for colors, spacing, typography,
  and border radii; never hardcode raw values like `#3b82f6` or `16px` outside
  of a token definition file

