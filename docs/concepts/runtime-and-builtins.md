---
title: Runtime and Builtins
description: How the current runtime story, compile workflow, and compiler-owned builtin modules fit together.
---

This page explains the runtime story behind the CLI output and the `sts:*` builtin modules.

## The normal workflow

For most application teams, the path is simple:

- author `.sts`
- run `soundscript check`
- use `soundscript compile` to produce deployable output
- keep packaging and deployment close to how JS/TS teams already work

## Compiler-owned builtin modules

soundscript ships a focused builtin module surface under `sts:*`.

These modules are compiler-owned. They are not regular npm packages that happen to share a prefix.
That matters because the checker and compiler can reason about them directly.

```ts
import { normalizeThrown } from "sts:failures";
import { U8, type u8 } from "sts:numerics";
```

## The modules most app teams will notice first

### `sts:prelude`

Owns the small shared surface around core value-level helpers such as `Result` and `Option`.

### `sts:failures`

Owns `Failure`, `ErrorFrame`, and `normalizeThrown(...)` for the cases where code needs an explicit
normalized error value inside the current scope.

### `sts:json`

Owns JSON boundary helpers so parsing and stringifying can live on an explicit soundscript surface
instead of disappearing into unchecked assumptions.

### `sts:numerics`

Owns explicit fixed-width numeric types and helpers for the cases where host `number` semantics are
too implicit.

## Other builtin families

The wider supported builtin surface also includes:

- `sts:compare`
- `sts:hash`
- `sts:decode`
- `sts:encode`
- `sts:codec`
- `sts:derive`
- `sts:async`
- `sts:hkt`
- `sts:typeclasses`

Those are real parts of the surface, but most application teams should not need all of them on day
one.

## Why builtins exist at all

The builtin surface gives soundscript a place to define:

- standard failure boundaries
- standard decoding and encoding contracts
- standard numeric semantics where JS host numerics are not enough
- compiler-known helpers that stay consistent across tooling

This is different from “invent a huge new stdlib.” The builtin surface is intentionally focused.

## Builtins versus ecosystem packages

soundscript does **not** require you to avoid ordinary npm packages.

The model is:

- use `sts:*` when you want a compiler-owned surface
- use normal ecosystem packages when they solve the job
- mark the boundary explicitly when `.sts` depends on regular code

That keeps the language usable in existing JS/TS applications instead of turning every adoption into
an ecosystem fork.

## A note on Wasm-oriented features

Some builtin surfaces, especially fixed-width numerics and `#[value]`, matter more if you are
thinking about Wasm. The main docs path still starts with ordinary app code.

## See also

- [Tooling and Workflow](../guides/tooling-and-js-target.md)
- [Builtin Modules](../reference/builtin-modules.md)
- [Tooling and Workflow](../guides/tooling-and-js-target.md)
