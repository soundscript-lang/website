---
title: Soundness Model
description: What soundscript is actually claiming, and what it is intentionally not claiming.
---

This page explains what soundscript means by “sound,” in plain English.

In plain English, “sound” means checked code is not allowed to pretend something is safe when the
runtime has not actually proved it.

soundscript is not trying to prove “all of TypeScript is sound.” It creates a smaller contract for
`.sts` files inside the existing JS/TS ecosystem.

## The core claim

When code is authored in `.sts`, the goal is a soundly typed language. If a codebase is fully
soundscript and the checker accepts an unsound program, that is a bug in soundscript.

In practice that means `.sts` removes whole families of type-system shortcuts that TypeScript still
allows:

- `any`
- unchecked assertions
- non-null assertions
- truthiness-based control flow
- implicit trust of foreign imports
- arbitrary thrown values

That does **not** mean the module becomes independent from JavaScript reality. It means the checked
surface is smaller, stricter, and explicit about where trust enters the system.

This is not a “safer if you are lucky” claim. In a codebase that stays fully inside `.sts`,
soundness is the goal. If that goal fails, the language is wrong, not the user.

## Why `.sts` exists

soundscript uses a second file type because it is trying to solve two problems at once:

1. give authors stronger guarantees where they want them
2. avoid forcing a whole-repo rewrite to get those guarantees

That split keeps the adoption story clear in code review:

- `.ts` means ordinary TypeScript rules
- `.sts` means stricter checked rules

## Boundaries are part of the model

If an `.sts` file imports regular TypeScript or JavaScript, the source must say so:

```ts
// #[interop]
import { readConfig } from "./legacy.ts";
```

That annotation is not decorative. It does real work:

- checked local code is stricter
- foreign code is still usable
- the boundary to unchecked code is visible instead of implicit

## Validation replaces escape hatches

In plain TypeScript, it is common to use `as` or `!` when a developer believes a value is safe.

soundscript pushes that belief into control flow instead:

```ts
const raw = JSON.parse(input);

if (
  typeof raw === "object" &&
  raw !== null &&
  "userId" in raw &&
  typeof raw.userId === "string"
) {
  return raw.userId;
}

throw new Error("Invalid payload.");
```

That is more verbose than `raw as Payload`, but it is also the behavior the runtime can actually
defend.

## What soundscript does not claim

soundscript is still running on the same platform:

- `null` and `undefined` still exist
- foreign code can still throw arbitrary values
- host `number` still behaves like JavaScript `number`
- `.sts` code can still depend on regular code, but only through explicit boundaries

This is why the project is best described as a stricter TypeScript subset, not a separate runtime.

## Why the rules feel stricter

Many of the rules are there because the TypeScript type system lets authors express beliefs that the
runtime never actually enforces.

Examples:

- truthiness does not tell you whether a value is specifically `undefined`
- `as` does not validate data
- `!` does not prove non-nullness
- structural compatibility does not always mean two values are safely interchangeable at runtime

soundscript removes those gaps where it can. The ones it cannot remove in a mixed codebase stay
visible through things like `// #[interop]`.

## The practical result

The main practical change is not “more theory.” It is better local reasoning:

- a reviewer can see where trust enters the module
- a maintainer can tell whether an assumption was checked or only asserted
- a boundary-heavy module can become meaningfully safer without converting the entire repo

## See also

- [soundscript vs TypeScript](../getting-started/soundscript-vs-typescript.md)
- [Interop Boundaries](../guides/interop-boundaries.md)
- [Banned and Restricted Surface](../reference/banned-and-restricted.md)
