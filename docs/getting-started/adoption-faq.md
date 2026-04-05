---
title: Adoption FAQ
description: Common first-pass questions from TypeScript teams evaluating soundscript.
---

Here are short answers to the questions teams usually ask first.

## Is soundscript a different language from TypeScript?

It is still TypeScript syntax, but `.sts` follows stricter rules.

soundscript keeps standard TypeScript and JavaScript syntax. The main visible additions are:

- a second file type, `.sts`, for checked modules
- comment-attached annotations such as `// #[interop]` and `// #[newtype]`

That means a team can evaluate soundscript without adopting a new syntax dialect.

## Do we have to convert the whole repo?

No. That is explicitly not the intended adoption model.

Most teams start like this:

1. keep ordinary `.ts` files as ordinary TypeScript
2. convert one boundary-heavy module to `.sts`
3. make foreign dependencies explicit with `// #[interop]`
4. repeat only where the extra guarantees are worth the friction

## Can `.ts` import `.sts`?

Yes.

Ordinary TypeScript can consume a projected public TypeScript surface from a `.sts` module. The
explicit boundary marker is needed in the opposite direction, when `.sts` imports ordinary `.ts`,
JavaScript, or declaration-only packages.

## Can `.sts` still use npm packages?

Yes.

soundscript does not try to isolate `.sts` from the JS ecosystem. It just requires that the import
be marked so the boundary stays visible:

```ts
// #[interop]
import { z } from "zod";
```

That is the tradeoff: ecosystem access stays available, but unchecked code no longer enters sound
mode silently.

## What kinds of modules make good first migrations?

Good first targets are modules where bad assumptions already hurt:

- auth and session handling
- request decoding or JSON boundaries
- queues, retries, and workflow orchestration
- payments, billing, or entitlement logic
- shared utilities that already sit on trust boundaries

## What should we avoid first?

Usually save these for later:

- giant framework-heavy UI files
- deeply generic library abstractions
- modules already undergoing a major refactor
- anything that would force a large synchronized conversion across the repo

## Do we need fixed-width numeric types, newtypes, or variance right away?

No.

Those are real parts of the language surface, but they are not the first thing a regular TypeScript
app team needs. The starting point is:

- `.sts`
- explicit interop
- fewer escape hatches
- clearer runtime assumptions

Advanced features should come later, when a real domain problem justifies them.

## What about Wasm?

There is active work there, but these docs focus on the normal app workflow first.

## Are macros the main reason to adopt soundscript?

No.

Macros are part of the supported surface, but they still should not be the first thing most people
see when evaluating soundscript for application use. The docs keep macros later on purpose so the
main adoption story stays legible for regular TypeScript teams.

## What does soundscript actually guarantee?

It narrows the set of things a checked `.sts` module is allowed to assume or author.

It does **not** claim:

- whole-program proof over all `.ts` and `.js` in a repo
- removal of all JS runtime hazards
- silent trust of foreign code
- automatic conversion of JS runtime semantics into a new platform

The promise is simpler: checked `.sts` code should stay closer to what the runtime actually
guarantees, and imports from regular code should be visible.

## See also

- [Quick Start](./quick-start.md)
- [soundscript vs TypeScript](./soundscript-vs-typescript.md)
- [Adopt in Existing TypeScript Apps](./adopt-in-existing-typescript-apps.md)
