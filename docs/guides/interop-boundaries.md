---
title: Interop Boundaries
description: How `.sts` files import regular TypeScript, JavaScript, and declaration-only code.
---

When an `.sts` file imports regular `.ts`, `.js`, or declaration-only code, mark the import with
`// #[interop]` so reviewers can see that the checked file depends on unchecked code.

## Importing ordinary code into `.sts`

When `.sts` imports ordinary `.ts`, JavaScript, or declaration-only packages, the import must cross `// #[interop]`:

```ts
// #[interop]
import { readConfig } from './legacy.ts';
```

## The basic model

- `.ts` stays ordinary TypeScript
- `.sts` opts into stricter checked rules
- `.ts` can import `.sts` through projected public TypeScript surfaces
- `.sts` importing regular code must mark the boundary

## Why `#[interop]` exists

Without an explicit marker, a checked file can look safer than it really is because the unchecked
dependency is easy to miss in review.

The marker makes that dependency:

- visible in source control
- easy to audit
- obvious in code review

## Related boundary annotations

### `#[extern]`

`#[extern]` is for local ambient runtime declarations inside `.sts`.

It is **not** the same as `#[interop]`.

`#[interop]` marks an import boundary.

`#[extern]` marks a local runtime-provided declaration boundary.

## Example boundary

```ts
// src/session.sts
// #[interop]
import { readCookieSession } from "../legacy/session.ts";

export async function requireSession(userId: string): Promise<Session | undefined> {
  const session = await readCookieSession(userId);

  if (session === undefined) {
    return undefined;
  }
  return session;
}
```

The point here is simple: the regular TypeScript dependency stays visible, and the local return type
matches what the file can actually produce.

:::tip Adoption rule of thumb
You can keep using existing TS and JS code. soundscript just makes the import visible instead of
letting it blend into the file.
:::

## See also

- [Adopt in Existing TypeScript Apps](../getting-started/adopt-in-existing-typescript-apps.md)
- [Errors and Failures](./errors-and-failures.md)
- [Banned and Restricted Surface](../reference/banned-and-restricted.md)
