---
title: Publishing Packages
description: How to publish libraries that use soundscript without making the package look unusual to normal JS or TypeScript consumers.
---

Most teams should treat package publishing as a second step. First get `.sts` working inside one
application repository, then worry about shipping a library.

## The basic package shape

Keep packages close to the existing JS ecosystem:

- publish ordinary compiled output
- publish `.d.ts` files for TypeScript consumers
- optionally ship original soundscript source plus package metadata for soundscript-aware tooling

That means a package should still look normal to ordinary JS and TS consumers.

## Start from compiled output

Use the normal compile command as the starting point:

```bash
npx soundscript compile --project tsconfig.soundscript.json
```

Build package artifacts from that output.

## Optional metadata for shipped source

If you want to ship original soundscript source, add metadata under `package.json#soundscript`.

A representative shape looks like this:

```json
{
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "soundscript": {
    "source": "./src/index.sts"
  }
}
```

The idea is simple:

- consumers get normal package output
- TS consumers get normal `.d.ts`
- soundscript-aware tooling can discover shipped source when you choose to publish it

## If you do not publish soundscript metadata

If a package does not publish valid soundscript source metadata, other soundscript code should treat
it as a foreign dependency and cross the boundary explicitly with `// #[interop]`.

That is intentional. Source publication is an advanced library feature, not the default.

## Advice for library authors

Start conservative:

- keep the public runtime contract ordinary
- prefer a narrow public API
- publish JS + `.d.ts` first
- add source-published soundscript metadata only when you have a concrete reason to support
  sound-to-sound consumption

This keeps the package readable for both regular TypeScript users and soundscript adopters.

## Check the exact metadata shape before publishing

The source-publishing metadata surface is narrower and more specialized than the normal app
adoption path. If you are shipping a library, verify the exact metadata shape against the toolchain
version you are targeting.

## See also

- [Tooling and Workflow](./tooling-and-js-target.md)
- [CLI Reference](../reference/cli.md)
