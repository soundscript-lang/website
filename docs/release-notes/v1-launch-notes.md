---
title: V1 Launch Notes
description: The public summary of what soundscript 1.0 emphasizes for adopters.
---

This page is the public release summary for soundscript 1.0.

## What 1.0 emphasizes

soundscript 1.0 is centered on a practical TypeScript adoption story:

- checked `.sts` files
- the checker
- the compile workflow
- the CLI
- the VS Code extension
- the compiler-owned builtin module surface
- annotations, macros, and fixed-width numeric types

## What teams should do first

```bash
npm install --save-dev soundscript
npx soundscript init --mode existing
npx soundscript check --project tsconfig.soundscript.json
```

After that, pick one boundary-heavy module and move it into `.sts`.

## What this release does not claim

Do not present 1.0 as:

- a Wasm-first story
- a syntax-fork of TypeScript
- a demand to convert the whole repo
- a claim that every advanced feature is the first thing teams should learn

## Where to send readers next

- [Quick Start](../getting-started/quick-start.md)
- [soundscript vs TypeScript](../getting-started/soundscript-vs-typescript.md)
- [Tooling and Workflow](../guides/tooling-and-js-target.md)
