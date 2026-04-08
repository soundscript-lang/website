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

- `effects`
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

- `#[effects(...)]` attaches to callable declarations and callable type members, plus function-valued parameters for parameter-local negative contracts
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

- `// #[effects(...)]`
- `// #[variance(...)]`
- `// #[value(deep: true)]`

## `#[effects(...)]`

`effects` is the builtin effect-summary and effect-contract annotation.

Supported fields:

- `add`
- `forbid`
- `forward`
- `unknown`

Rules:

- effect names are open dotted identifiers such as `fails.rejects`, `host.io`, `host.node.fs`, and `host.browser.dom`
- `forward` must use parameter-rooted callable references or `{ from, rewrite?, handle? }` objects
- `unknown` currently only supports `unknown: [direct]`
- bodyful local callables may use `add`, `forbid`, and `forward`
- bodyful `add` is monotonic: it unions with inferred effects and never hides inferred lower-level behavior
- declaration-only callable surfaces use `add`, `forward`, and optionally `unknown`
- function-valued parameters use `forbid` only
- overload signatures with an implementation sibling must stay effect-unannotated
- there is no allow-list or "all except ..." surface in `#[effects(...)]`
- transitive effects stay honest, so policies like "allow database I/O but forbid other I/O" are not representable today without a different abstraction model

Most ordinary bodyful soundscript code should rely on inference alone. Explicit callable-level
`add` and `forward` are mainly for declaration frontiers and for the cases where you intentionally
widen or transform the honest inferred surface.

Quick example:

```ts
// #[effects(
//   add: [suspend.await],
//   forward: [{ from: callback, rewrite: [{ from: fails, to: fails.rejects }] }],
// )]
declare function toPromise<T>(callback: () => T): Promise<T>;
```

For the full current surface and semantics, see the canonical repo spec and the advanced guide:

- [Advanced Effects](../guides/advanced-effects.md)
- [`docs/annotation-spec.md` in the soundscript repo](https://github.com/soundscript-lang/soundscript/blob/main/docs/annotation-spec.md)

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
- arbitrary parameter annotations, except for `#[effects(...)]` on function-valued parameters
- type-parameter annotations
- arbitrary type-expression macros

:::note
soundscript keeps TypeScript parser syntax. The annotation system is intentionally comment-attached instead of introducing a second parser language.
:::

## See also

- [Advanced Effects](../guides/advanced-effects.md)
- [Newtypes and Value Classes](./newtypes-and-value-classes.md)
- [Variance Contracts](./variance-contracts.md)
- [Macros](./macros.md)
