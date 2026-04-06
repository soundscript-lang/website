---
title: Builtin Modules
description: The `sts:*` builtin modules and the everyday patterns they support.
---

:::note Canonical source
This page mirrors the builtin contract in the soundscript repo, especially
[`docs/reference/builtin-modules.md`](https://github.com/soundscript-lang/soundscript/blob/main/docs/reference/builtin-modules.md)
and [`docs/v1-user-contract.md`](https://github.com/soundscript-lang/soundscript/blob/main/docs/v1-user-contract.md).
:::

This page is the first-stop reference for the builtin surface most teams use in practice.

## Ambient `.sts` Names

Checked `.sts` files get the core prelude names injected automatically, so you can use the common
sound-path helpers without repeating imports in every file.

The ambient names are:

- carriers and constructors: `Result`, `Option`, `Ok`, `Err`, `Some`, `None`, `ok`, `err`,
  `some`, `none`
- control-flow helpers: `Try`, `Match`, `where`, `Defer`
- carrier guards: `isOk`, `isErr`, `isSome`, `isNone`
- failure helpers and terminal helpers: `Failure`, `todo`, `unreachable`

## `sts:prelude`

`sts:prelude` is the explicit import form of the same core surface.

Use it when you want the prelude names in a file that prefers imports, or when you want an import
statement to make the ownership boundary obvious.

It re-exports the same core values and types.

## Stable Leaf Modules

The stable `sts:*` surface stays focused and composable.

- `sts:result` owns the canonical `Result` / `Option` carriers and result-first helpers such as
  `mapErr`, `tapErr`, `unwrapOr`, `unwrapOrElse`, and `collect`.
- `sts:match` owns `Match` and `where`.
- `sts:failures` owns `Failure`, `ErrorFrame`, and `normalizeThrown(...)`.
- `sts:json` owns JSON boundary helpers for parsing, stringifying, and plain JSON validation, plus
  small record helpers such as `isJsonObject`, `emptyJsonRecord`, `copyJsonRecord`, and
  `mergeJsonRecords`.
- `sts:decode` owns decoder contracts and structural decode helpers such as `literal`,
  `nullable`, `defaulted`, and `readonlyRecord`.
- `sts:encode` owns encoder contracts and basic encode combinators.
- `sts:codec` owns codec contracts and adapter helpers.
- `sts:async` owns `Task<T, E>` and result-first async helpers.
- `sts:compare` owns `Eq`, `Order`, and comparator composition helpers.
- `sts:hash` owns hashing and equality-key protocols.
- `sts:derive` owns compiler-provided declaration macros such as `eq`, `hash`, `decode`, `encode`,
  `codec`, and `tagged`.
- `sts:hkt` owns low-level higher-kinded type machinery.
- `sts:typeclasses` owns `Functor`, `Applicative`, `Monad`, `AsyncMonad`, and `Do`.
- `sts:url`, `sts:fetch`, `sts:text`, and `sts:random` are the initial portable leaf modules.

## Experimental Modules

The repository also includes implemented builtin modules that stay outside the stable v1 contract.

- `sts:numerics`
- `sts:value`
- `sts:thunk`
- `sts:sql`
- `sts:css`
- `sts:graphql`
- `sts:debug`
- `sts:experimental/*`

## See Also

- [Idiomatic SoundScript](../guides/idiomatic-soundscript.md)
- [Runtime and Builtins](../concepts/runtime-and-builtins.md)
