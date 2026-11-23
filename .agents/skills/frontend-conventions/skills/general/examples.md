# General Conventions — Code Examples

## Control Flow: early returns vs nesting

✅ Flat early-return style:

```ts
function processOrder(order: Order | null) {
  if (!order) return null;
  if (!order.isValid) throw new Error('Invalid order');
  if (order.isPending) return processPending(order);

  return fulfillOrder(order);
}
```

❌ Deeply nested style:

```ts
function processOrder(order: Order | null) {
  if (order) {
    if (order.isValid) {
      if (!order.isPending) {
        return fulfillOrder(order);
      } else {
        return processPending(order);
      }
    } else {
      throw new Error('Invalid order');
    }
  } else {
    return null;
  }
}
```

---

## TypeScript: discriminated unions vs boolean flags

✅ Discriminated union — impossible states are unrepresentable:

```ts
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: Error };
```

❌ Boolean flags — `isLoading: true, isError: true` is a valid (broken) state:

```ts
type RequestState = {
  isLoading: boolean;
  isError: boolean;
  data?: User;
  error?: Error;
};
```
