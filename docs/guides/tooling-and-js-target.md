---
title: Tooling and Workflow
description: The day-to-day tooling story for soundscript projects.
---

This guide covers the day-to-day workflow: install soundscript locally, run the CLI, wire up VS
Code, and keep CI on the same version.

## Install it locally

```bash
npm install --save-dev soundscript
```

The normal model is a workspace-local install that your editor, CI, and shell all agree on.

## CLI

The main commands are:

- `soundscript init`
- `soundscript check`
- `soundscript compile`
- `soundscript expand`
- `soundscript explain`
- `soundscript lsp`

## Machine-readable output

For automation and agent use:

```bash
npx soundscript check --format json
npx soundscript check --format ndjson
npx soundscript compile --format json
npx soundscript expand --format ndjson
npx soundscript explain SOUND1002
```

Exit codes are:

- `0` for success with no blocking diagnostics
- `1` for project diagnostics or unsupported-code findings
- `2` for CLI usage, configuration, or internal failures

In machine-readable modes, keep `stdout` reserved for the structured payload and treat `stderr` as
human logging or progress output.

## VS Code extension

The extension is expected to:

- resolve the workspace-installed soundscript version first
- fall back to PATH if needed
- keep project-local behavior aligned with CI and scripts

That resolution order matters. It keeps editor behavior pinned to the version the project actually
depends on instead of whatever happens to be globally installed on a machine.

## Normal workflow

The normal story is:

- author `.sts`
- check with `soundscript check`
- use `soundscript compile` for the compiler entrypoint
- use `soundscript expand` when you specifically want expanded TypeScript output for inspection
- ship the compiled artifacts

This is deliberately boring in the best way. Teams should be able to adopt soundscript without
changing package management, bundling, deployment shape, or runtime hosting.

## See also

- [Quick Start](../getting-started/quick-start.md)
- [CLI Reference](../reference/cli.md)
- [CI and Editor Setup](./ci-and-editor-setup.md)
