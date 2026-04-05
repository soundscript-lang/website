---
title: Banned and Restricted Surface
description: The grouped summary of what soundscript rejects or treats more conservatively.
---

:::note Canonical source
This page mirrors the restriction story in the soundscript repo, especially
[`docs/v1-user-contract.md`](https://github.com/soundscript-lang/soundscript/blob/main/docs/v1-user-contract.md)
and the checker diagnostics reference in
[`docs/diagnostics.md`](https://github.com/soundscript-lang/soundscript/blob/main/docs/diagnostics.md).
:::

This page groups the main things `.sts` forbids or tightens.

These are not style rules. They are the places where soundscript stops TypeScript code from
claiming more than the runtime has actually proved.

## Unchecked escape hatches

These are rejected because they let source code claim facts the runtime has not proved:

- `any`
- unchecked `as`
- non-null assertion `!`

```ts
const user = raw as User; // reject
const id = maybeId!; // reject
let cache: any = value; // reject
```

## Control-flow shortcuts

These are restricted because they blur concrete runtime states:

- non-boolean conditions
- truthiness in places where the source really means `undefined`, `null`, empty string, or zero
- throwing non-`Error` values

```ts
if (input) { /* reject */ }
throw "bad"; // reject
```

## Interop and ambient declaration boundaries

These are restricted because imports and runtime declarations need to stay explicit:

- importing ordinary `.ts`, JavaScript, or declaration-only code from `.sts` without `// #[interop]`
- local ambient runtime declarations in `.sts` without `// #[extern]`
- exported ambient runtime declarations from `.sts`
- global or module augmentation inside `.sts`

## Metaprogramming hazards

These are restricted because they make runtime behavior too dynamic to check well:

- `Proxy`
- `eval`
- `Function`
- `__proto__`
- non-class prototype programming
- broad reflection-heavy hazard families

## Callable and async hazards

These are restricted because receiver or async behavior can drift away from what the type surface
appears to promise:

- extracted receiver-sensitive methods or accessors
- rebinding with `bind`, `call`, `apply`, or `Reflect.apply`
- structural thenables / `PromiseLike<T>` in sound-authored async surfaces
- Promise subclassing as a sound surface

## Class and initialization hazards

These are restricted because object construction must not expose half-initialized state:

- constructor-time instance dispatch
- escaping `this` during initialization
- reading fields before definite initialization
- runtime decorators in `.sts`

## Type-surface restrictions

These are tighter because structural compatibility can overstate runtime safety:

- unsound mutable assignment relations
- overclaimed variance contracts
- class-to-class widening based only on matching public shape
- declaration merging that invents phantom instance members

## Target-aware families

Some surfaces are not globally banned, but they are target-aware rather than universally portable.

The main example is weak/finalization families:

- available on JS-oriented targets where the host supports them
- not part of the portable `wasm-wasi` baseline

## The overall rule

If a feature makes it too easy for the source to hide runtime risk, `.sts` either forbids it or
treats it more conservatively.

## See also

- [soundscript vs TypeScript](../getting-started/soundscript-vs-typescript.md)
- [Diagnostics](./diagnostics.md)
- [Interop Boundaries](../guides/interop-boundaries.md)
