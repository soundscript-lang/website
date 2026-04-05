---
slug: /
title: Introduction
description: soundscript is a stricter subset of TypeScript for teams that want stronger guarantees in critical code.
---

soundscript is a stricter subset of TypeScript for projects that want stronger guarantees in
critical code. It keeps ordinary TypeScript syntax and lets teams tighten specific modules without
rewriting the rest of the codebase or replacing their existing TS tools.

## The core idea

Most TypeScript teams do not need a new language. They need stronger guarantees in the parts of the
system where a bad assumption turns into a production incident.

soundscript lets you keep normal `.ts` for ordinary code and move the sensitive parts of the system
into `.sts`. Because it is still a TypeScript subset, existing editor support, linting, formatting,
and project tooling continue to work:

```ts title="session.sts"
// #[interop]
import { readSession } from '../legacy/session.ts';

export async function requireSession(userId: string) {
  const session = await readSession(userId);

  if (session === undefined) {
    return undefined;
  }

  return session;
}
```

That example shows the core adoption pattern:

- keep TypeScript syntax
- keep your existing TypeScript tools
- cross into ordinary code explicitly
- check what comes back instead of assuming it
- let the checker enforce the stricter local rules

## Who this is for

soundscript is a good fit for TypeScript application teams that want stronger guarantees in:

- request handling and boundary-heavy services
- auth, payments, and workflow orchestration
- decoding and serialization code
- package or app surfaces where runtime mistakes are expensive

It is not aimed at teams looking for a completely separate language, a frontend playground-first
experience, or a rewrite of the entire JavaScript ecosystem.

## Start here

If you are evaluating the project for real use, follow this order:

1. [Quick Start](./getting-started/quick-start.md)
2. [soundscript vs TypeScript](./getting-started/soundscript-vs-typescript.md)
3. [Adopt in Existing TypeScript Apps](./getting-started/adopt-in-existing-typescript-apps.md)
4. [Tooling and Workflow](./guides/tooling-and-js-target.md)

## How the docs are organized

- **Getting Started** is for first contact and adoption decisions.
- **Adoption Guides** covers the first real boundaries most teams hit.
- **Core Concepts** explains the soundness model and runtime shape.
- **How-to Guides** covers tooling, CI, and publishing workflows.
- **Reference** is the deeper material for annotations, macros, numerics, diagnostics, and builtin modules.
- **Release Notes / Versions** explains the versioning and release policy for the docs site.

## See also

- [Quick Start](./getting-started/quick-start.md)
- [soundscript vs TypeScript](./getting-started/soundscript-vs-typescript.md)
- [Tooling and Workflow](./guides/tooling-and-js-target.md)
