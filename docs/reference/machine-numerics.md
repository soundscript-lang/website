---
title: Fixed-Width Numeric Types
description: Exact-width numeric types, their static rules, and their runtime behavior on JavaScript.
---

:::note Canonical source
This page mirrors the normative machine numerics reference in the soundscript repo:
[`docs/reference/2026-03-29-machine-numerics-reference.md`](https://github.com/soundscript-lang/soundscript/blob/main/docs/reference/2026-03-29-machine-numerics-reference.md).
:::

Most app code should keep using ordinary `number` and `bigint`.

Reach for these types when you need exact width, explicit overflow behavior, typed binary storage,
or data models that should line up with Wasm and wire formats instead of with JavaScript's default
numeric model.

The key split is:

- host numerics: `number`, `bigint`
- fixed-width numerics: `f64`, `f32`, `i8`, `i16`, `i32`, `i64`, `u8`, `u16`, `u32`, `u64`

soundscript does not silently reinterpret all math as fixed-width arithmetic. You opt in when the
problem actually needs those semantics.

At a glance:

- `number` and `bigint` are still the normal choice for most application code
- fixed-width numerics are for exact-width, overflow-aware, representation-aware code
- the checker treats them differently, and the runtime does too

## Static model

The checker treats host numerics and fixed-width leaves as different families.

```ts
import { I16, U8, type u8 } from 'sts:numerics';

const byte: u8 = 10;
const wrapped: u8 = U8(255) + U8(1);
const promoted = I16(U8(1)) + I16(U8(2));
```

The main static rules are:

- contextual literals can flow into a matching fixed-width type
- non-literal values need an explicit constructor or coercion
- same-leaf arithmetic preserves the leaf
- mixed-leaf arithmetic requires an explicit conversion first
- abstract families like `Int`, `Float`, and `Numeric` are useful for APIs and narrowing, not for
  implicit arithmetic

Example:

```ts
const source: number = 10;
const byte: u8 = U8(source);

const ok = I16(U8(1)) + I16(I8(2));
const bad = U8(1) + I8(2); // error
```

This is deliberate. soundscript is trying to make width, signedness, and overflow behavior explicit
instead of letting them move around implicitly.

That is the main static difference from ordinary TypeScript numerics: once you choose a leaf such as
`u8` or `i16`, the checker expects you to keep that choice explicit.

## Runtime model on JavaScript

On JavaScript runtimes, fixed-width numerics are value objects with canonical identity.

```ts
const a = U8(1);
const b = U8(1);
const c = I8(1);

a === b; // true
a === c; // false
a === 1; // false
```

That runtime model matters:

- same leaf + same value canonicalizes to the same object
- different leaves stay distinct even when the numeric payload matches
- fixed-width numerics do not silently collapse into host primitives

In other words:

- `U8(1)` behaves like a `u8` value, not like a disguised `number`
- equality pays attention to the leaf, not just the payload
- code that cares about exact representation can keep that information at runtime

Float leaves normalize a few JS oddities so equality stays value-like:

```ts
F64(NaN) === F64(NaN); // true
F64(-0) === F64(0); // true
```

This gives fixed-width numerics a real runtime identity story:

- they compare as numeric leaves, not just as host primitives
- APIs such as `Map`, `Set`, and strict equality can preserve that distinction
- exact-width modeling stays visible even after emit

## Checked and unchecked arithmetic

Plain integer operators wrap:

```ts
U8(255) + U8(1); // U8(0)
```

If you want failure instead of wrapping, use the checked helpers:

```ts
const added = U8.checkedAdd(U8(10), U8(20));
const overflowed = U8.checkedAdd(U8(255), U8(1));
const divided = I16.checkedDiv(I16(10), I16(0));
```

These helpers return `Result`, so overflow and divide-by-zero become explicit error handling rather
than hidden behavior.

This is one of the biggest differences from plain `number`: the static type and the runtime value
are both trying to preserve the exact arithmetic story you chose.

## Families, matching, and ordering

The family types let you write APIs over groups of numeric leaves:

- `Int`
- `Float`
- `Numeric`

They also show up naturally in pattern matching and comparison helpers:

```ts
kindOf(U8(1)); // "u8"
kindOf(F32(1.5)); // "f32"

values.sort(U8.compare);
mixed.sort((a, b) => compareAs(F64, a, b));
```

`Match` can branch on host and fixed-width numeric families explicitly:

```ts
const label = Match(value, [
  (n: u8) => 'byte',
  (n: Int) => 'int',
  (n: Float) => 'float',
]);
```

## Host boundaries

These types are designed with Wasm, binary protocols, and exact layouts in mind, but they are
usable on JS today because the runtime behavior is explicit instead of pretending to be plain
`number`.

Important boundary rules:

- string conversion is leaf-aware
- JSON can use tagged numeric payloads
- typed storage goes through `sts:numerics` helpers and views

```ts
String(U8(1)); // "u8:1"

const view = new DataView(new ArrayBuffer(16));
writeU8(view, 0, 255);
const byte: u8 = readU8(view, 0);
```

```ts
stringifyJson({ byte: U8(1) }, { numerics: 'tagged' });
// {"byte":{"$numeric":"u8","value":"1"}}
```

That is the main tradeoff to understand:

- in Wasm-oriented or protocol-heavy code, these types line up with the data model you actually want
- in ordinary app code, they are usually heavier than `number` and should stay the exception

They are not just “numbers with more names.” They have different static and runtime semantics.

## When to use them

These types make the most sense for:

- binary formats and typed storage views
- protocol or file formats with exact widths
- arithmetic where overflow behavior matters
- Wasm-oriented data models
- domain types where `number` is too loose and too implicit

If the rest of the platform already speaks ordinary `number`, stay on `number`. The point is
precision, not turning every app into a systems language.

## See also

- [Builtin Modules](./builtin-modules.md)
- [Newtypes and Value Classes](./newtypes-and-value-classes.md)
- [Tooling and Workflow](../guides/tooling-and-js-target.md)
