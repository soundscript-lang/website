---
title: Adopt in Existing TypeScript Apps
slug: /getting-started/adopt-in-existing-typescript-apps
description: The practical migration path for teams adopting soundscript inside a working TypeScript application.
---

You do not need to convert the repo. Start where stronger guarantees pay for themselves, and expand
only if the new checked file is earning its keep.

## Start with modules that already act like trust boundaries

Good first targets are usually:

- request and queue handlers
- decoders, parsers, and validation layers
- auth and permission checks
- package entrypoints or app service boundaries
- code that already wraps risky legacy or third-party behavior

Avoid broad utility folders or heavily shared framework glue as your first migration target.

## A practical first week

1. Install `soundscript` locally and run `soundscript init --mode existing`.
2. Pick one boundary-heavy module and rename it to `.sts`.
3. Mark every ordinary `.ts`, `.js`, or declaration-only import with `// #[interop]`.
4. Remove unchecked escapes like `any`, `as`, and non-null assertions.
5. Make local failure paths and conditions explicit.
6. Add `soundscript check` to package scripts and CI.

That is enough to learn how soundscript feels without turning the rollout into a rewrite project.

## Example migration boundary

```ts title="src/payments/charge.sts"
// #[interop]
import { chargeCard } from '../legacy/payments.ts';

export async function runCharge(request: ChargeRequest): Promise<ChargeReceipt | undefined> {
  const receipt = await chargeCard(request);

  if (receipt.status !== 'ok') {
    return undefined;
  }
  return receipt;
}
```

This is a good first migration because:

- the boundary to legacy code is obvious
- the failure path matters
- the module already sits at a real app boundary

## What usually changes first

The first `.sts` modules rarely need advanced features. Most early fixes are just:

- explicit `undefined` and `null` checks
- replacing assertion-based typing with validation or narrowing
- local `Error` discipline
- marked imports from regular TS or JS

That is a good sign. It means the adoption is already paying off before you reach for fixed-width
numeric types, macros, or advanced variance work.

## What not to migrate first

Defer these until the team is comfortable with the basics:

- dense UI glue code
- broad helper libraries with unclear ownership
- reflection-heavy adapters
- low-value leaf utilities with little boundary risk
- framework internals where the team is still experimenting with architecture

## Signs a module is a bad first target

It is probably not a good first migration if:

- most of the file is framework ceremony
- the file is shared everywhere but trusted nowhere
- it relies on metaprogramming or very loose ambient assumptions
- the team cannot yet explain what the runtime boundary actually is

## See also

- [Quick Start](./quick-start.md)
- [soundscript vs TypeScript](./soundscript-vs-typescript.md)
- [Interop Boundaries](../guides/interop-boundaries.md)
