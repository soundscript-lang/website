---
title: Annotation Spec
description: The current comment-attached annotation surface in soundscript.
---

:::note Canonical source
This page mirrors the normative annotation reference in the soundscript repo:
[`docs/annotation-spec.md`](https://github.com/soundscript-lang/soundscript/blob/main/docs/annotation-spec.md).
:::

This reference lists the exact annotation surface soundscript supports.

Annotations are ordinary `//` comments that attach to the next import, declaration, or statement.
That is how soundscript adds metadata without changing TypeScript syntax.

## What they look like

```ts
// #[name]
// #[name(arg)]
// #[name(arg1, arg2, key: value)]
```

Rules:

- annotations live in standalone `//` comments
- contiguous standalone annotation lines form one annotation block
- a block attaches to the next node on the following line
- bare parser syntax like `#[name]` is not supported

## Builtin directives

Builtin directives:

- `extern`
- `interop`
- `newtype`
- `unsafe`
- `value`
- `variance`

## Macro definition annotations

Macro authoring modules use a separate annotation family:

```ts
// #[macro(call)]
export function twice() {}
```

Those annotations only appear inside `.macro.sts` files and define regular imported macros, not
compiler-only magic. See [Macros](./macros.md) for the authoring model and supported forms.

## Where each one attaches

- `#[interop]` attaches to import boundaries
- `#[extern]` attaches to local ambient runtime declarations
- `#[variance(...)]` attaches to generic interfaces and type aliases
- `#[newtype]` attaches to type aliases
- `#[value]` attaches to classes
- `#[unsafe]` attaches to local proof-override declarations or statements

## Why annotations are comment-attached

They let soundscript add boundary and contract metadata while keeping the source valid TypeScript.

That matters because teams can:

- keep ordinary TypeScript tooling in the repo
- review soundscript annotations as explicit contract markers
- avoid parser-only syntax that makes the codebase feel like a different language

## Forms with arguments

Today, only these builtin forms take arguments:

- `// #[variance(...)]`
- `// #[value(deep: true)]`

## `#[value]`

Supported forms:

```ts
// #[value]
class Point {}

// #[value(deep: true)]
class DeepPoint {}
```

Rules:

- the bare form is always allowed
- `deep: true` is the only supported argument-bearing form
- other argument shapes are rejected

## Typical examples

```ts
// #[interop]
import { loadConfig } from './legacy.ts';

// #[newtype]
type UserId = string;

// #[variance(T: out)]
interface Reader<T> {
  readonly current: T;
}
```

## What annotations do not do

The current annotation system does **not** include:

- parser-level `#[...]` syntax
- parameter annotations
- type-parameter annotations
- arbitrary type-expression macros

:::note
soundscript keeps TypeScript parser syntax. The annotation system is intentionally comment-attached instead of introducing a second parser language.
:::

## See also

- [Newtypes and Value Classes](./newtypes-and-value-classes.md)
- [Variance Contracts](./variance-contracts.md)
- [Macros](./macros.md)
