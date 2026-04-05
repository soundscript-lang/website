---
title: Builtin Modules
description: The `sts:*` builtin modules and when they matter in normal soundscript code.
---

:::note Canonical source
This page mirrors the builtin contract in the soundscript repo, especially
[`docs/v1-user-contract.md`](https://github.com/soundscript-lang/soundscript/blob/main/docs/v1-user-contract.md)
and the `src/stdlib/` module surface.
:::

This page explains the `sts:*` builtin modules and when they matter in normal soundscript code.

soundscript owns a focused builtin module surface under `sts:*`. These are built into the language
toolchain, not ordinary userland packages.

## Builtins most teams notice first

### `sts:prelude`

Small helpers around common result- and option-style flows.

### `sts:failures`

Failure-oriented utilities such as `Failure`, `ErrorFrame`, and `normalizeThrown(...)`.

### `sts:json`

Helpers for parsing, stringifying, and working at JSON boundaries.

### `sts:numerics`

Explicit fixed-width numeric types and helpers.

```ts
import { type Failure, normalizeThrown } from "sts:failures";
import { U8, type u8 } from "sts:numerics";
```

## Other builtin families

The wider surface also includes:

- `sts:compare`
- `sts:component`
- `sts:css`
- `sts:debug`
- `sts:hash`
- `sts:decode`
- `sts:encode`
- `sts:codec`
- `sts:derive`
- `sts:async`
- `sts:fetch`
- `sts:graphql`
- `sts:hkt`
- `sts:json`
- `sts:match`
- `sts:macros`
- `sts:random`
- `sts:result`
- `sts:sql`
- `sts:text`
- `sts:thunk`
- `sts:typeclasses`
- `sts:url`
- `sts:value`

## Why this surface exists

The builtin modules give soundscript a place to define shared contracts for:

- failure handling
- decoding and encoding
- comparison and hashing
- explicit numeric semantics
- small pieces of shared abstraction machinery

This is not meant to replace the npm ecosystem. The builtin surface stays focused on the places
where the language needs shared contracts.

## When to reach for them

Use builtins when they line up directly with the problem:

- `sts:failures` at foreign boundaries
- `sts:json` at JSON boundaries
- `sts:numerics` when host numerics are too implicit

`normalizeThrown(...)` is mainly for the cases where you need the normalized error value inside the
current function. Propagating throws does not require you to call it manually.

If a normal ecosystem package is the right tool, use it and mark the boundary explicitly.

## What most teams can ignore at first

Some builtin families are more advanced and should not dominate the first-run story for app teams:

- `sts:hkt`
- `sts:typeclasses`
- macro-oriented surfaces such as `sts:macros`

They are part of the language, but most developers do not need them right away.

## See also

- [Runtime and Builtins](../concepts/runtime-and-builtins.md)
- [Fixed-Width Numeric Types](./machine-numerics.md)
- [Macros](./macros.md)
