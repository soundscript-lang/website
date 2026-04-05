---
title: Quick Start
description: Install soundscript in an existing TypeScript project, check your first .sts file, and wire up the editor.
---

This guide gets soundscript running in an existing TypeScript project. Install the toolchain, check
one real `.sts` file, and see how the workflow fits into a normal app.

## 1. Install the CLI locally

```bash
npm install --save-dev soundscript
npx soundscript init --mode existing
```

`init --mode existing` adds soundscript project files alongside your current TypeScript setup rather
than trying to replace it.

## 2. Create a first `.sts` module

Pick a small module that already sits at a boundary. A session loader, parser, permission check, or
payment helper is usually better than a broad utility file.

```ts title="src/session.sts"
// #[interop]
import { readCookieSession } from '../legacy/session.ts';

export async function requireSession(userId: string): Promise<Session | undefined> {
  const session = await readCookieSession(userId);

  if (session === undefined) {
    return undefined;
  }
  return session;
}
```

This file shows the first three things most teams need:

- explicit interop with ordinary code
- a local return type that matches what can really happen
- stricter local control flow than ordinary TypeScript

## 3. Run the checker

```bash
npx soundscript check --project tsconfig.soundscript.json
```

If the checker finds issues, fix the local proof gaps first. Common early changes are:

- replacing `any`, `as`, and non-null assertions
- making truthiness checks explicit
- marking imports from ordinary `.ts`, `.js`, or `.d.ts` with `// #[interop]`
- tightening return types and local checks around boundary code

## 4. Compile the project

```bash
npx soundscript compile --project tsconfig.soundscript.json
```

The normal workflow is simple: check `.sts`, compile, and keep the rest of your npm and Node setup
around that output.

## 5. Use the VS Code extension

Install the soundscript VS Code extension, then keep the `soundscript` package installed in the
workspace. The extension prefers the workspace version instead of silently drifting to some other
global version.

That means the right editor workflow is:

```bash
npm install --save-dev soundscript
```

and then opening the project in VS Code.

## 6. Add package scripts

```json title="package.json"
{
  "scripts": {
    "sound:check": "soundscript check --project tsconfig.soundscript.json",
    "sound:compile": "soundscript compile --project tsconfig.soundscript.json"
  }
}
```

Add these once the local run works. It keeps CI and editor instructions aligned with what
developers already run by hand.

## What to read next

- [soundscript vs TypeScript](./soundscript-vs-typescript.md)
- [Adopt in Existing TypeScript Apps](./adopt-in-existing-typescript-apps.md)
- [Tooling and Workflow](../guides/tooling-and-js-target.md)
