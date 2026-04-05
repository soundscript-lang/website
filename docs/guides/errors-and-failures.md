---
title: Errors and Failures
description: How soundscript wants local failure paths, foreign throws, and explicit boundaries to work.
---

This guide covers the practical failure rules in `.sts`, especially what to throw locally and what
to do when regular TS or JS throws something strange.

## Local code throws `Error`

Inside `.sts`, local failure paths should throw `Error` values:

```ts
if (session === undefined) {
  throw new Error("Missing session.");
}
```

This rule exists because arbitrary thrown values are hard to reason about and easy to mishandle.

## When regular TS or JS throws something weird

Interop code can still throw anything. That is part of the honest JS platform model.

If that throw keeps propagating, soundscript normalizes it automatically.

Use `normalizeThrown(...)` only when you need a normalized error value inside the current function,
for example to log it, attach metadata, or return it in a value-level result:

```ts
// #[interop]
import { readCookieSession } from "../legacy/session.ts";

import { normalizeThrown } from "sts:failures";

export async function loadSession(userId: string): Promise<Result<Session, Error>> {
  try {
    const session = await readCookieSession(userId);

    if (session === undefined) {
      return { tag: "err", error: new Error("Missing session.") };
    }
    return { tag: "ok", value: session };
  } catch (error) {
    const normalized = normalizeThrown(error);
    reportSessionFailure(normalized);
    return { tag: "err", error: normalized };
  }
}
```

That gives you an explicit error value to work with inside the function. It is different from
rethrowing, which does not need manual normalization.

## When to use thrown errors versus value-level failures

As a practical rule:

- throw `Error` for local operational failures inside one module or request flow
- use value-level failure types such as `Result` when the API should expose failure in the type
- call `normalizeThrown(...)` only when you need the normalized value in hand

Most teams can start with ordinary `Error`-based code and introduce richer failure values only where
the public API really benefits from them.

## Why it matters

TypeScript often lets failure behavior disappear behind unchecked assumptions:

- a foreign function might throw a string
- a JSON parser result might be asserted into shape
- a promise rejection might be treated as if it were always an `Error`

soundscript does not erase those problems. It asks the source to handle them directly.

## Practical advice

Use boundary helpers where they buy clarity:

- request decoding
- JSON parsing
- interop-heavy infrastructure code
- queue and workflow layers
- persistence adapters

These are the places where “what can fail here?” should be obvious from the module body.

## See also

- [Interop Boundaries](./interop-boundaries.md)
- [Builtin Modules](../reference/builtin-modules.md)
- [Diagnostics](../reference/diagnostics.md)
