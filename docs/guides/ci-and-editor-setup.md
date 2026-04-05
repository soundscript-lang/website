---
title: CI and Editor Setup
description: How to wire soundscript into scripts, CI, and VS Code without introducing version drift.
---

The best setup is boring: install soundscript in `devDependencies`, then use that same local
version in the shell, CI, and VS Code.

## Recommended package scripts

```json
{
  "scripts": {
    "sound:check": "soundscript check --project tsconfig.soundscript.json",
    "sound:check:json": "soundscript check --project tsconfig.soundscript.json --format json",
    "sound:compile": "soundscript compile --project tsconfig.soundscript.json"
  }
}
```

That gives you one stable place to call soundscript from:

- local development
- CI
- editor tasks
- future automation or bots

## CI

For a normal CI job, start with:

```bash
npm ci
npx soundscript check --project tsconfig.soundscript.json
```

If another tool needs structured findings, switch the check to `--format json` or `--format ndjson`.

## Machine-readable output

The CLI is designed so machine-readable output can drive tooling cleanly:

- `json` for one complete payload
- `ndjson` for line-oriented processing
- `soundscript explain <code>` for stable diagnostic help text

In those modes, treat `stdout` as the structured channel and `stderr` as human logging.

## VS Code

The important behavior is version resolution:

1. prefer the workspace-installed soundscript version
2. fall back to `PATH` only when needed

That order matters because it keeps the editor aligned with CI and the project’s local dependency,
instead of whichever binary happens to be installed globally on one developer machine.

## The `lsp` command

`soundscript lsp` exists as the stdio language-server entrypoint, but most developers should expect
the editor extension to launch it rather than running it by hand.

## Good operational defaults

- keep soundscript in `devDependencies`
- check one explicit project file such as `tsconfig.soundscript.json`
- avoid global installs as the primary workflow
- use machine-readable output only where another tool actually consumes it

This keeps the setup boring, which is the right goal for build and editor tooling.

## See also

- [Quick Start](../getting-started/quick-start.md)
- [Tooling and Workflow](./tooling-and-js-target.md)
- [CLI Reference](../reference/cli.md)
