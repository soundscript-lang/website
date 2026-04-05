---
title: Newtypes and Value Classes
description: Static nominal aliases and value-oriented classes, including their runtime behavior.
---

:::note Canonical source
This page mirrors the contract in the soundscript repo, especially
[`docs/v1-user-contract.md`](https://github.com/soundscript-lang/soundscript/blob/main/docs/v1-user-contract.md)
and the annotation rules in
[`docs/annotation-spec.md`](https://github.com/soundscript-lang/soundscript/blob/main/docs/annotation-spec.md).
:::

These are advanced modeling tools. Most teams do not need them on day one, but they matter when
plain TypeScript shapes stop expressing the domain clearly enough.

One important background rule comes first:

## Classes are already nominal

soundscript treats classes as nominal across the board.

That is already a departure from TypeScript. Two unrelated classes with the same fields do **not**
silently become interchangeable just because their public shapes match.

`#[newtype]` and `#[value]` build on top of that:

- `#[newtype]` gives type aliases nominal identity
- `#[value]` gives classes value-style runtime behavior

The quickest way to tell them apart is:

| Feature | `#[newtype]` | `#[value]` |
| --- | --- | --- |
| What it attaches to | type alias | class |
| Changes static semantics | yes | yes |
| Changes runtime behavior | no | yes |
| Main use | IDs, units, domain wrappers | immutable data objects with value equality |
| Equality story | same as underlying runtime value | equal instances canonicalize to one object |

## `#[newtype]`

Use `#[newtype]` when a plain alias is too weak for the domain.

```ts
// #[newtype]
export type UserId = string;

// #[newtype]
export type OrderId = string;

declare function loadUser(id: UserId): void;
declare function loadOrder(id: OrderId): void;
```

In plain TypeScript, `UserId` and `OrderId` would both just be `string`. With `#[newtype]`, they
stop mixing in checked code.

Good uses include:

- IDs such as `UserId`, `OrderId`, or `TenantId`
- domain strings such as `Email` or `CurrencyCode`
- unit-like wrappers over fixed-width numerics such as `Meters` or `Milliseconds`
- protocol-level values where “this is still a string” is too weak

### What it changes statically

`#[newtype]` is a zero-cost nominal alias:

- the representation stays explicit
- the checker treats the alias as its own type
- projected `.d.ts` output carries the branding so plain TypeScript consumers cannot launder raw
  values back in by accident

Current rule:

- the representation must not resolve to a top-level union

### What it does not change at runtime

`#[newtype]` is a static feature. It does not allocate a wrapper object or change runtime equality.

```ts
function isRootUser(id: UserId): boolean {
  return id === '123';
}
```

That may be surprising if you are coming from languages where a newtype becomes a runtime wrapper.
In soundscript, `UserId` over `string` still behaves like a string at runtime. The newtype is real
to the checker, but it does not wrap or transform the runtime value.

That means equality can surprise people at first:

```ts
declare const id: UserId;

id === '123'; // allowed and can be true at runtime
```

If you want a different runtime representation, `#[newtype]` is not the tool. It is a static
nominal feature, not a runtime wrapper.

## `#[value]`

Use `#[value]` when a class is meant to behave like data, not like a mutable identity object.

```ts
// #[value]
export class Point {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

const same = new Point(1, 2) === new Point(1, 2);
```

The main JS-visible difference is equality. Equal value instances canonicalize to the same object,
so `same` is `true`.

That also means normal JS identity-based APIs behave differently:

```ts
const points = new Set([new Point(1, 2), new Point(1, 2)]);

points.size; // 1
```

### What `#[value]` adds on top of normal class nominality

Classes are already nominal in soundscript. `#[value]` does **not** make them nominal; that part is
already true.

What it adds is:

- immutable value-oriented shape restrictions
- canonical construction
- primitive-style equality behavior for equal values

That makes value classes useful when you want a class API, but you want runtime behavior closer to a
value than to an identity-bearing object.

They are also the class form that maps most naturally onto future Wasm-oriented value lowering,
because the data shape is narrower and the equality story is explicit.

### Shallow by default

Bare `#[value]` is shallow.

That means primitive fields compare by value, but ordinary object leaves still compare by reference:

```ts
// #[value]
class Box {
  readonly payload: { id: string };

  constructor(payload: { id: string }) {
    this.payload = payload;
  }
}

const shared = { id: 'a' };

new Box(shared) === new Box(shared); // true
new Box({ id: 'a' }) === new Box({ id: 'a' }); // false
```

That is the key JS rule: equality follows the stored leaves. Primitive leaves compare by value,
nested value classes compare by their own canonical identity, and ordinary reference leaves still
compare by JS object identity.

### `deep: true`

Use `// #[value(deep: true)]` when you want recursively value-like fields and a stricter data-only
shape.

```ts
// #[value(deep: true)]
class Rect {
  readonly topLeft: Point;
  readonly bottomRight: Point;

  constructor(topLeft: Point, bottomRight: Point) {
    this.topLeft = topLeft;
    this.bottomRight = bottomRight;
  }
}
```

Deep value classes are the better fit for future Wasm-oriented lowering because the data shape is
more constrained and predictable than the shallow JS-first form.

### Current shape restrictions

`#[value]` is intentionally narrow today. The class must stay close to a simple immutable data
carrier:

- named module-scope class
- public `readonly` instance fields
- one direct constructor
- no inheritance
- no accessors, setters, or private/protected state

The point is to make the value semantics explainable and analyzable, not to bolt value equality
onto every possible class pattern.

## When to reach for these

Reach for `#[newtype]` when you want nominal identity over an existing representation.

Reach for `#[value]` when you want a class with value semantics, especially if you care about:

- equality by contents instead of by construction site
- immutable data carriers
- layouts that make sense for future Wasm-oriented lowering

Most teams can ignore both until the basic `.sts` migration path is working.

## See also

- [Annotation Spec](./annotation-spec.md)
- [Fixed-Width Numeric Types](./machine-numerics.md)
- [Macros](./macros.md)
- [Variance Contracts](./variance-contracts.md)
